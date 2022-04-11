import { HtmlCanvas } from "./src/canvas/element.js";
import { CanvasFullscreenSize } from "./src/canvas/size.js";
import { EBufferTarget, GlBuffer } from "./src/gl/buffer.js";
import { ShaderProgram, Shader, EShaderType } from "./src/gl/shader.js";
import { EVertexAttribType, VAO } from "./src/gl/vertex-array.js";
import { WebGlRenderer } from "./src/gl/webgl-renderer.js";

const renderer = new WebGlRenderer(new HtmlCanvas(undefined, new CanvasFullscreenSize()));

const gl = renderer.ctx;



async function load()
{
    const program = new ShaderProgram(
        gl,
        "test program",
        ["a_Position"] as const,
        {},
        await Shader.fromUrl(gl, "test vert", "/shaders/main/vertex.glsl", EShaderType.VERTEX),
        await Shader.fromUrl(gl, "test fragment", "/shaders/main/vertex.glsl", EShaderType.FRAGMENT),
    );

    const buffer = new GlBuffer(gl, EBufferTarget.ARRAY_BUFFER);

    const vao = new VAO(gl, [buffer], [[
        { location: 0, normalize: false, offset: 0, size: 2, stride: 0, type: EVertexAttribType.FLOAT },
    ]]);


}


function draw()
{
    
}