uniform float uTime;
uniform float uSize;
uniform float uSpeed;

attribute float aScale;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime * uSpeed + modelPosition.x * 100.0) * aScale * 0.3 ;
    modelPosition.x += sin(uTime * uSpeed * modelPosition.x * uSpeed) + sin(uTime * uSpeed * modelPosition.x * uSpeed * 2.0) + sin(uTime * uSpeed * modelPosition.x * uSpeed * 0.5) + sin(uTime * uSpeed * modelPosition.x * uSpeed * 0.25) * aScale * 10.0;
    modelPosition.z += cos(uTime * uSpeed * modelPosition.x * uSpeed) + cos(uTime * uSpeed * modelPosition.x * uSpeed * 2.0) + cos(uTime * uSpeed * modelPosition.x * uSpeed * 0.5) + cos(uTime * uSpeed * modelPosition.x * uSpeed * 0.25) * aScale * 10.0;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
}