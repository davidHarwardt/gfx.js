import { clamp } from "../math/utils.js";
import { Vec3, Vec4 } from "../math/vector.js";


class Color
{
    public static get black()       { return new Color(0, 0, 0); }
    public static get white()       { return new Color(1, 1, 1); }
    public static get red()         { return new Color(1, 0, 0); }
    public static get green()       { return new Color(0, 1, 0); }
    public static get blue()        { return new Color(0, 0, 1); }

    private v: Vec4;

    constructor(r: number, g: number, b: number, a: number = 1.0)
    {
        this.v = new Vec4(r, g, b, a);
    }

    public static hex(v: string | number)
    {
        if(typeof v == "number")
        {
            return new Color(((v >> 8 * 2) & 0xff) / 0xff, ((v >> 8 * 1) & 0xff) / 0xff, ((v >> 8 * 0) & 0xff) / 0xff);
        }

        if(!v.startsWith("#")) { throw new Error("invalid color string provided"); }
        if(v.length !== 7 && v.length !== 9) { throw new Error("invalid color string provided"); }

        let colors: number[] = [];

        for(var i = 0; i < (v.length - 1) / 2; i++)
        {
            colors.push(parseInt(v.substring(2 * i + 1, 2 * i + 3), 16) / 255);
        }

        return new Color(colors[0], colors[1], colors[2], colors?.[3]);
    }
    public static vec(v: Vec4) { return new Color(v.x, v.y, v.z, v.w); }

    get r() { return this.v.x; }
    get g() { return this.v.y; }
    get b() { return this.v.z; }
    get a() { return this.v.w; }

    set r(v: number) { this.v.x = v; }
    set g(v: number) { this.v.y = v; }
    set b(v: number) { this.v.z = v; }
    set a(v: number) { this.v.w = v; }

    toRgbString(includeAlpha: boolean = this.a !== 1.0) { return `rgb${includeAlpha ? "a" : ""}(${Math.floor(this.r) * 255}, ${Math.floor(this.g) * 255}, ${Math.floor(this.b) * 255}${includeAlpha ? ", " + this.a : ""})`; }
    private toHexComponent(v: number) { return Math.floor(clamp(v, 0, 1) * 255).toString(16).padStart(2, "0"); }
    toHexString(includeAlpha: boolean = this.a !== 1.0) { return `#${this.toHexComponent(this.r)}${this.toHexComponent(this.g)}${this.toHexComponent(this.b)}${includeAlpha ? this.toHexComponent(this.a) : ""}`}
    toString() { return this.toHexString(); }
    toVec() { return this.v.copy(); }
    toArray() { return this.v.toArray(); }

    mix(color: Color, amount: number = 0.5)
    {
        const res = new Color(0, 0, 0, 0);
        res.v = this.v.multS(amount).add(color.v.multS(1 - amount));
        return res;
    }

    // todo: implement hsv, hsl, temperature
}

export {
    Color,
}