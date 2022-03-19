

function clamp(v: number, min: number, max: number) { return Math.min(Math.max(v, min), max); }
function lerp(a: number, b: number, v: number) { return a * (1 - v) + b * v; }

export {
    clamp,
    lerp,
};