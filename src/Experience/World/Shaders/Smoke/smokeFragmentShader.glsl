uniform float uTime;
uniform sampler2D uPerlinNoise;
uniform vec3 uColor;
uniform float uPerlinSizeX;
uniform float uPerlinSizeY;

varying vec2 vUv;

void main()
{
    vec2 smokeUv = vUv;
    smokeUv.x *= uPerlinSizeX;
    smokeUv.y *= uPerlinSizeY;
    smokeUv.y -= uTime * 0.00005;

    float smoke = texture(uPerlinNoise, smokeUv).r;

    smoke = smoothstep(0.4, 1.0, smoke);

    //edges
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    gl_FragColor = vec4(uColor, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

