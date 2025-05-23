uniform float uTime;
uniform sampler2D uPerlinNoise;
uniform vec3 uColorWater;
uniform vec3 uColorRipple;
uniform float uRippleSize;
uniform float uRippleFrequency;
uniform float uRippleStep;
uniform float uWaterTransparency;


varying vec2 vUv;

void main()
{
    float ripple = texture(uPerlinNoise, vUv).r;
    ripple = sin(ripple * uRippleSize + uTime * uRippleFrequency);
    ripple = step(uRippleStep, ripple );

    vec3 colorMix = mix(uColorWater, uColorRipple, ripple);

    gl_FragColor = vec4(vec3(colorMix), uWaterTransparency);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

