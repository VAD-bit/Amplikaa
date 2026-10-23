// ============================================================
// Tokenizador a nivel de palabra con vocabulario aprendido del corpus.
// ============================================================

export class Tokenizer {
  private word2id = new Map<string, number>();
  private id2word: string[] = [];
  readonly unkId = 1;
  readonly padId = 0;
  readonly bosId = 2;
  readonly eosId = 3;

  get vocabSize() {
    return this.id2word.length;
  }

  /** Construye vocabulario a partir de un corpus (minFreq por defecto 1). */
  train(texts: string[], minFreq = 1) {
    this.word2id.clear();
    this.id2word = [];
    // tokens especiales
    this.addToken("<pad>");
    this.addToken("<unk>");
    this.addToken("<bos>");
    this.addToken("<eos>");

    const freq = new Map<string, number>();
    for (const t of texts) {
      for (const w of this.tokenize(t)) freq.set(w, (freq.get(w) ?? 0) + 1);
    }
    const entries = [...freq.entries()]
      .filter(([, f]) => f >= minFreq)
      .sort((a, b) => b[1] - a[1]);
    for (const [w] of entries) this.addToken(w);
  }

  private addToken(w: string): number {
    let id = this.word2id.get(w);
    if (id === undefined) {
      id = this.id2word.length;
      this.word2id.set(w, id);
      this.id2word.push(w);
    }
    return id;
  }

  /** Limpieza básica + división en palabras (minúsculas, sin puntuación). */
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9ñ\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  encode(text: string, opts?: { addBos?: boolean; addEos?: boolean; maxLen?: number }): number[] {
    const words = this.tokenize(text);
    let ids = words.map((w) => this.word2id.get(w) ?? this.unkId);
    if (opts?.addBos) ids = [this.bosId, ...ids];
    if (opts?.addEos) ids = [...ids, this.eosId];
    if (opts?.maxLen && ids.length > opts.maxLen) ids = ids.slice(-opts.maxLen);
    return ids;
  }

  decode(ids: number[]): string {
    return ids
      .map((i) => this.id2word[i] ?? "<unk>")
      .filter((w) => w !== "<pad>" && w !== "<bos>" && w !== "<eos>" && w !== "<unk>")
      .join(" ");
  }

  word(id: number): string {
    return this.id2word[id] ?? "<unk>";
  }

  toJSON() {
    return { id2word: this.id2word };
  }

  static fromJSON(d: { id2word: string[] }): Tokenizer {
    const t = new Tokenizer();
    t.id2word = d.id2word;
    t.word2id = new Map(d.id2word.map((w, i) => [w, i]));
    return t;
  }
}
