// ============================================================
// Cerebro: red neuronal de texto desde cero.
// - Embeddings entrenables (vocab × dim)
// - Codificador (mean-pool → Dense → Dense → L2) para recuperación
// - Cabeza de lenguaje (contexto → Dense → Dense → softmax) para generar
// Entrenamiento: cross-entropy (siguiente palabra) + contrastivo (query↔chunk)
// ============================================================

import { type Matrix, zeros, dot, l2norm, cosine } from "./tensor";
import { Dense, Embedding } from "./layers";
import { AdamDense, AdamMatrix } from "./optimizer";
import { Tokenizer } from "./tokenizer";

export const EMB_DIM = 32;
export const ENC_HIDDEN = 64;
export const LM_HIDDEN = 96;
export const LM_CONTEXT = 8;
export const TEMP = 0.8;

export interface BrainConfig {
  embDim: number;
  encHidden: number;
  lmHidden: number;
  lmContext: number;
  vocabSize: number;
}

export interface ChunkIndex {
  id: string;
  titulo: string;
  contenido: string;
  vec: number[];
}

/** Mini-batch de un array, barajado. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((s, e) => s + e, 0);
  return exps.map((e) => e / sum);
}

export class Brain {
  tokenizer: Tokenizer;
  embed: Embedding;
  enc1: Dense;
  enc2: Dense;
  lm1: Dense;
  lm2: Dense;

  private optEmbed: AdamMatrix;
  private optEnc1: AdamDense;
  private optEnc2: AdamDense;
  private optLm1: AdamDense;
  private optLm2: AdamDense;

  chunks: ChunkIndex[] = [];
  lossHistory: number[] = [];
  trained = false;

  constructor(
    public config: BrainConfig = {
      embDim: EMB_DIM,
      encHidden: ENC_HIDDEN,
      lmHidden: LM_HIDDEN,
      lmContext: LM_CONTEXT,
      vocabSize: 0,
    }
  ) {
    this.tokenizer = new Tokenizer();
    const d = config.embDim;
    this.embed = new Embedding(config.vocabSize || 100, d);
    this.enc1 = new Dense(d, config.encHidden, "relu");
    this.enc2 = new Dense(config.encHidden, d, "linear");
    this.lm1 = new Dense(d * config.lmContext, config.lmHidden, "relu");
    this.lm2 = new Dense(config.lmHidden, config.vocabSize || 100, "linear");

    this.optEmbed = new AdamMatrix(this.embed.E, 0.01);
    this.optEnc1 = new AdamDense(this.enc1, 0.005);
    this.optEnc2 = new AdamDense(this.enc2, 0.005);
    this.optLm1 = new AdamDense(this.lm1, 0.005);
    this.optLm2 = new AdamDense(this.lm2, 0.005);
  }

  /** Entrena tokenizador y reconstruye capas con el vocabulario del corpus. */
  buildFromCorpus(texts: string[], minFreq = 1) {
    this.tokenizer.train(texts, minFreq);
    const V = this.tokenizer.vocabSize;
    const d = this.config.embDim;
    this.config.vocabSize = V;
    this.embed = new Embedding(V, d);
    this.enc1 = new Dense(d, this.config.encHidden, "relu");
    this.enc2 = new Dense(this.config.encHidden, d, "linear");
    this.lm1 = new Dense(d * this.config.lmContext, this.config.lmHidden, "relu");
    this.lm2 = new Dense(this.config.lmHidden, V, "linear");
    this.optEmbed = new AdamMatrix(this.embed.E, 0.01);
    this.optEnc1 = new AdamDense(this.enc1, 0.005);
    this.optEnc2 = new AdamDense(this.enc2, 0.005);
    this.optLm1 = new AdamDense(this.lm1, 0.005);
    this.optLm2 = new AdamDense(this.lm2, 0.005);
    this.trained = false;
    this.lossHistory = [];
  }

  /** Codifica un texto en un vector L2-normalizado (para recuperación). */
  encode(text: string): number[] {
    const ids = this.tokenizer.encode(text);
    const pooled = this.embed.forward([ids])[0];
    const h = this.enc1.forward([pooled])[0];
    const v = this.enc2.forward([h])[0];
    const n = l2norm(v);
    return v.map((x) => x / n);
  }

  /** Codifica guardando intermedios para poder hacer backward. */
  private encodeCached(ids: number[]) {
    const pooled = this.embed.forward([ids])[0];
    const h = this.enc1.forward([pooled])[0];
    const v = this.enc2.forward([h])[0];
    const n = l2norm(v);
    const vec = v.map((x) => x / n);
    return { ids, pooled, h, v, norm: n, vec };
  }

  /**
   * Backprop por el codificador completo (L2 → enc2 → enc1 → embed).
   * dOut: gradiente w.r.t. el vector final normalizado (vec).
   * Acumula grads en los optimizadores y da un paso.
   */
  private backwardEncoder(
    cache: { ids: number[]; pooled: number[]; h: number[]; v: number[]; norm: number; vec: number[] },
    dOut: number[],
    lrScale = 1
  ) {
    // gradiente w.r.t. v (pre-norm) desde dOut (w.r.t. vec = v/norm):
    // dv = (dOut - vec * dot(dOut, vec)) / norm
    const dotDV = dOut.reduce((s, x, i) => s + x * cache.vec[i], 0);
    const dv = dOut.map((x, i) => (x - cache.vec[i] * dotDV) / cache.norm);
    // enc2 backward
    const g2 = this.enc2.backward([dv]);
    this.optEnc2.step(g2.dW.map((r) => r.map((x) => x * lrScale)), g2.db.map((x) => x * lrScale));
    // enc1 backward
    const g1 = this.enc1.backward(g2.dx);
    this.optEnc1.step(g1.dW.map((r) => r.map((x) => x * lrScale)), g1.db.map((x) => x * lrScale));
    // embed backward (mean-pool)
    const dE = this.embed.backward([cache.ids], g1.dx);
    this.optEmbed.step(dE.map((r) => r.map((x) => x * lrScale)));
  }

  /** Concatena los embeddings de una ventana de contexto (longitud ctx) en un vector plano. */
  private windowVec(window: number[]): number[] {
    const out: number[] = [];
    for (let t = 0; t < this.config.lmContext; t++) {
      const id = window[t] ?? this.tokenizer.padId;
      const emb = this.embed.E[id] ?? new Array(this.config.embDim).fill(0);
      for (let d = 0; d < this.config.embDim; d++) out.push(emb[d]);
    }
    return out;
  }

  /** Un paso de entrenamiento LM (siguiente palabra) sobre un lote de secuencias. Devuelve loss promedio. */
  private lmStep(seqs: number[][]): number {
    const ctx = this.config.lmContext;
    const batchX: number[][] = [];
    const windows: number[][] = [];
    const targets: number[] = [];
    for (const seq of seqs) {
      if (seq.length < 2) continue;
      for (let i = 1; i < seq.length; i++) {
        const start = Math.max(0, i - ctx);
        const window = seq.slice(start, i);
        while (window.length < ctx) window.unshift(this.tokenizer.padId);
        batchX.push(this.windowVec(window));
        windows.push(window);
        targets.push(seq[i]);
      }
    }
    if (batchX.length === 0) return 0;
    const h1 = this.lm1.forward(batchX);
    const logits = this.lm2.forward(h1);
    let loss = 0;
    const batch = logits.length;
    const V = this.config.vocabSize;
    const dLogits = zeros(batch, V);
    for (let i = 0; i < batch; i++) {
      const probs = softmax(logits[i]);
      loss += -Math.log(probs[targets[i]] + 1e-12);
      for (let v = 0; v < V; v++) dLogits[i][v] = probs[v];
      dLogits[i][targets[i]] -= 1;
    }
    loss /= batch;
    // backprop
    const g2 = this.lm2.backward(dLogits);
    this.optLm2.step(g2.dW, g2.db);
    const g1 = this.lm1.backward(g2.dx);
    this.optLm1.step(g1.dW, g1.db);
    // propaga dx (batch × embDim*ctx) a cada embedding de la ventana
    const dE = zeros(this.tokenizer.vocabSize, this.config.embDim);
    const dim = this.config.embDim;
    for (let i = 0; i < batch; i++) {
      for (let t = 0; t < ctx; t++) {
        const id = windows[i][t] ?? this.tokenizer.padId;
        if (id < 0 || id >= this.tokenizer.vocabSize) continue;
        for (let d = 0; d < dim; d++) dE[id][d] += g1.dx[i][t * dim + d];
      }
    }
    this.optEmbed.step(dE);
    return loss;
  }

  /** Paso contrastivo (InfoNCE): (query, positive) → sim alta; (query, negatives) → sim baja. Backprop real. */
  private contrastiveStep(pairs: { q: string; pos: string; negs: string[] }[]): number {
    let loss = 0;
    const tau = 0.1;
    for (const p of pairs) {
      const qCache = this.encodeCached(this.tokenizer.encode(p.q));
      const posCache = this.encodeCached(this.tokenizer.encode(p.pos));
      const negCaches = p.negs.map((n) => this.encodeCached(this.tokenizer.encode(n)));

      const allCaches = [posCache, ...negCaches];
      const sims = allCaches.map((c) => dot(qCache.vec, c.vec) / tau);
      const probs = softmax(sims);
      loss += -Math.log(probs[0] + 1e-12);

      // Gradientes de -log softmax(sims)[0]:
      // dL/d sims[j] = probs[j] - (j==0 ? 1 : 0)
      // dL/d q.vec   = sum_j dL/d sims[j] * (c_j.vec / tau)
      // dL/d c_j.vec = dL/d sims[j] * (q.vec / tau)
      const dSims = probs.map((pr, j) => pr - (j === 0 ? 1 : 0));

      const dQvec = new Array(qCache.vec.length).fill(0);
      allCaches.forEach((c, j) => {
        for (let i = 0; i < dQvec.length; i++) dQvec[i] += (dSims[j] * c.vec[i]) / tau;
      });

      const dPos = posCache.vec.map((_, i) => (dSims[0] * qCache.vec[i]) / tau);
      this.backwardEncoder(posCache, dPos, 1);
      negCaches.forEach((c, idx) => {
        const dNeg = c.vec.map((_, i) => (dSims[idx + 1] * qCache.vec[i]) / tau);
        this.backwardEncoder(c, dNeg, 1);
      });
      this.backwardEncoder(qCache, dQvec, 1);
    }
    return loss / Math.max(pairs.length, 1);
  }

  /**
   * Entrena el cerebro sobre un corpus de textos y pares (pregunta, fragmento relevante).
   * Devuelve historial de loss por época.
   */
  train(
    texts: string[],
    qaPairs: { pregunta: string; respuesta: string }[] = [],
    epochs = 12,
    onEpoch?: (epoch: number, loss: number) => void
  ): number[] {
    if (texts.length === 0 && qaPairs.length === 0) return [];
    // corpus de secuencias tokenizadas
    const allTexts = [...texts, ...qaPairs.flatMap((p) => [`${p.pregunta} ${p.respuesta}`])];
    this.buildFromCorpus(allTexts, 1);

    const seqs = allTexts.map((t) => this.tokenizer.encode(t, { addBos: true, addEos: true }));
    const validSeqs = seqs.filter((s) => s.length >= 2);
    if (validSeqs.length === 0) return [];

    // pares contrastivos a partir de QA: pos = respuesta, negs = otras respuestas
    const contrastPairs: { q: string; pos: string; negs: string[] }[] = [];
    if (qaPairs.length >= 2) {
      for (let i = 0; i < qaPairs.length; i++) {
        const negs = qaPairs.filter((_, j) => j !== i).slice(0, 3).map((p) => p.respuesta);
        if (negs.length > 0) contrastPairs.push({ q: qaPairs[i].pregunta, pos: qaPairs[i].respuesta, negs });
      }
    }

    this.lossHistory = [];
    for (let ep = 0; ep < epochs; ep++) {
      let epLoss = 0;
      let steps = 0;
      const shuffled = shuffle(validSeqs);
      const batchSz = 16;
      for (let i = 0; i < shuffled.length; i += batchSz) {
        const batch = shuffled.slice(i, i + batchSz);
        epLoss += this.lmStep(batch);
        steps++;
      }
      if (contrastPairs.length > 0) {
        epLoss += this.contrastiveStep(shuffle(contrastPairs).slice(0, 8));
        steps++;
      }
      const avg = steps > 0 ? epLoss / steps : 0;
      this.lossHistory.push(avg);
      onEpoch?.(ep, avg);
    }
    this.trained = true;
    this.reindexChunks();
    return this.lossHistory;
  }

  /** (Re)construye los vectores de indexación de los chunks de conocimiento. */
  reindexChunks() {
    for (const c of this.chunks) {
      c.vec = this.encode(`${c.titulo} ${c.contenido}`);
    }
  }

  /** Busca los k chunks más afines a una consulta (cosine). */
  retrieve(query: string, k = 3): { chunk: ChunkIndex; score: number }[] {
    if (this.chunks.length === 0) return [];
    const qv = this.encode(query);
    return this.chunks
      .map((c) => ({ chunk: c, score: cosine(qv, c.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  /** Genera texto con muestreo temperature a partir de un prompt. */
  generate(prompt: string, maxTokens = 40): string {
    if (!this.trained) return "";
    let ids = this.tokenizer.encode(prompt, { addBos: true });
    const out: number[] = [];
    for (let t = 0; t < maxTokens; t++) {
      const window = ids.slice(-this.config.lmContext);
      while (window.length < this.config.lmContext) window.unshift(this.tokenizer.padId);
      const vec = this.windowVec(window);
      const h = this.lm1.forward([vec]);
      const logits = this.lm2.forward(h)[0];
      const probs = softmax(logits.map((l) => l / TEMP));
      // muestreo
      let r = Math.random();
      let next = this.config.vocabSize - 1;
      for (let i = 0; i < probs.length; i++) {
        r -= probs[i];
        if (r <= 0) {
          next = i;
          break;
        }
      }
      if (next === this.tokenizer.eosId) break;
      out.push(next);
      ids.push(next);
    }
    return this.tokenizer.decode(out).trim();
  }

  /** Respuesta híbrida: recupera fragmentos afines y, si el LM está entrenado, genera una continuación. */
  answer(query: string): { text: string; sources: { titulo: string; contenido: string; score: number }[] } {
    const retrieved = this.retrieve(query, 3);
    const sources = retrieved.map((r) => ({
      titulo: r.chunk.titulo,
      contenido: r.chunk.contenido,
      score: r.score,
    }));

    if (!this.trained) {
      if (sources.length > 0 && sources[0].score > 0.25) {
        return { text: sources[0].contenido, sources };
      }
      return {
        text: "Todavía no me has enseñado nada. Ve a la pestaña Entrenar, pega libros o textos, y pulsa Entrenar cerebro.",
        sources: [],
      };
    }

    // si la recuperación es clara, priorizamos el fragmento original (fiel a la fuente)
    if (sources.length > 0 && sources[0].score > 0.45) {
      return { text: sources[0].contenido, sources };
    }

    // si no, generamos con el LM condicionado a la consulta + fragmento top
    const ctx = sources[0] ? sources[0].contenido.slice(0, 200) : "";
    const prompt = `${ctx} Pregunta: ${query} Respuesta:`;
    const gen = this.generate(prompt, 50);
    if (gen) {
      return { text: gen, sources };
    }
    if (sources.length > 0) return { text: sources[0].contenido, sources };
    return {
      text: "No encontré nada afín en mi base. Enséñame más en Conocimiento y reentrena.",
      sources: [],
    };
  }

  // ---------- Persistencia ----------

  toJSON() {
    return {
      config: this.config,
      tokenizer: this.tokenizer.toJSON(),
      embed: this.embed.toJSON(),
      enc1: this.enc1.toJSON(),
      enc2: this.enc2.toJSON(),
      lm1: this.lm1.toJSON(),
      lm2: this.lm2.toJSON(),
      lossHistory: this.lossHistory,
      trained: this.trained,
      chunks: this.chunks.map((c) => ({ id: c.id, titulo: c.titulo, contenido: c.contenido })),
    };
  }

  static fromJSON(data: ReturnType<Brain["toJSON"]>): Brain {
    const brain = new Brain(data.config);
    brain.tokenizer = Tokenizer.fromJSON(data.tokenizer);
    brain.embed = Embedding.fromJSON(data.embed);
    brain.enc1 = Dense.fromJSON(data.enc1);
    brain.enc2 = Dense.fromJSON(data.enc2);
    brain.lm1 = Dense.fromJSON(data.lm1);
    brain.lm2 = Dense.fromJSON(data.lm2);
    brain.lossHistory = data.lossHistory ?? [];
    brain.trained = data.trained ?? false;
    brain.chunks = (data.chunks ?? []).map((c) => ({ ...c, vec: [] }));
    // rebuild optimizers on loaded weights
    brain["optEmbed"] = new AdamMatrix(brain.embed.E, 0.01);
    brain["optEnc1"] = new AdamDense(brain.enc1, 0.005);
    brain["optEnc2"] = new AdamDense(brain.enc2, 0.005);
    brain["optLm1"] = new AdamDense(brain.lm1, 0.005);
    brain["optLm2"] = new AdamDense(brain.lm2, 0.005);
    if (brain.trained) brain.reindexChunks();
    return brain;
  }
}
