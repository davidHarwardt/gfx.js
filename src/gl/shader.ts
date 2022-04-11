import { Mat2, Mat3, Mat4 } from "../math/matrix.js";
import { Vec2, Vec3, Vec4 } from "../math/vector.js";

enum EShaderType
{
    VERTEX,
    FRAGMENT,
}

class InvalidShaderTypeError extends Error {  }

class Shader<T extends EShaderType>
{
    readonly id: string;
    private _handle: WebGLShader;
    private _src: string;
    private _type: T;

    private _compiled: boolean;

    constructor(gl: WebGL2RenderingContext, id: string, src: string, type: T)
    {
        let glType = undefined;

        switch(type)
        {
            case EShaderType.VERTEX:
                glType = gl.VERTEX_SHADER;
                break;

            case EShaderType.FRAGMENT:
                glType = gl.FRAGMENT_SHADER;
                break;

            default:
                throw new InvalidShaderTypeError("unknown shadertype: " + type);
        }

        this.id = id;

        this._compiled = false;
        this._src = src;
        this._type = type;
        this._handle = gl.createShader(glType);
    }

    static async fromUrl<T extends EShaderType>(gl: WebGL2RenderingContext, id: string, url: string, type: T)
    {
        const src = await (await fetch(url)).text();
        return new Shader(gl, id, src, type);
    }

    compile(gl: WebGL2RenderingContext): boolean
    {
        gl.shaderSource(this._handle, this._src);
        gl.compileShader(this._handle);

        if(!gl.getShaderParameter(this._handle, gl.COMPILE_STATUS)) { this._compiled = false; console.error(`shader ${this.id} (compile error): ` + gl.getShaderInfoLog(this._handle)); return false; }

        this._compiled = true;
    }

    delete(gl: WebGL2RenderingContext) { gl.deleteShader(this._handle); }

    public get compiled()   { return this._compiled; }
    public get handle()     { return this._handle; }
}

type SupportedShaderVariants = EShaderType.FRAGMENT | EShaderType.VERTEX;

enum EShaderUnifromType
{
    INT,
    UINT,
    FLOAT,
};

enum EShaderUniformDimension
{
    SCALAR,
    VEC2,
    VEC3,
    VEC4,
    MAT2,
    MAT3,
    MAT4,
};

type ShaderTypeMap = {
    [EShaderUniformDimension.SCALAR]:  number,
    [EShaderUniformDimension.VEC2]:     Vec2,
    [EShaderUniformDimension.VEC3]:     Vec3,
    [EShaderUniformDimension.VEC4]:     Vec4,

    [EShaderUniformDimension.MAT2]:     Mat2,
    [EShaderUniformDimension.MAT3]:     Mat3,
    [EShaderUniformDimension.MAT4]:     Mat4,
};

type ShaderUniform<T extends EShaderUnifromType, U extends EShaderUniformDimension> = { type: T, dimension: U };

class ShaderProgram<T extends readonly string[], U extends { [V: string]: ShaderUniform<EShaderUnifromType, EShaderUniformDimension> }>
{
    readonly id: string;
    private _handle: WebGLShader;
    private _linked: boolean;
    private _shaders: Shader<SupportedShaderVariants>[];

    private _uniforms: U;
    private _attriabuteLocations: { [key: string]: number };

    constructor(gl: WebGL2RenderingContext, id: string, attributeLocations: T, uniforms: U, ...shaders: Shader<SupportedShaderVariants>[])
    {
        this._linked = false;
        this._handle = gl.createProgram();
        this._shaders = shaders;

        this.id = id;
        this._uniforms = uniforms;

        for(const name of attributeLocations) { this._attriabuteLocations[name] = undefined; }

        this._shaders.forEach(v => gl.attachShader(this._handle, v.handle));
    }

    link(gl: WebGL2RenderingContext): boolean
    {
        const uncompiled = this._shaders.find(v => !v.compiled)
        if(uncompiled) { console.warn(`the shader ${uncompiled.id} is uncompiled (used by program ${this.id} in link)`); return false; }

        gl.linkProgram(this._handle);

        if(!gl.getProgramParameter(this._handle, gl.LINK_STATUS)) { this._linked = false; console.error(`program ${this.id} (link error): ` + gl.getProgramInfoLog(this._handle)); return false; }

        const keys = Object.keys(this._uniforms);
        for(const key of keys)
        {
            const loc = gl.getAttribLocation(this._handle, key);
            if(!loc) { console.error(`clould not find attribute ${key} in program ${this.id}`); return false; }
            this._uniforms[key]["location"] = loc;
        }

        for(const attr of Object.keys(this._attriabuteLocations))
        {
            this._attriabuteLocations[attr] = gl.getAttribLocation(this.handle, attr);
        }

        this._linked = true;
        return true;
    }

    use(gl: WebGL2RenderingContext)
    {
        if(!this._linked) { console.warn("program is not linked"); return; }
        gl.useProgram(this._handle);
    }

    setUniform<V extends keyof U>(gl: WebGL2RenderingContext, name: V, value: ShaderTypeMap[U[V]["dimension"]])
    {
        switch(this._uniforms[name].type)
        {
            case EShaderUnifromType.FLOAT:
            switch(this._uniforms[name].dimension)
            {
                case EShaderUniformDimension.SCALAR:
                    gl.uniform1f(this._uniforms[name]['location'], value as number);
                    break;

                case EShaderUniformDimension.VEC2:
                    gl.uniform2f(this._uniforms[name]['location'], (value as Vec2).x, (value as Vec2).y);
                    break;

                case EShaderUniformDimension.VEC3:
                    gl.uniform3f(this._uniforms[name]['location'], (value as Vec3).x, (value as Vec3).y, (value as Vec3).z);
                    break;

                case EShaderUniformDimension.VEC4:
                    gl.uniform4f(this._uniforms[name]['location'], (value as Vec4).x, (value as Vec4).y, (value as Vec4).z, (value as Vec4).w);
                    break;
            }
            break;

            case EShaderUnifromType.INT:
            switch(this._uniforms[name].dimension)
            {
                case EShaderUniformDimension.SCALAR:
                    gl.uniform1i(this._uniforms[name]['location'], value as number);
                    break;

                case EShaderUniformDimension.VEC2:
                    gl.uniform2i(this._uniforms[name]['location'], (value as Vec2).x, (value as Vec2).y);
                    break;

                case EShaderUniformDimension.VEC3:
                    gl.uniform3i(this._uniforms[name]['location'], (value as Vec3).x, (value as Vec3).y, (value as Vec3).z);
                    break;

                case EShaderUniformDimension.VEC4:
                    gl.uniform4i(this._uniforms[name]['location'], (value as Vec4).x, (value as Vec4).y, (value as Vec4).z, (value as Vec4).w);
                    break;
            }
            break;

            case EShaderUnifromType.INT:
            switch(this._uniforms[name].dimension)
            {
                case EShaderUniformDimension.SCALAR:
                    gl.uniform1ui(this._uniforms[name]['location'], value as number);
                    break;

                case EShaderUniformDimension.VEC2:
                    gl.uniform2ui(this._uniforms[name]['location'], (value as Vec2).x, (value as Vec2).y);
                    break;

                case EShaderUniformDimension.VEC3:
                    gl.uniform3ui(this._uniforms[name]['location'], (value as Vec3).x, (value as Vec3).y, (value as Vec3).z);
                    break;

                case EShaderUniformDimension.VEC4:
                    gl.uniform4ui(this._uniforms[name]['location'], (value as Vec4).x, (value as Vec4).y, (value as Vec4).z, (value as Vec4).w);
                    break;
            }
            break;

            default:
                console.warn("used invalid shader type");
                break;
        }
    }

    public get handle() { return this._handle; }
    public get linked() { return this._linked; }
}

export {
    EShaderType,
    EShaderUnifromType,
    EShaderUniformDimension,

    InvalidShaderTypeError,

    Shader,
    ShaderProgram,
}