attribute vec2 center;

uniform float uTime;
uniform sampler2D uHeightMap;
uniform sampler2D uGrassMap;
uniform sampler2D uPerlinNoise;
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

    //save elevation before displacement
    vElevation = newPosition.y;
    
    //follow camera 
    newPosition.x = mod(newPosition.x - cameraPosition.x, uChunkSize) +  cameraPosition.x + uGrassOffsetX;
    newPosition.z = mod(newPosition.z - cameraPosition.z, uChunkSize) +  cameraPosition.z + uGrassOffsetZ;

    vec2 newCenter = center;

    newCenter.x = mod(newCenter.x - cameraPosition.x, uChunkSize) +  cameraPosition.x + uGrassOffsetX;
    newCenter.y = mod(newCenter.y - cameraPosition.z, uChunkSize) +  cameraPosition.z + uGrassOffsetZ;

    // rotate blades to camera
    float angle = atan(newCenter.x - cameraPosition.x, newCenter.y - cameraPosition.z);
    newPosition.xz = getRotatePivot2d(newPosition.xz, angle, newCenter.xy);

    //corrected Uvs
    vec2 uvScale = (newPosition.xz - -uGridSize / 2.0) / (uGridSize / 2.0 - -uGridSize / 2.0);

    //grass patch 
    float topVertice = step(uLenght, newPosition.y);
    float grassHeight = texture2D(uGrassMap, uvScale).r;
    newPosition.y += topVertice * (grassHeight - uLenght);

    //wind
    // topVertice = step(0.3, newPosition.y);
    newPosition.xz += topVertice * cnoise(vec3(newPosition.xz * uPerlinSize ,uTime * uPerlinFrequency)) * 0.5;

    //follow mesh
    float height = texture2D(uHeightMap, uvScale).r;
    newPosition.y += height * uHeightMapStrenght;


    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
}