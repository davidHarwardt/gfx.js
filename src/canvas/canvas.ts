import { Color } from "../color/color.js";
import { Vec2 } from "../math/vector.js";
import { HtmlCanvas, IHtmlCanvasOptions } from "./element.js";
import { ICanvasSize } from "./size.js";

interface ICanvas2dOptions
{
    element?: IHtmlCanvasOptions;
};

interface ICanvas2dLineStyle                                    { width?: number; color?: Color, cap?: CanvasLineCap };
interface ICanvas2dShapeStyle                                   { color?: Color; borderColor?: Color; fill?: boolean; borderWidth?: number };
interface ICanvas2dPolygonStyle extends ICanvas2dShapeStyle     { closed?: boolean };
interface ICanvas2dTextStyle                                    { size?: number; color?: Color; font?: string; align?: CanvasTextAlign; baseLine?: CanvasTextBaseline; maxWidth?: number; debug?: boolean }


class Canvas2d
{
    private element: HtmlCanvas;
    private ctx: CanvasRenderingContext2D;

    constructor(parent?: HTMLElement, size?: ICanvasSize, options: ICanvas2dOptions = {})
    {
        this.element = new HtmlCanvas(parent, size, options?.element);
        this.ctx = this.element.element.getContext("2d");
    }

    public get domElement() { return this.element; }

    clear() { const dim = this.element.dim; this.ctx.clearRect(0, 0, dim.x, dim.y); }

    // drawing functions start
    drawLine(start: Vec2, end: Vec2, style: ICanvas2dLineStyle = {})
    {
        this.ctx.lineWidth = style.width ?? 10;
        this.ctx.strokeStyle = style.color?.toString() ?? Color.red.toString();
        this.ctx.lineCap = style.cap ?? "butt";

        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    drawRect(pos: Vec2, dim: Vec2, style: ICanvas2dShapeStyle = {})
    {
        this.ctx.beginPath();
        this.ctx.rect(pos.x, pos.y, dim.x, dim.y);

        if(style.fill !== false) { this.ctx.fillStyle = style.color?.toString() ?? Color.green.toString(); this.ctx.fill(); }
        if(style.borderWidth > 0) { this.ctx.strokeStyle = style.borderColor?.toString() ?? Color.red.toString(); this.ctx.lineWidth = style.borderWidth; this.ctx.stroke(); }
    }

    drawCircle(center: Vec2, radius: number, style: ICanvas2dShapeStyle = {})
    {
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);

        if(style.fill !== false) { this.ctx.fillStyle = style.color?.toString() ?? Color.green.toString(); this.ctx.fill(); }
        if(style.borderWidth > 0) { this.ctx.strokeStyle = style.borderColor?.toString() ?? Color.red.toString(); this.ctx.lineWidth = style.borderWidth; this.ctx.stroke(); }
    }

    drawPoly(vertecies: Vec2[], style: ICanvas2dPolygonStyle = {})
    {
        if(vertecies.length < 2) { console.error(`invalid vertex count for polygon: ${vertecies.length}`); return; }

        this.ctx.beginPath();
        this.ctx.moveTo(vertecies[0].x, vertecies[0].y);

        for(let i = 1 ; i < vertecies.length; i++) { this.ctx.lineTo(vertecies[i].x, vertecies[i].y); }

        if(style.closed === true) { this.ctx.closePath(); }
        if(style.fill !== false) { this.ctx.fillStyle = style.color?.toString() ?? Color.green.toString(); this.ctx.fill(); }
        if(style.borderWidth > 0) { this.ctx.strokeStyle = style.borderColor?.toString() ?? Color.red.toString(); this.ctx.lineWidth = style.borderWidth; this.ctx.stroke(); }
    }

    drawText(text: string, pos: Vec2, style: ICanvas2dTextStyle = {})
    {
        this.ctx.fillStyle = style.color?.toString() ?? Color.white.toString();
        this.ctx.textAlign = style.align ?? "left";
        this.ctx.font = `${style.size ?? 50}px ${style.font ?? "Arial"}`;
        this.ctx.textBaseline = style.baseLine ?? "top";

        if(style.debug)
        {
            const dim = this.ctx.measureText(text);
            // todo text metrics
        }
        
        this.ctx.fillText(text, pos.x, pos.y, style.maxWidth);
    }

    drawImage(img: CanvasImageSource, pos: Vec2, dim: Vec2 = new Vec2(img.width as number, img.height as number), cutout?: {start: Vec2, dim: Vec2})
    {
        if(cutout)  { this.ctx.drawImage(img, cutout.start.x, cutout.start.y, cutout.dim.x, cutout.dim.y, pos.x, pos.y, dim.x, dim.y); }
        else        { this.ctx.drawImage(img, pos.x, pos.y, dim.x, dim.y); } 
    }
    // drawing functions end

    translate(offset: Vec2) { this.ctx.translate(offset.x, offset.y); }
    scale(scale: Vec2, transformOrigin?: Vec2)
    {
        if(transformOrigin) { this.translate(transformOrigin); }
        this.ctx.scale(scale.x, scale.y);
        if(transformOrigin) { this.translate(transformOrigin.inverted()); }
    }
    rotate(angle: number, transformOrigin?: Vec2)
    {
        if(transformOrigin) { this.translate(transformOrigin); }
        this.ctx.rotate(angle);
        if(transformOrigin) { this.translate(transformOrigin.inverted()); }
    }

    resetTransform() { this.ctx.resetTransform(); }

    saveCtx()       { this.ctx.save(); }
    restoreCtx()    { this.ctx.restore(); }

    screenToWorld(pos: Vec2)
    {
        const mat = this.ctx.getTransform().inverse();        
        return new Vec2(mat.a * pos.x + mat.c * pos.y + mat.e, mat.b * pos.x + mat.d * pos.y + mat.f);
    }

    worldToScreen(pos: Vec2)
    {
        const mat = this.ctx.getTransform();        
        return new Vec2(mat.a * pos.x + mat.c * pos.y + mat.e, mat.b * pos.x + mat.d * pos.y + mat.f);
    }

    clipRect(pos: Vec2, dim: Vec2)              { this.ctx.beginPath(); this.ctx.rect(pos.x, pos.y, dim.x, dim.y); this.ctx.clip(); }
    clipCircle(center: Vec2, radius: number)    { this.ctx.beginPath(); this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2); this.ctx.clip(); }

    getImageData(pos: Vec2, dim: Vec2 = new Vec2(1, 1)) { return this.ctx.getImageData(pos.x, pos.y, dim.x, dim.y); }
    createImageData(dim: Vec2) { return this.ctx.createImageData(dim.x, dim.y); }
    putImageData(data: ImageData, pos: Vec2) { this.ctx.putImageData(data, pos.x, pos.y); }
}

export {
    Canvas2d,

    ICanvas2dOptions,

    ICanvas2dLineStyle,
    ICanvas2dShapeStyle,
    ICanvas2dPolygonStyle,
    ICanvas2dTextStyle,
};