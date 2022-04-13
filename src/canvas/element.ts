import { Color } from "../color/color.js";
import { Vec2 } from "../math/vector.js";
import { CanvasCSSSize, ICanvasSize } from "./size.js";

interface IHtmlCanvasOptions
{
    background?: Color;
};


class HtmlCanvas
{
    private domElement: HTMLCanvasElement;
    private size: ICanvasSize;

    constructor(parent: HTMLElement = document.body, size: ICanvasSize = new CanvasCSSSize(_ => {}), options: IHtmlCanvasOptions = {})
    {
        this.domElement = document.createElement("canvas");
        parent.append(this.domElement);
        this.size = size;
        this.size.init(this.domElement);

        if(options.background) { this.domElement.style.backgroundColor = options.background.toString(); }
    }

    get element()   { return this.domElement; }
    get dim()       { return new Vec2(this.domElement.width, this.domElement.height); }
}

export {
    IHtmlCanvasOptions,

    HtmlCanvas,
};