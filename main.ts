import { Canvas2d } from "./src/canvas/canvas.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { Color } from "./src/color/color.js";
import { InputManager } from "./src/input/input.js";

const canvas = new Canvas2d(undefined, new CanvasFullscreenSize(), { element: { background: new Color(0, 0, 0) } });

const input = new InputManager(window);

function draw()
{
    canvas.clear();

    canvas.drawCircle(input.mousePos, 2);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);