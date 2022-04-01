import { Vec2 } from "../math/vector.js";

type WindowHandlers = WindowEventHandlers;
type ElementHandlers = GlobalEventHandlers;
type AllHandlers = WindowHandlers | ElementHandlers;

class InputManager
{
    protected parent: typeof window;

    protected _mousePos: Vec2;
    protected _buttons: [left: boolean, middle: boolean, right: boolean];

    public get mousePos() { return this._mousePos; }

    constructor(parent: typeof window)
    {
        this.parent = parent;
        this._buttons = [false, false, false];
        this._mousePos = new Vec2(0, 0);

        this.parent.addEventListener("mousemove", ev => this._mousePos = new Vec2(ev.clientX, ev.clientY));
        this.parent.addEventListener("mousedown", ev => this._buttons[ev.button] = true);
        this.parent.addEventListener("mouseup", ev => this._buttons[ev.button] = false);
    }
}

export {
    InputManager,
};