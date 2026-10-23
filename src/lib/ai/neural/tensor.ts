// ============================================================
// Núcleo neuronal desde cero — sin librerías externas.
// Matriz = number[][] (fila × columna). Todo el forward/backward
// y el optimizer Adam están escritos a mano.
// ============================================================

export type Matrix = number[][];

export function zeros(rows: number, cols: number): Matrix {
  const m: Matrix = new Array(rows);
  for (let i = 0; i < rows; i++) m[i] = new Array(cols).fill(0);
  return m;
}

export function randn(rows: number, cols: number, std = 0.1): Matrix {
  const m: Matrix = new Array(rows);
  for (let i = 0; i < rows; i++) {
    m[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      // Box–Muller
      let u = 0;
      let v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      m[i][j] = std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
  }
  return m;
}

export function matMul(a: Matrix, b: Matrix): Matrix {
  const [ar, ac] = [a.length, a[0]?.length ?? 0];
  const [br, bc] = [b.length, b[0]?.length ?? 0];
  if (ac !== br) throw new Error(`matMul shape mismatch ${ar}x${ac} · ${br}x${bc}`);
  const out = zeros(ar, bc);
  for (let i = 0; i < ar; i++) {
    for (let k = 0; k < ac; k++) {
      const aik = a[i][k];
      if (aik === 0) continue;
      for (let j = 0; j < bc; j++) out[i][j] += aik * b[k][j];
    }
  }
  return out;
}

export function addRowVec(m: Matrix, v: number[]): Matrix {
  return m.map((row) => row.map((x, j) => x + v[j]));
}

export function addInPlace(target: Matrix, src: Matrix, lr: number) {
  for (let i = 0; i < target.length; i++)
    for (let j = 0; j < target[i].length; j++) target[i][j] -= lr * src[i][j];
}

export function scaleInPlace(m: Matrix, s: number) {
  for (let i = 0; i < m.length; i++)
    for (let j = 0; j < m[i].length; j++) m[i][j] *= s;
}

export function zeroMatrixLike(m: Matrix): Matrix {
  return m.map((row) => row.map(() => 0));
}

export function l2norm(v: number[]): number {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  return Math.sqrt(s) + 1e-12;
}

export function normalize(v: number[]): number[] {
  const n = l2norm(v);
  return v.map((x) => x / n);
}

export function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function cosine(a: number[], b: number[]): number {
  return dot(normalize(a), normalize(b));
}
