import { Vec2 } from "../math/vector.js";


class Units
{
    private static _windowSize = new Vec2(window.innerWidth, window.innerHeight);
    private static _isInitialized = false;

    public static init()
    {
        if(this._isInitialized) { console.trace("tried to initialize untits more than once"); return; }
        window.addEventListener("resize", ev => this.update());
        this._isInitialized = true;
    }

    private static update()
    {
        this._windowSize.x = window.innerWidth;
        this._windowSize.y = window.innerWidth;
    }

    public static get vmin() { return Math.min(this.vw, this.vh); }
    public static get vmax() { return Math.max(this.vw, this.vh); }

    public static get vw() { return this._windowSize.x / 100; }
    public static get vh() { return this._windowSize.y / 100; }
}

export default Units;