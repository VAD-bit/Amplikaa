// ============================================================
// Optimizer Adam escrito a mano (sin dependencias).
// Mantiene momentos m y v por parámetro y actualiza W, b, E.
// ============================================================

import { type Matrix, zeroMatrixLike } from "./tensor";

export class AdamDense {
  private mW: Matrix;
  private vW: Matrix;
  private mb: number[];
  private vb: number[];
  private t = 0;

  constructor(
    private layer: { W: Matrix; b: number[] },
    public lr = 0.001,
    public beta1 = 0.9,
    public beta2 = 0.999,
    public eps = 1e-8
  ) {
    this.mW = zeroMatrixLike(layer.W);
    this.vW = zeroMatrixLike(layer.W);
    this.mb = new Array(layer.b.length).fill(0);
    this.vb = new Array(layer.b.length).fill(0);
  }

  step(dW: Matrix, db: number[]) {
    this.t++;
    const c1 = 1 - Math.pow(this.beta1, this.t);
    const c2 = 1 - Math.pow(this.beta2, this.t);
    const W = this.layer.W;
    const b = this.layer.b;
    for (let i = 0; i < W.length; i++) {
      for (let j = 0; j < W[i].length; j++) {
        const g = dW[i][j];
        this.mW[i][j] = this.beta1 * this.mW[i][j] + (1 - this.beta1) * g;
        this.vW[i][j] = this.beta2 * this.vW[i][j] + (1 - this.beta2) * g * g;
        W[i][j] -= (this.lr * (this.mW[i][j] / c1)) / (Math.sqrt(this.vW[i][j] / c2) + this.eps);
      }
    }
    for (let j = 0; j < b.length; j++) {
      const g = db[j];
      this.mb[j] = this.beta1 * this.mb[j] + (1 - this.beta1) * g;
      this.vb[j] = this.beta2 * this.vb[j] + (1 - this.beta2) * g * g;
      b[j] -= (this.lr * (this.mb[j] / c1)) / (Math.sqrt(this.vb[j] / c2) + this.eps);
    }
  }
}

export class AdamMatrix {
  private m: Matrix;
  private v: Matrix;
  private t = 0;

  constructor(
    private mat: Matrix,
    public lr = 0.001,
    public beta1 = 0.9,
    public beta2 = 0.999,
    public eps = 1e-8
  ) {
    this.m = zeroMatrixLike(mat);
    this.v = zeroMatrixLike(mat);
  }

  step(d: Matrix) {
    this.t++;
    const c1 = 1 - Math.pow(this.beta1, this.t);
    const c2 = 1 - Math.pow(this.beta2, this.t);
    const M = this.mat;
    for (let i = 0; i < M.length; i++) {
      for (let j = 0; j < M[i].length; j++) {
        const g = d[i][j];
        this.m[i][j] = this.beta1 * this.m[i][j] + (1 - this.beta1) * g;
        this.v[i][j] = this.beta2 * this.v[i][j] + (1 - this.beta2) * g * g;
        M[i][j] -= (this.lr * (this.m[i][j] / c1)) / (Math.sqrt(this.v[i][j] / c2) + this.eps);
      }
    }
  }
}
