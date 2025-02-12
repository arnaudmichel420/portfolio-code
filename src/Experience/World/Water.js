import * as THREE from "three";
import Experience from "../Experience.js";
import waterVertexShader from "./Shaders/Water/waterVertexShader.glsl";
import waterFragmentShader from "./Shaders/Water/waterFragmentShader.glsl";

export default class Smoke {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.parameters = {};
    this.parameters.colorWater = "#5762ff";
    this.parameters.colorRipple = "#8f96ff";
    this.parameters.rippleSize = 37;
    this.parameters.rippleFrequency = 0.0004;
    this.parameters.rippleStep = 0.995;
    this.parameters.waterTransparency = 0.8;

    this.setWater();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("💧 Water");
      this.debugFolder.close();
      this.setDebug();
    }
  }
  setDebug() {
    this.debugFolder
      .add(this.mesh.position, "x")
      .min(-500)
      .max(500)
      .step(1)
      .name("positionX");
    this.debugFolder
      .add(this.mesh.position, "y")
      .min(-500)
      .max(500)
      .step(0.1)
      .name("positionY");
    this.debugFolder
      .add(this.mesh.position, "z")
      .min(-500)
      .max(500)
      .step(1)
      .name("positionZ");
    this.debugFolder
      .add(this.parameters, "rippleSize")
      .min(0)
      .max(200)
      .step(0.1)
      .onChange(() => {
        this.material.uniforms.uRippleSize.value = this.parameters.rippleSize;
      });
    this.debugFolder
      .add(this.parameters, "rippleFrequency")
      .min(0)
      .max(0.001)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uRippleFrequency.value =
          this.parameters.rippleFrequency;
      });
    this.debugFolder
      .add(this.parameters, "rippleStep")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uRippleStep.value = this.parameters.rippleStep;
      });
    this.debugFolder.addColor(this.parameters, "colorWater").onChange(() => {
      this.material.uniforms.uColorWater.value.set(this.parameters.colorWater);
    });
    this.debugFolder.addColor(this.parameters, "colorRipple").onChange(() => {
      this.material.uniforms.uColorRipple.value.set(
        this.parameters.colorRipple
      );
    });
    this.debugFolder
      .add(this.parameters, "waterTransparency")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.setWater();
      });
  }
  setWater() {
    if (this.geometry != null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }

    this.perlinNoise = this.experience.ressources.item.perlinNoise;
    this.perlinNoise.wrapS = THREE.RepeatWrapping;
    this.perlinNoise.wrapT = THREE.RepeatWrapping;

    this.geometry = new THREE.PlaneGeometry(30, 20, 128, 128);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPerlinNoise: new THREE.Uniform(this.perlinNoise),
        uColorWater: { value: new THREE.Color(this.parameters.colorWater) },
        uColorRipple: { value: new THREE.Color(this.parameters.colorRipple) },
        uRippleSize: { value: this.parameters.rippleSize },
        uRippleFrequency: { value: this.parameters.rippleFrequency },
        uRippleStep: { value: this.parameters.rippleStep },
        uWaterTransparency: { value: this.parameters.waterTransparency },
      },
      fragmentShader: waterFragmentShader,
      vertexShader: waterVertexShader,
      transparent: true,
      //   wireframe: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(84, 1.8, 95);
    this.mesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.mesh);
  }
  elapsedTime() {
    if (this.material.uniforms.uTime != null) {
      this.material.uniforms.uTime.value = this.time.elapsed;
    }
  }
}
