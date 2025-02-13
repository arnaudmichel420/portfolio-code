attribute float aSize;

uniform float uTime;
uniform float uSize;
uniform float uSnow;
uniform float uSnowSpeed;
uniform float uSnowRangeX;
uniform float uSnowRangeY;
uniform float uSnowRangeZ;
uniform float uSnowOffsetX;
uniform float uSnowOffsetY;
uniform float uSnowOffsetZ;
uniform float uSnowDensity;


varying vec2 vUv;
varying float vElevation;


void main()
{   
    
    vec3 newPosition = position;

    
    //fall
    newPosition.y -= uTime * uSnowSpeed;

    //wind
    newPosition.x += sin(uTime * 0.0005) + sin(uTime * 0.0015) + cos(uTime * 0.00025) + cos(uTime * 0.0000625) + uTime * 0.005;
    newPosition.z += cos(uTime * 0.0005) + cos(uTime * 0.0015) + sin(uTime * 0.00025) + sin(uTime * 0.0000625) + uTime * 0.001;

    //loop back
    newPosition.x = mod(newPosition.x, uSnowRangeX) +  cameraPosition.x + uSnowOffsetX;
    newPosition.z = mod(newPosition.z, uSnowRangeZ) +  cameraPosition.z + uSnowOffsetZ;
    newPosition.y = mod(newPosition.y, uSnowRangeY) + (uSnowOffsetY + cameraPosition.y);
    
    float stepValue = step( float(gl_VertexID) / uSnow, 1.0 - uSnowDensity);
    newPosition.y += stepValue * uSnowRangeY * 2.0;

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