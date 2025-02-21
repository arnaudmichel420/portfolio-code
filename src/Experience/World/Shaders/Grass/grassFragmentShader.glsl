uniform vec3 ubladesTopColor1;
uniform vec3 ubladesTopColor2;
uniform vec3 ubladesBottomColor;
uniform float uColorOffset;
uniform float uLength;
uniform sampler2D uPerlinNoise;

varying float vElevation;
varying vec2 vUv;

void main()
{
    //color patch 
    float colorNoise = texture(uPerlinNoise, vUv * 2.0).r;
    vec3 colorTop = mix(ubladesTopColor1, ubladesTopColor2, colorNoise);
    
    //blades elevation
    float mixStrengh = vElevation + uColorOffset * uLength;
    vec3 color = mix(ubladesBottomColor, colorTop, mixStrengh);

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}