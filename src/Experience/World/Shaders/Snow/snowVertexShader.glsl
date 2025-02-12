attribute float aSize;

uniform float uTime;
uniform float uSize;
uniform float uSnow;
uniform float uSnowSpeed;
uniform float uSnowHeightY;
uniform float uSnowOffsetY;
uniform float uSnowDensity;


varying vec2 vUv;
varying float vElevation;


void main()
{   
    
    vec3 newPosition = position;

    // newPosition.xz += cameraPosition.xz;
    
    //fall
    newPosition.y -= uTime * uSnowSpeed;

    //wind
    newPosition.x += sin(uTime * 0.0005) + sin(uTime * 0.0015) + cos(uTime * 0.00025) + cos(uTime * 0.0000625);
    newPosition.z += cos(uTime * 0.0005) + cos(uTime * 0.0015) + sin(uTime * 0.00025) + sin(uTime * 0.0000625);

    //loop back
    newPosition.y = mod(newPosition.y, uSnowHeightY) + uSnowOffsetY;
    
    float stepValue = step( float(gl_VertexID) / uSnow, uSnowDensity);
    newPosition.y += stepValue * uSnowHeightY * 2.0;

    //smooth transition
    vElevation = newPosition.y;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
    gl_PointSize = uSize * aSize;
    gl_PointSize *= (1.0 / - viewPosition.z);
}