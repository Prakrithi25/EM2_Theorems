export interface ScalarField {
  label: string;
  f: (x: number, y: number) => number;
  grad: (x: number, y: number) => { gx: number; gy: number };
}

export const BOWL_FIELD: ScalarField = {
  label: 'f(x, y) = x² + 2y²',
  f: (x, y) => x * x + 2 * y * y,
  grad: (x, y) => ({ gx: 2 * x, gy: 4 * y }),
};

export function directionalDerivative(field: ScalarField, x: number, y: number, ux: number, uy: number): number {
  const { gx, gy } = field.grad(x, y);
  return gx * ux + gy * uy;
}
