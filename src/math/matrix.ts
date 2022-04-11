

class MatN
{
    protected v: number[];

    protected constructor(v: number[])
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
}

class Mat2 extends MatN
{
    constructor(v: [number, number, number, number])
    {
        super(v);
    }
}

class Mat3 extends MatN
{
    constructor(v: [number, number, number, number])
    {
        super(v);
    }
}

class Mat4 extends MatN
{
    constructor(v: [number, number, number, number])
    {
        super(v);
    }
}


export {
    MatN,
    Mat2,
    Mat3,
    Mat4,
}