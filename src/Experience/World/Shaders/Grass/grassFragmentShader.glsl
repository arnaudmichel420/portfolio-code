uniform vec3 uBladesTopColor1;
uniform vec3 uBladesTopColor2;
uniform vec3 uBladesBottomColor;
uniform vec3 uBladesShadowColor;
uniform vec3 uBladesLightColor;
uniform float uColorOffset;
uniform float uLength;
uniform float uShadowOpacity;
uniform float uLightOpacity;
uniform sampler2D uPerlinNoise;
uniform sampler2D uGrassMap;

varying float vElevation;
varying vec2 vUv;

void main()
{
    //random color patch 
    float noise = texture(uPerlinNoise, vUv * 2.0).r;
    vec3 colorPatch = mix(uBladesTopColor1, uBladesTopColor2, noise);
    
    //blades elevation
    float elevation = vElevation + uColorOffset * uLength;
    vec3 mixElevation = mix(uBladesBottomColor, colorPatch, elevation);

    //shadow
    float shadow = texture(uGrassMap, vUv).g;
    vec3 shadowColor = mix(mixElevation , uBladesShadowColor, uShadowOpacity * shadow);
    vec3 mixShadowColor = mix(mixElevation, shadowColor, step(0.1, shadow));

    //light
    float light = texture(uGrassMap, vUv).b;
    vec3 lightColor = mix(mixShadowColor , uBladesLightColor, uLightOpacity * light);
    vec3 mixlightColor = mix(mixShadowColor, lightColor, step(0.1, light));

    gl_FragColor = vec4(mixlightColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}