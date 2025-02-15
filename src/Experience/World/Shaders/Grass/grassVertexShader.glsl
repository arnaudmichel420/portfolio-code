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
uniform float uChunkSize;
uniform float uGrassOffsetX;
uniform float uGrassOffsetZ;




varying vec3 vColor;
varying float vElevation;
varying vec2 vUv;


#include ../Partials/getRotatePivot2d.glsl;
#include ../Partials/perlin3dNoise.glsl;




void main()
{
    vec3 newPosition = position;

    //follow camera 
    newPosition.x = mod(newPosition.x - cameraPosition.x, uChunkSize) +  cameraPosition.x + uGrassOffsetX;
    newPosition.z = mod(newPosition.z - cameraPosition.z, uChunkSize) +  cameraPosition.z + uGrassOffsetZ;

    vec2 newCenter = center;

    newCenter.x = mod(newCenter.x - cameraPosition.x, uChunkSize) +  cameraPosition.x + uGrassOffsetX;
    newCenter.y = mod(newCenter.y - cameraPosition.z, uChunkSize) +  cameraPosition.z + uGrassOffsetZ;

    

    // rotate blades to camera
    float angle = atan(newCenter.x - cameraPosition.x, newCenter.y - cameraPosition.z);
    newPosition.xz = getRotatePivot2d(newPosition.xz, angle, newCenter.xy);

    //wind
    float topVertice = step(uLenght, newPosition.y);
    newPosition.xz += topVertice * cnoise(vec3(newPosition.xz * uPerlinSize ,uTime * uPerlinFrequency));

    vElevation = newPosition.y;

    
    vec2 uvScale = (newPosition.xz - -uGridSize / 2.0) / (uGridSize / 2.0 - -uGridSize / 2.0);
    
    //grass patch 
    float grassHeight = texture2D(uGrassMap, uvScale).r;
    newPosition.y += topVertice * grassHeight ;

    //follow mesh
    float height = texture2D(uHeightMap, uvScale).r;
    newPosition.y += height * uHeightMapStrenght;


    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
}
// vec2 scaledUV = vec2(uv.x, uv.y * (uHeightMapSize.x / uHeightMapSize.y));
// vec2 gridMin = vec2(-uGridSize / 2.0, -uGridSize / 2.0);
    // vec2 gridMax = vec2(uGridSize / 2.0, uGridSize / 2.0);


    // newPosition.xz += cameraPosition.xz;

    // newPosition.x = clamp(newPosition.x, gridMin.x, gridMax.x);
    // newPosition.z = clamp(newPosition.z, gridMin.y, gridMax.y);


    // vec2 newCenter = center + cameraPosition.xz;

    // newCenter.x = clamp(newCenter.x, gridMin.x, gridMax.x);
    // newCenter.y = clamp(newCenter.y, gridMin.y, gridMax.y);
// gl_VertexID;