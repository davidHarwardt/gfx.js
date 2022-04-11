
enum EBufferTarget
{
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,

    // todo add webgl2 buffers (https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
}

enum EBufferUsage
{
    STATIC_DRAW,
    DYNAMIC_DRAW,
    STREAM_DRAW,
}

class GlBuffer<T extends EBufferTarget>
{
    readonly id: string;
    private _handle: WebGLBuffer;
    private _target: T

    constructor(gl: WebGL2RenderingContext, target: T)
    {
        this._handle = gl.createBuffer();
        this._target = target;
    }

    private toGlTarget(gl: WebGL2RenderingContext, target: EBufferTarget)
    {
        switch(target)
        {
            case EBufferTarget.ARRAY_BUFFER:
                return gl.ARRAY_BUFFER;

            case EBufferTarget.ELEMENT_ARRAY_BUFFER:
                return gl.ELEMENT_ARRAY_BUFFER;
        }
    }

    private toGlUsage(gl: WebGL2RenderingContext, target: EBufferUsage)
    {
        switch(target)
        {
            case EBufferUsage.STATIC_DRAW:
                return gl.STATIC_DRAW;

            case EBufferUsage.DYNAMIC_DRAW:
                return gl.DYNAMIC_DRAW;

            case EBufferUsage.STREAM_DRAW:
                return gl.STREAM_DRAW;
        }
    }

    bind(gl: WebGL2RenderingContext)
    {
        const glTarget = this.toGlTarget(gl, this._target);

        gl.bindBuffer(glTarget, this._handle);
    }

    setData(gl: WebGL2RenderingContext, data: ArrayBufferView | ArrayBuffer, usage: EBufferUsage)
    {
        const glTarget = this.toGlTarget(gl, this._target);
        this.bind(gl);

        gl.bufferData(glTarget, data, this.toGlUsage(gl, usage));
    }

    public get handle()     { return this._handle; }
}

export {
    EBufferTarget,
    EBufferUsage,

    GlBuffer,
};