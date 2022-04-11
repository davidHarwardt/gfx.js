import { EBufferTarget, GlBuffer } from "./buffer";

enum EVertexAttribType
{
    FLOAT,
}

interface IVertexAttribute
{
    location: number;           // location of the data in the shader
    size: number;               // number of components during iteration
    type: EVertexAttribType;    // type of the data
    normalize: boolean;         // wether to normalize the values
    stride: number;             // number of bytes to move for the next instance (0 for tight packing)
    offset: number;             // offset from the start in bytes
};

class VAO
{
    readonly id: string;
    private _handle: WebGLVertexArrayObject;
    private _buffers: GlBuffer<EBufferTarget.ARRAY_BUFFER>[];
    private _attributes: IVertexAttribute[][];


    constructor(gl: WebGL2RenderingContext, buffers: GlBuffer<EBufferTarget.ARRAY_BUFFER>[], attributes: IVertexAttribute[][])
    {
        this._handle = gl.createVertexArray();
        this._buffers = buffers;
        this._attributes = attributes;

        this.bind(gl);
        this._attributes.forEach((v, i) =>
        {
            buffers[i].bind(gl);
            v.forEach(w =>
            {
                gl.enableVertexAttribArray(w.location);
                gl.vertexAttribPointer(w.location, w.size, this.toGlAttribType(gl, w.type), w.normalize, w.stride, w.offset);
            });
        });
    }

    private toGlAttribType(gl: WebGL2RenderingContext, value: EVertexAttribType)
    {
        switch(value)
        {
            case EVertexAttribType.FLOAT:
                return gl.FLOAT;
        }
    }

    bind(gl: WebGL2RenderingContext)
    {
        gl.bindVertexArray(this._handle);
    }
}

export {
    IVertexAttribute,

    EVertexAttribType,

    VAO,
}