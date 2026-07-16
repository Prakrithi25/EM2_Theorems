// scalarField.ts
// A single scalar field used by the Foundations page to make "gradient" and
// "directional derivative" concrete and interactive instead of purely symbolic.

export interface ScalarField {
  label: string;
  f: (x: number, y: number) => number;
  /** analytic gradient (∂f/∂x, ∂f/∂y) */
  grad: (x: number, y: number) => { gx: number; gy: number };
}

// f(x, y) = x^2 + 2y^2 — an elliptic bowl; simple enough to reason about,
// varied enough that the gradient direction visibly changes across the plane.
export const BOWL_FIELD: ScalarField = {
  label: 'f(x, y) = x² + 2y²',
  f: (x, y) => x * x + 2 * y * y,
  grad: (x, y) => ({ gx: 2 * x, gy: 4 * y }),
};

/** Directional derivative of f at (x,y) along unit vector (ux, uy): ∇f · û */
export function directionalDerivative(field: ScalarField, x: number, y: number, ux: number, uy: number): number {
  const { gx, gy } = field.grad(x, y);
  return gx * ux + gy * uy;
}
