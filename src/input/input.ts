import { Vec2 } from "../math/vector.js";

type WindowHandlers = WindowEventHandlers;
type ElementHandlers = GlobalEventHandlers;
type AllHandlers = WindowHandlers | ElementHandlers;

type test = HTMLElement;

interface IInputModule<T extends AllHandlers = AllHandlers>
{
    parent: T extends ElementHandlers ? ElementHandlers : WindowHandlers;
    init(): void;
};

class InputManager<T extends AllHandlers>
{
    parent: T;
    
    constructor(parent: T)
    {
        this.parent = parent;
    }
    
    static get Window() { return new InputManager(window); }

    add<V extends IInputModule<T>>(mod: V)
    {
        const res = Object.assign(this, mod);

        mod.init();

        return res;
    }

    finish(): Readonly<Omit<this, "init" | "finish" | "add" | "parent">>
    {
        return Object.freeze(this);
    }
}

class MouseModule implements IInputModule
{
    parent: AllHandlers;
    
    preventContext: boolean;

    constructor(preventContext: boolean = false)
    {
        this.preventContext = preventContext;
    }

    init()
    {
        console.log("init");
    }
}

class KeyboardModule implements IInputModule
{
    parent: AllHandlers;

    init()
    {
        console.log(this);
    }
}

export {
    InputManager,

    MouseModule,
    KeyboardModule,

    IInputModule,

    WindowHandlers,
    ElementHandlers,
    AllHandlers,
};