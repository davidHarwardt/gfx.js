import { Canvas2d } from "./src/canvas/canvas.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { Color } from "./src/color/color.js";
import { InputManager } from "./src/input/input.js";

const canvas = new Canvas2d(document.body, new CanvasFullscreenSize(_ => {}), { element: { background: Color.black } });
const input = new InputManager(window);

async function load() {
    requestAnimationFrame(draw);
}

function draw() {
    canvas.clear();

    canvas.drawCircle(input.mousePos, 3);
    requestAnimationFrame(draw);
}

load();