uniform vec3 uColor;
uniform float uDotRange;

void main(){
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = uDotRange / distanceToCenter - uDotRange * 2.0;

    strength *= step(0.0, strength);

    gl_FragColor = vec4(uColor * 10.0, strength);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}