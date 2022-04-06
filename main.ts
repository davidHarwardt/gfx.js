import { Canvas2d } from "./src/canvas/canvas.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { Color } from "./src/color/color.js";
import { InputManager } from "./src/input/input.js";
import { AccValue, LerpValue } from "./src/math/interpolation.js";
import { clamp } from "./src/math/utils.js";
import { Scalar, Vec2 } from "./src/math/vector.js";
import Units from "./src/units/units.js";

const canvas = new Canvas2d(undefined, new CanvasFullscreenSize(), { element: { background: new Color(0, 0, 0) } });

Units.init();

const input = new InputManager(window);


class Soldier
{
    pos: Vec2;
    scale: AccValue<Scalar>;

    constructor(pos: Vec2, initialScale: Scalar)
    {
        this.pos = pos;
        this.scale = new AccValue(initialScale, 0.85, v => v.magnitude() * 0.2);
    }

    update(dt: number)
    {
        this.scale.update(dt);
    }

    draw(canvas: Canvas2d)
    {
        canvas.drawCircle(this.pos, this.scale.value.s);
    }

    get width() { return 0; }
    get height() { return 0; }
}

class Formation
{
    constructor()
    {

    }

    draw(canvas: Canvas2d)
    {

    }
}

class Legion extends Formation
{
    kohorten: Kohorte[];

    constructor(initPos: Vec2)
    {
        super();
        this.kohorten = new Array(10).fill(0).map((v, i) => new Kohorte(new Vec2(Math.floor(i / 5) * Kohorte.width + LEGION_PADDING * 2, 15 * (i % 5) * LEGION_PADDING * Units.vmin).add(initPos)));
    }

    draw(canvas: Canvas2d): void
    {
        this.kohorten.forEach(v => v.draw(canvas));
    }

    update(dt: number) { this.kohorten.forEach(v => v.update(dt)); }
    updateCirc(pos: Vec2, r: number) { this.kohorten.forEach(v => v.updateCirc(pos, r) ) }


    static get width() { return Kohorte.width * 2 + LEGION_PADDING; }
    static get height() { return Kohorte.height * 5 + LEGION_PADDING * 5; }
}

class Kohorte extends Formation
{
    manipel: Manipel[];

    constructor(initPos: Vec2)
    {
        super();
        this.manipel = new Array(3).fill(0).map((v, i) => new Manipel(new Vec2(0, 5 * i * LEGION_PADDING * Units.vmin).add(initPos)));
    }

    draw(canvas: Canvas2d): void
    {
        // canvas.drawRect(new Vec2(0, 0), new Vec2(Kohorte.width, Kohorte.height));
        this.manipel.forEach(v => v.draw(canvas));
    }

    update(dt: number) { this.manipel.forEach(v => v.update(dt)); }
    updateCirc(pos: Vec2, r: number) { this.manipel.forEach(v => v.updateCirc(pos, r) ) }


    static get width() { return Manipel.width + 2 * LEGION_PADDING * Units.vmin; }
    static get height() { return Manipel.height * 3 + 4 * LEGION_PADDING * Units.vmin; }
}

class Manipel extends Formation
{
    zenturien: Zenturie[];

    constructor(initPos: Vec2)
    {
        super();
        this.zenturien = new Array(2).fill(0).map((v, i) => new Zenturie(new Vec2((21 * i * LEGION_PADDING) * Units.vmin, 0).add(initPos)));
    }

    draw(canvas: Canvas2d): void
    {
        this.zenturien.forEach(v => v.draw(canvas));
    }

    update(dt: number) { this.zenturien.forEach(v => v.update(dt)); }

    updateCirc(pos: Vec2, r: number) { this.zenturien.forEach(v => v.updateCirc(pos, r) ) }

    static get width() { return 2 * Zenturie.width + 1 * LEGION_PADDING; }
    static get height() { return Zenturie.height; }
}

const LEGION_PADDING = 1.5;

class Zenturie extends Formation
{
    soldiers: Soldier[];

    constructor(initPos: Vec2)
    {
        super();
        this.soldiers = new Array(80).fill(0).map((v, i) => new Soldier(new Vec2((i % 20) * LEGION_PADDING * Units.vmin, Math.floor(i / 20) * LEGION_PADDING * Units.vmin).add(initPos), new Scalar(0 /*0.33 * Units.vmin*/)));
    }

    draw(canvas: Canvas2d)
    {
        this.soldiers.forEach(v => v.draw(canvas));
    }

    update(dt: number) { this.soldiers.forEach(v => v.update(dt)); }

    updateCirc(pos: Vec2, r: number) { this.soldiers.forEach(v => { if(v.pos.sub(pos).magnitude() < r) { v.scale.target = new Scalar(0.33 * Units.vmin) } }) }

    static get width() { return 20 * LEGION_PADDING * Units.vmin; }
    static get height() { return 4 * LEGION_PADDING * Units.vmin; }
}

// eine legion: 10 kohorten
// eine kohorte: 3 manipel
// ein  manipel: 2 zenturien
// eine zenturie: 60 - 100 mann

const winCenter = new Vec2(window.innerWidth, window.innerHeight).multS(0.5);
// const screenCenter = new AccValue(new Vec2(window.innerWidth, window.innerHeight).multS(0.5), 0.75, v => v.magnitude() * 0.1);
const screenCenter = new LerpValue(new Vec2(window.innerWidth, window.innerHeight).multS(0.5), 0.05);
const screenScale = new LerpValue(new Scalar(1), 0.05);


const test = new Legion(new Vec2(0, 0));

let screenOffset = new Vec2(0, 0);

console.log(test);


let circR = new LerpValue(new Scalar(0), 0.02);
circR.target = new Scalar(800);

let currentLayer = -1;

function draw()
{
    canvas.clear();

    const dt = 1;

    // canvas.translate(new Vec2(100, 100));
    // canvas.scale(new Vec2(0.5, 0.5), winCenter);
    // canvas.rotate(Date.now() / 1000, winCenter);
    // canvas.rotate(Math.PI / 8, winCenter);

    circR.update(dt);

    screenCenter.update(dt);
    screenScale.update(dt);
    canvas.scale(new Vec2(0, 0).addS(screenScale.value.s), new Vec2(Legion.width, Legion.height).multS(0.5));
    canvas.translate(screenCenter.value);
    {
        // canvas.drawCircle(canvas.screenToWorld(input.mousePos), 0.5 * Units.vmin, { color: Color.red });

        // canvas.drawRect(new Vec2(0, 0), winCenter.multS(2), { borderColor: new Color(0.1, 0.1, 0.1), fill: false, borderWidth: 0.125 * Units.vmin });

        switch(currentLayer)
        {
            case 0:
                test.kohorten[0].manipel[0].zenturien[0].soldiers[0].scale.target = new Scalar(0.33 * Units.vmin);
                break;

            case 1:
                test.kohorten[0].manipel[0].zenturien[0].updateCirc(new Vec2(0, 0), circR.value.s);
                break;

            case 2:
                test.kohorten[0].manipel[0].updateCirc(new Vec2(0, 0), circR.value.s);
                break;

            case 3:
                test.kohorten[0].updateCirc(new Vec2(0, 0), circR.value.s);
                break;

            case 4:
                test.updateCirc(new Vec2(0, 0), circR.value.s);
                break;
        }

        test.update(dt);

        test.draw(canvas);
    }
    canvas.resetTransform();

    requestAnimationFrame(draw);
}

function next()
{
    if(currentLayer >= 4) { return; }

    circR = new LerpValue(new Scalar(0), 0.02);
    circR.target = new Scalar(100 * Units.vmin);
    currentLayer++;
    // console.log(currentLayer);
    
    switch(currentLayer)
    {
        case 1:
            screenCenter.target = new Vec2(window.innerWidth, window.innerHeight).sub(new Vec2(Zenturie.width, Zenturie.height)).multS(0.5);
            break;

        case 2:
            screenCenter.target = new Vec2(window.innerWidth, window.innerHeight).sub(new Vec2(Manipel.width, Manipel.height)).multS(0.5);
            break;

        case 3:
            screenCenter.target = new Vec2(window.innerWidth, window.innerHeight).sub(new Vec2(Kohorte.width, Kohorte.height)).multS(0.5);
            break;

        case 4:
            screenCenter.target = new Vec2(window.innerWidth, window.innerHeight).sub(new Vec2(Legion.width, Legion.height)).multS(0.5);
            screenScale.target = new Scalar(0.75);
            circR = new LerpValue(new Scalar(0), 0.01);
            circR.target = new Scalar(200 * Units.vmin);
            break;
    }
}

window["next"] = next;

requestAnimationFrame(draw);

window.addEventListener("dblclick", _ => next());


// setInterval(next, 1000)