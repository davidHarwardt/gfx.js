import { HtmlCanvas } from "./src/canvas/element.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { EBufferTarget, EBufferUsage, GlBuffer } from "./src/gl/buffer.js";
import { ShaderProgram, Shader, EShaderType } from "./src/gl/shader.js";
import { EVertexAttribType, VAO } from "./src/gl/vertex-array.js";
import { WebGlRenderer } from "./src/gl/webgl-renderer.js";
import { Vec2 } from "./src/math/vector.js";

import "./src/math/matrix.js";

let init = false;

const renderer = new WebGlRenderer(new HtmlCanvas(undefined, new CanvasFullscreenSize(resize)));

const gl = renderer.ctx;

const state = {
    program: undefined as ShaderProgram<["a_Position"], {}>,
    buffer: undefined as GlBuffer<EBufferTarget.ARRAY_BUFFER>,
    vao: undefined as VAO,
};

function resize(dim: Vec2)
{
    if(init)
    {
        gl.viewport(0, 0, dim.x, dim.y);
    }
}

async function load()
{
    state.program = new ShaderProgram(
        gl,
        "test program",
        ["a_Position"] as const,
        {},
        await Shader.fromUrl(gl, "test vert", "/shaders/main/vertex.glsl", EShaderType.VERTEX),
        await Shader.fromUrl(gl, "test fragment", "/shaders/main/fragment.glsl", EShaderType.FRAGMENT),
    );

    state.program.compileAll(gl);
    console.log("compiled shaders");
    
    state.program.link(gl);
    console.log("linked program");

    state.buffer = new GlBuffer(gl, EBufferTarget.ARRAY_BUFFER);

    state.buffer.setData(gl, new Float32Array([
        0, 0,
        0, 0.5,
        0.7, 0,
    ]), EBufferUsage.STATIC_DRAW);

    state.vao = new VAO(gl, [state.buffer], [[
        { location: 0, normalize: false, offset: 0, size: 2, stride: 0, type: EVertexAttribType.FLOAT },
    ]]);

    gl.clearColor(0 / 255, 48 / 255, 84 / 255, 1);

    init = true;

    draw();
}



function draw()
{
    // console.log("draw");
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    state.program.use(gl);
    state.vao.bind(gl);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

load();