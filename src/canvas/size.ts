import { Vec2 } from "../math/vector.js";


interface ICanvasSize
{
    init(canvas: HTMLCanvasElement): void;
    resize(): void;
}

class CanvasFixedSize implements ICanvasSize
{
    private element: HTMLCanvasElement;
    private size: Vec2;
    
    constructor(v: Vec2) { this.size = v.copy(); }

    init(canvas: HTMLCanvasElement) { this.element = canvas; }
    resize() { this.element.width = this.size.x; this.element.height = this.size.y; }
}

class CanvasCSSSize implements ICanvasSize
{
    private element: HTMLCanvasElement;

    constructor() {}

    init(canvas: HTMLCanvasElement) { this.element = canvas; const observer = new ResizeObserver(() => { this.resize(); }).observe(canvas); this.resize(); }

    resize()
    {
        const comp = this.element.getBoundingClientRect();
        this.element.width = comp.width;
        this.element.height = comp.height;
    }
}

class CanvasFullscreenSize extends CanvasCSSSize
{
    init(canvas: HTMLCanvasElement)
    {
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.display = "block";

        canvas.parentElement.style.margin = "0";

        super.init(canvas);
    }
}

export {
    ICanvasSize,

    CanvasFixedSize,
    CanvasCSSSize,
    CanvasFullscreenSize,
};