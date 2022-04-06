import { Canvas2d } from "../canvas/canvas.js";
import { AccValue } from "../math/interpolation.js";
import { Scalar, Vec2 } from "../math/vector.js";


class Solider
{
    public pos: Vec2;
    private _scale: AccValue<Scalar>;

    constructor(pos: Vec2, scale: Scalar)
    {
        this.pos = pos;
        this._scale = new AccValue(scale, 0.85, v => v.magnitude() * 0.3);
    }

    draw(canvas: Canvas2d)
    {
        canvas.drawCircle(this.pos, this._scale.value.s);
    }

    update(dt: number)
    {
        this._scale.update(dt);
    }
}


export {
    Solider,
};