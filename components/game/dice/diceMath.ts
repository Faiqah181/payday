export type Mat4 = number[];

// Column-major 4x4 matrices matching CSS matrix3d / RN's `matrix` transform.

function mul(a: Mat4, b: Mat4): Mat4 {
  "worklet";
  const out = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = s;
    }
  }
  return out;
}

function rotateX(deg: number): Mat4 {
  "worklet";
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

function rotateY(deg: number): Mat4 {
  "worklet";
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

function translateZ(d: number): Mat4 {
  "worklet";
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, d, 1];
}

function perspective(d: number): Mat4 {
  "worklet";
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / d, 0, 0, 0, 1];
}

/**
 * Matrix for one cube face: perspective → cube rotation (animated) →
 * face orientation (static) → push out to the cube surface.
 */
export function faceTransform(
  cubeX: number,
  cubeY: number,
  faceX: number,
  faceY: number,
  halfSize: number,
  perspectiveDist: number,
): Mat4 {
  "worklet";
  let m = perspective(perspectiveDist);
  m = mul(m, rotateX(cubeX));
  m = mul(m, rotateY(cubeY));
  m = mul(m, rotateX(faceX));
  m = mul(m, rotateY(faceY));
  m = mul(m, translateZ(halfSize));
  return m;
}
