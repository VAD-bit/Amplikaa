// ============================================================
// Capas de red neuronal (forward + backward a mano)
// ============================================================

import { type Matrix, zeros, randn, addRowVec, matMul } from "./tensor";

export type Activation = "relu" | "tanh" | "linear";

function act(x: number, a: Activation): number {
  if (a === "relu") return x > 0 ? x : 0;
  if (a === "tanh") return Math.tanh(x);
  return x;
}

function actGrad(pre: number, out: number, a: Activation): number {
  if (a === "relu") return pre > 0 ? 1 : 0;
  if (a === "tanh") return 1 - out * out;
  return 1;
}

/** Capa densa: y = act(W·x + b). Cachea entrada y pre-activación para backprop. */
export class Dense {
  W: Matrix;
  b: number[];
  private lastX: number[][] = [];
  private lastPre: number[][] = [];
  private lastY: number[][] = [];

  constructor(
    public inDim: number,
    public outDim: number,
    public activation: Activation = "relu",
    std = 0.1
  ) {
    this.W = randn(inDim, outDim, std);
    this.b = new Array(outDim).fill(0);
  }

  /** x: batch × inDim → batch × outDim */
  forward(x: number[][]): number[][] {
    this.lastX = x;
    const z = matMul(x, this.W);
    const pre = addRowVec(z, this.b);
    this.lastPre = pre;
    const y = pre.map((row) => row.map((v, j) => act(v, this.activation)));
    this.lastY = y;
    return y;
  }

  /**
   * gradOut: dL/dy (batch × outDim).
   * Devuelve dL/dx y acumula grads de W y b en dW, db.
   */
  backward(gradOut: number[][]): { dW: Matrix; db: number[]; dx: number[][] } {
    const batch = gradOut.length;
    const dPre = this.lastPre.map((row, i) =>
      row.map((v, j) => gradOut[i][j] * actGrad(v, this.lastY[i][j], this.activation))
    );
    // dW = Xᵀ · dPre
    const dW = zeros(this.inDim, this.outDim);
    for (let i = 0; i < batch; i++)
      for (let k = 0; k < this.inDim; k++)
        for (let j = 0; j < this.outDim; j++) dW[k][j] += this.lastX[i][k] * dPre[i][j];
    const db = new Array(this.outDim).fill(0);
    for (let i = 0; i < batch; i++)
      for (let j = 0; j < this.outDim; j++) db[j] += dPre[i][j];
    // dx = dPre · Wᵀ
    const dx = zeros(batch, this.inDim);
    for (let i = 0; i < batch; i++)
      for (let k = 0; k < this.inDim; k++) {
        let s = 0;
        for (let j = 0; j < this.outDim; j++) s += dPre[i][j] * this.W[k][j];
        dx[i][k] = s;
      }
    return { dW, db, dx };
  }

  toJSON() {
    return { inDim: this.inDim, outDim: this.outDim, activation: this.activation, W: this.W, b: this.b };
  }

  static fromJSON(d: { inDim: number; outDim: number; activation: Activation; W: Matrix; b: number[] }) {
    const l = new Dense(d.inDim, d.outDim, d.activation);
    l.W = d.W;
    l.b = d.b;
    return l;
  }
}

/**
 * Capa de embeddings: cada token id mapea a un vector entrenable.
 * Se usa como promedio de los embeddings de la secuencia (mean-pooling)
 * para codificar texto de longitud variable en un vector fijo.
 */
export class Embedding {
  E: Matrix;

  constructor(
    public vocabSize: number,
    public dim: number,
    std = 0.1
  ) {
    this.E = randn(vocabSize, dim, std);
  }

  /** ids: batch de secuencias (cada una una lista de token ids). Mean-pool → batch × dim */
  forward(seqs: number[][]): number[][] {
    const batch = seqs.length;
    const out = zeros(batch, this.dim);
    for (let i = 0; i < batch; i++) {
      const ids = seqs[i];
      if (ids.length === 0) continue;
      for (const id of ids) {
        if (id < 0 || id >= this.vocabSize) continue;
        for (let d = 0; d < this.dim; d++) out[i][d] += this.E[id][d];
      }
      for (let d = 0; d < this.dim; d++) out[i][d] /= ids.length;
    }
    return out;
  }

  /** dOut: batch × dim. Acumula dE solo para ids usados. */
  backward(seqs: number[][], dOut: number[][]): Matrix {
    const dE = zeros(this.vocabSize, this.dim);
    for (let i = 0; i < seqs.length; i++) {
      const ids = seqs[i];
      if (ids.length === 0) continue;
      const inv = 1 / ids.length;
      for (const id of ids) {
        if (id < 0 || id >= this.vocabSize) continue;
        for (let d = 0; d < this.dim; d++) dE[id][d] += dOut[i][d] * inv;
      }
    }
    return dE;
  }

  toJSON() {
    return { vocabSize: this.vocabSize, dim: this.dim, E: this.E };
  }

  static fromJSON(d: { vocabSize: number; dim: number; E: Matrix }) {
    const e = new Embedding(d.vocabSize, d.dim);
    e.E = d.E;
    return e;
  }
}
