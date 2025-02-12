uniform float uTime;
uniform sampler2D uSnowTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    float snow = texture(uSnowTexture, gl_PointCoord).r;

    // float snowElevation = smoothstep(100.0, 150.0, vElevation);

    gl_FragColor = vec4(vec3(snow), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

