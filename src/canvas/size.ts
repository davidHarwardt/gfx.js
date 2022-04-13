import { Vec2 } from "../math/vector.js";

type CanvasResizeCallback = (dim: Vec2) => void;

interface ICanvasSize
{
    init(canvas: HTMLCanvasElement): void;
    resize(): void;
    onResize: CanvasResizeCallback;
}

class CanvasFixedSize implements ICanvasSize
{
    public onResize: CanvasResizeCallback;
    private element: HTMLCanvasElement;
    private size: Vec2;
    
    constructor(v: Vec2, onResize: CanvasResizeCallback) { this.size = v.copy(); this.onResize = onResize; }

    init(canvas: HTMLCanvasElement) { this.element = canvas;  }
    resize() { this.element.width = this.size.x; this.element.height = this.size.y; this.onResize(this.size.copy()); }
}

class CanvasCSSSize implements ICanvasSize
{
    public onResize: CanvasResizeCallback;
    private element: HTMLCanvasElement;

    constructor(onResize: CanvasResizeCallback) { this.onResize = onResize; }

    init(canvas: HTMLCanvasElement) { this.element = canvas; const observer = new ResizeObserver(() => { this.resize(); }).observe(canvas); this.resize(); }

    resize()
    {
        const comp = this.element.getBoundingClientRect();
        this.element.width = comp.width;
        this.element.height = comp.height;
        this.onResize(new Vec2(comp.width, comp.height));
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