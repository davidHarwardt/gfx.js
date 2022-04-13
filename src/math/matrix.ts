

class MatGen<D1 extends number, D2 extends number>
{
    protected v: number[];

    // D1: rows, D2: columns
    //   3
    // 4 +--------
    //   | x x x x
    //   | x x x x
    //   | x x x x
    //
    // D1 = 3; D2 = 4
    protected dim: [D1, D2];

    constructor(dim: [D1, D2], v: number[] = undefined)
    {
        console.log(dim, v);
        
        if(v === undefined) { v = new Array(dim[0] * dim[1]).fill(0); }
        if(v.length !== dim[0] * dim[1]) { throw new TypeError(`invalid dimension (expected ${dim[0]}x${dim[1]})`); }
        this.v = v;
        this.dim = [dim[0], dim[1]];
    }

    public map(cb: (v: number, idx?: number) => number): this
    {
        const res: this = new (this as any).__proto__.constructor([this.rows, this.columns]);
        for(var i = 0; i < this.v.length; i++) { res.v[i] = cb(this.v[i], i); }
        return res;
    }

    public map2d(cb: (v: number, idx?: [number, number]) => number): this
    {
        const res: this = new (this as any).__proto__.constructor([this.rows, this.columns]);
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.columns; j++)
            {
                const idx = i * this.columns + j;
                res.v[idx] = cb(this.v[idx], [i, j]);
            }
        }
        return res;
    }

    public reduce(cb: (v: number, idx?: number) => number, initial: number = 0): number
    {
        var res = initial;
        for(var i = 0; i < this.v.length; i++) { res += cb(this.v[i], i); }
        return res;
    }

    public multGeneric<E1 extends D2, E2 extends number>(m: MatN<E1, E2>): MatN<D1, E2>
    {
        const resDim = [this.rows, m.columns] as [typeof this.rows, typeof m.columns];
        const res = new MatN(resDim, new Array(resDim[0] * resDim[1]).fill(0)).map2d((v, [i, j]) =>
        {
            let dot = 0;
            for(let k = 0; k < m.rows; k++) { dot += this.at(i, k) * m.at(k, j); }
            return dot;
        });

        return res;
    }

    public at(row: number, col: number)
    {
        return this.v[row * this.columns + col]
    }

    // entrywise
    public add(m: MatN<D1, D2>) { return this.map((v, idx) => v + m.v[idx]); }
    public sub(m: MatN<D1, D2>) { return this.map((v, idx) => v - m.v[idx]); }

    public get rows()       { return this.dim[0]; }
    public get columns()    { return this.dim[1]; }
}

class MatN<D extends number>
{
    protected v: number[];

    // D1: rows, D2: columns
    //   3
    // 4 +--------
    //   | x x x x
    //   | x x x x
    //   | x x x x
    //
    // D1 = 3; D2 = 4
    protected _dim: D;

    constructor(v: number[], dim: D)
    {
        this._dim = dim;
        this.v = v;
    }

    public map(cb: (v: number, idx?: number) => number): this
    {
        const res: this = new (this as any).__proto__.constructor(this.dim);
        for(var i = 0; i < this.v.length; i++) { res.v[i] = cb(this.v[i], i); }
        return res;
    }

    public at(row: number, col: number) { return this.v[row * this.dim + col]; }

    public map2d(cb: (v: number, idx?: [number, number]) => number): this
    {
        const res: this = new (this as any).__proto__.constructor(this.dim);
        for(let i = 0; i < this.dim; i++)
        {
            for(let j = 0; j < this.dim; j++)
            {
                const idx = i * this.dim + j;
                res.v[idx] = cb(this.v[idx], [i, j]);
            }
        }
        return res;
    }

    public mult(m: this): this
    {
        return this.map2d((v, [i, j]) => 
        {
            let dot = 0;
            for(let k = 0; k < m.dim; k++) { dot += this.at(i, k) * m.at(k, j); }
            return dot;
        });
    }

    public get dim() { return this._dim; }
}

class Mat2 extends SquareMat<2>
{
    constructor(v: number[])
    {
        super(2, v);
    }
}

class Mat3 extends SquareMat<3>
{
    constructor(v: number[])
    {
        super(3, v);
    }
}

class Mat4 extends SquareMat<4>
{
    constructor(v: number[])
    {
        super(4, v);
    }
}

const mat1 = new Mat2([1, 2, 3, 4]);
const mat2 = new Mat2([5, 6, 7, 8]);

console.log(mat1.mult(mat2));


export {
    MatN,
    Mat2,
    Mat3,
    Mat4,
};