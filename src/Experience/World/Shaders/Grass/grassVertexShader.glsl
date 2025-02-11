attribute vec2 center;

uniform float uTime;
uniform sampler2D uHeightMap;
uniform sampler2D uGrassMap;
uniform float uPerlinSize;
uniform float uPerlinFrequency;
uniform float uHeightMapStrenght;
uniform vec2 uHeightMapSize;
uniform float uGridSize;
uniform float uLenght;




varying vec3 vColor;
varying float vElevation;
varying vec2 vUv;


#include ../Partials/getRotatePivot2d.glsl;
#include ../Partials/perlin3dNoise.glsl;
#include ../Partials/perlin2dNoise.glsl;




void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //follow camera 
    // vec2 gridMin = vec2(-uGridSize / 2.0, -uGridSize / 2.0);
    // vec2 gridMax = vec2(uGridSize / 2.0, uGridSize / 2.0);


    // modelPosition.xz += cameraPosition.xz;

    // modelPosition.x = clamp(modelPosition.x, gridMin.x, gridMax.x);
    // modelPosition.z = clamp(modelPosition.z, gridMin.y, gridMax.y);


    // vec2 newCenter = center + cameraPosition.xz;

    // newCenter.x = clamp(newCenter.x, gridMin.x, gridMax.x);
    // newCenter.y = clamp(newCenter.y, gridMin.y, gridMax.y);
// gl_VertexID;
    

    // rotate blades to camera
    float angle = atan(center.x - cameraPosition.x, center.y - cameraPosition.z);
    modelPosition.xz = getRotatePivot2d(modelPosition.xz, angle, center.xy);

    // //wind
    float topVertice = step(uLenght, modelPosition.y);
    modelPosition.xz += topVertice * cnoise(vec3(modelPosition.xz * uPerlinSize ,uTime * uPerlinFrequency));

    vElevation = modelPosition.y;

    //grass patch 
    float grassHeight = texture2D(uGrassMap, uv).r;
    modelPosition.y += topVertice * grassHeight ;

    //follow mesh
    vec2 scaledUV = vec2(uv.x, uv.y * (uHeightMapSize.x / uHeightMapSize.y));
    float height = texture2D(uHeightMap, uv).r;
    modelPosition.y += height * uHeightMapStrenght;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
}