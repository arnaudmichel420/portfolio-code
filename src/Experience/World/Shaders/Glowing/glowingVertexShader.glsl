uniform float uTime;

varying vec2 vUv;

void main(){
    //pulse effect
    vec3 newPosition = position;
    newPosition *= 1.01 + (sin(uTime * 0.001) + 1.0) * 0.05;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;

}