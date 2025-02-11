uniform vec3 ubladesTopColor;
uniform vec3 ubladesBottomColor;
uniform float uColorOffset;
uniform sampler2D uHeightMap;



varying float vElevation;
varying vec2 vUv;

void main()
{
    float mixStrengh = vElevation + uColorOffset;
    
    vec3 color = mix(ubladesBottomColor, ubladesTopColor, mixStrengh);

    gl_FragColor = vec4(color, 1.0);

     #include <colorspace_fragment>
}