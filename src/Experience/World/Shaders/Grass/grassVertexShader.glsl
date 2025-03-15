attribute vec2 center;

uniform float uTime;
uniform float uOffset;
uniform float uLength;
uniform float uPerlinSize;
uniform float uPerlinFrequency;
uniform float uHeightMapStrenght;
uniform float uGridSize;
uniform float uChunkSize;
uniform float uGrassOffsetX;
uniform float uGrassOffsetZ;
uniform float uGrassMapOffsetX;
uniform float uGrassMapOffsetZ;
uniform sampler2D uHeightMap;
uniform sampler2D uGrassMap;
uniform sampler2D uPerlinNoise;

varying vec3 vColor;
varying float vElevation;
varying vec2 vUv;

#include ../Partials/getRotatePivot2d.glsl;
#include ../Partials/perlin3dNoise.glsl;

void main()
{
    vec3 newPosition = position;

    //define vertex position in the blade
    bool isFirstVertex = mod(float(gl_VertexID), 3.0) == 0.0;
    bool isSecondVertex = mod(float(gl_VertexID), 3.0) == 1.0;
    bool isThirdVertex = mod(float(gl_VertexID), 3.0) == 2.0;

    //move with camera
    newPosition.x = mod(newPosition.x - cameraPosition.x, uChunkSize) +  cameraPosition.x + uGrassOffsetX;
    newPosition.z = mod(newPosition.z - cameraPosition.z, uChunkSize) +  cameraPosition.z + uGrassOffsetZ;

    //store center before offset
    vec2 newCenter = mix(mix(newPosition.xz, newPosition.xz, float(isSecondVertex)), newPosition.xz, float(isThirdVertex));

    //corrected Uvs
    vec2 uvScale = (newPosition.xz - -uGridSize / 2.0) / (uGridSize / 2.0 - -uGridSize / 2.0);
    vec2 uvScaleWithOffset = uvScale;
    uvScaleWithOffset.x += uGrassMapOffsetX;
    uvScaleWithOffset.y += uGrassMapOffsetZ;
    
    //offset
    newPosition.x += float(isFirstVertex) * uOffset;
    newPosition.x -= float(isSecondVertex) * uOffset;

    //perlin for length
    float noise = texture(uPerlinNoise, uvScaleWithOffset * 2.0).r;
    newPosition.y += float(isThirdVertex) * (uLength * 2.0) * noise;

    //store elevation before offset
    vElevation = newPosition.y;

    // rotate blades to camera
    float angle = atan(newCenter.x - cameraPosition.x, newCenter.y - cameraPosition.z);
    newPosition.xz = getRotatePivot2d(newPosition.xz, angle, newCenter.xy);

    
    //grass patch 
    float grassHeight = texture2D(uGrassMap, uvScaleWithOffset).r;
    newPosition.y += float(isThirdVertex) * (grassHeight * - uLength);
    newPosition.y += float(isThirdVertex) * (step(0.9, grassHeight) * - uLength);

    //wind
    newPosition.xz += float(isThirdVertex) * cnoise(vec3(newPosition.xz * uPerlinSize ,uTime * uPerlinFrequency)) * 0.5;

    //follow mesh
    float height = texture2D(uHeightMap, uvScale).r;
    newPosition.y += height * uHeightMapStrenght;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uvScaleWithOffset;
}

// -74.9296 m
// 126.808 m
// 200.01 m

// 250.0


// -88.1168 m
// 139.223 m
// 413.659 m