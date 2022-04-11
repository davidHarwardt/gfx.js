import { HtmlCanvas } from "../canvas/element.js";


class WebGlRenderer
{
    private _canvas: HtmlCanvas;
    private gl: WebGL2RenderingContext;

    constructor(canvas: HtmlCanvas)
    {
        this._canvas = canvas;
        this.gl = this._canvas.element.getContext("webgl2");

        if(!this.gl) { alert("webgl2 isnt supported"); }
    }

    public get ctx() { return this.gl; }
}

export {
    WebGlRenderer,
}