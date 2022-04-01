import { Canvas2d } from "./src/canvas/canvas.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { Color } from "./src/color/color.js";
import { InputManager } from "./src/input/input.js";
import { AccValue, LerpValue } from "./src/math/interpolation.js";
import { clamp } from "./src/math/utils.js";
import { Scalar, Vec2 } from "./src/math/vector.js";

const canvas = new Canvas2d(undefined, new CanvasFullscreenSize(), { element: { background: new Color(0, 0, 0) } });

const input = new InputManager(window);

const dim = new Vec2(60, 33);
const sizes = new Array(dim.x).fill(0).map((_, i) => new Array(dim.y).fill(0).map((_, j) => new AccValue(new Scalar(0), 0.85, v => v.magnitude() * 0.1)));

console.log(sizes);



function draw()
{
    canvas.clear();

    canvas.drawCircle(input.mousePos, 2);

    const center = canvas.domElement.dim.multS(0.5);

    for(let i = 0; i < dim.x; i++)
    {
        for(let j = 0; j < dim.y; j++)
        {
            const pos = new Vec2(i, j).addS(0.5).div(dim).subS(0.5).mult(dim.multS(50)).add(center);

            const off = 3;
            const dist = /*Math.sin*/(Math.floor(pos.sub(input.mousePos).magnitude() / 50 / off) * off * 0.9);
            const wave = Math.sin(dist) * 20;

            const res = wave;
            const resDist = dist * 0.8;

            sizes[i][j].target = new Scalar(res);
            sizes[i][j].update(1);
            // canvas.drawCircle(pos, Math.max(1.1 * sizes[i][j].value.s - 0.1, 0), { color: new Color(0, 1 / (0.01 * dist), 0) });
            canvas.drawCircle(pos, Math.max(sizes[i][j].value.s - 0.1, 0), { color: new Color(0, Math.max(1 / (resDist) - 0.1, 0), 0) });
        }
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);