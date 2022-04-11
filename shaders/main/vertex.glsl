#version 300 es

in vec2 a_Position;

void main()
{
    gl_Position = vec4(vec3(position, 0.0), 1.0);
}