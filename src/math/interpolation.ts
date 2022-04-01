import { VecN } from "./vector.js";


class TargetValue<T extends VecN>
{
    protected _value: T;
    protected _target: T;

    constructor(v: T)
    {
        this._value = v.copy();
        this._target = v.copy();
    }

    public get value() { return this._value; }

    public get target() { return this._target; }
    public set target(v: T) { this._target = v; }

    public update(dt: number) { this._value = this._target; }
}

class LerpValue<T extends VecN> extends TargetValue<T>
{
    public factor: number;

    constructor(v: T, factor: number)
    {
        super(v);
        this.factor = factor;
    }

    public update(dt: number)
    {
        this._value = this._value.lerp(this._target, this.factor * dt);
    }
}

type VelFactorCallback<T extends VecN> = (diff: T) => number;

class VelValue<T extends VecN> extends TargetValue<T>
{
    protected _vel: T;
    protected cb: VelFactorCallback<T>;

    constructor(v: T, factorCb: VelFactorCallback<T>)
    {
        super(v);
        this._vel = v.multS(0);
        this.cb = factorCb;
    }

    public update(dt: number)
    {
        const diff = this._target.sub(this._value);
        this._vel = diff.normalized().multS(this.cb(diff));
        
        this._value = this._value.add(this._vel.multS(dt));
    }
}

class AccValue<T extends VecN> extends VelValue<T>
{
    public dragMult: number;

    constructor(v: T, dragMult: number, factorCb: VelFactorCallback<T>)
    {
        super(v, factorCb);
        this.dragMult = dragMult;
    }

    public update(dt: number)
    {
        const diff = this._target.sub(this._value);
        this._vel = this._vel.add(diff.normalized().multS(this.cb(diff))).multS(this.dragMult);
        
        this._value = this._value.add(this._vel.multS(dt));
    }
}

export {
    TargetValue,

    LerpValue,
    VelValue,
    AccValue,
};