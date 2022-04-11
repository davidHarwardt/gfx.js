
class VecN
{
    protected v: number[];

    protected constructor(...v: number[])
    {
        this.v = v;
    }

    public map(cb: (v: number, idx?: number) => number): this
    {
        const res: this = new (this as any).__proto__.constructor();
        for(var i = 0; i < this.v.length; i++) { res.v[i] = cb(this.v[i], i); }
        return res;
    }

    public reduce(cb: (v: number, idx?: number) => number, initial: number = 0): number
    {
        var res = initial;
        for(var i = 0; i < this.v.length; i++) { res += cb(this.v[i], i); }
        return res;
    }

    public copy()           : this      { return this.map(v => v); }

    public  add(vec: this)  : this      { return this.map((v, i) => v + vec.v[i]); }
    public  sub(vec: this)  : this      { return this.map((v, i) => v - vec.v[i]); }
    public mult(vec: this)  : this      { return this.map((v, i) => v * vec.v[i]); }
    public  div(vec: this)  : this      { return this.map((v, i) => v / vec.v[i]); }

    public  addS(s: number) : this      { return this.map((v, i) => v + s); }
    public  subS(s: number) : this      { return this.map((v, i) => v - s); }
    public multS(s: number) : this      { return this.map((v, i) => v * s); }
    public  divS(s: number) : this      { return this.map((v, i) => v / s); }

    public dot(vec: this)   : number    { return this.reduce((v, i) => v * vec.v[i]); }

    public sqrMagnitude()   : number    { return this.reduce(v => v * v); }
    public magnitude()      : number    { return Math.sqrt(this.reduce(v => v * v)); }

    public normalized()     : this      { const mag = this.magnitude(); return mag !== 0 ? this.divS(this.magnitude()) : this.copy(); }
    public inverted()       : this      { return this.multS(-1); }

    public abs()            : this      { return this.map(Math.abs); }

    public lerp(
        target: this,
        v: number
    )                       : this      { return this.multS(1 - v).add(target.multS(v)); }

    public toArray()        : number[]  { return this.v.slice(); }
}

class Scalar extends VecN
{
    constructor(s: number) { super(s); }

    get s() { return this.v[0]; }

    set s(v: number) { this.v[0] = v; }
}

class Vec2 extends VecN
{
    constructor(x: number, y: number)
    {
        super(x, y);
    }

    get x() { return this.v[0]; }
    get y() { return this.v[1]; }

    set x(v: number) { this.v[0] = v; }
    set y(v: number) { this.v[1] = v; }
}

class Vec3 extends VecN
{
    constructor(x: number, y: number, z: number)
    {
        super(x, y, z);
    }

    get x() { return this.v[0]; }
    get y() { return this.v[1]; }
    get z() { return this.v[2]; }

    set x(v: number) { this.v[0] = v; }
    set y(v: number) { this.v[1] = v; }
    set z(v: number) { this.v[2] = v; }
}

class Vec4 extends VecN
{
    constructor(x: number, y: number, z: number, w: number)
    {
        super(x, y, z, w);
    }

    get x() { return this.v[0]; }
    get y() { return this.v[1]; }
    get z() { return this.v[2]; }
    get w() { return this.v[3]; }

    set x(v: number) { this.v[0] = v; }
    set y(v: number) { this.v[1] = v; }
    set z(v: number) { this.v[2] = v; }
    set w(v: number) { this.v[3] = v; }
}

export {
    Scalar,
    Vec2,
    Vec3,
    Vec4,

    VecN,
};