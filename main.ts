import { Canvas2d } from "./src/canvas/canvas.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { Color } from "./src/color/color.js";
import { AllHandlers, InputManager, KeyboardModule, MouseModule, WindowHandlers } from "./src/input/input.js";
import { Vec2 } from "./src/math/vector.js";


const input = new InputManager<AllHandlers>(window).add(new MouseModule()).add(new KeyboardModule);


const canvas = new Canvas2d(undefined, new CanvasFullscreenSize(), { element: { background: Color.black } });

canvas.drawRect(new Vec2(100, 100), new Vec2(100, 100));

console.log(canvas);