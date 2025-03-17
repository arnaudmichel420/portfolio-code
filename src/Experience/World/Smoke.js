import * as THREE from "three";
import Experience from "../Experience.js";
import smokeVertexShader from "./Shaders/Smoke/smokeVertexShader.glsl";
import smokeFragmentShader from "./Shaders/Smoke/smokeFragmentShader.glsl";

export default class Smoke {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.parameters = {};
    this.parameters.color = "#ffbf66";
    this.parameters.perlinSizeX = 0.5;
    this.parameters.perlinSizeY = 0.25;
    this.parameters.twistFrequency = 0.11;

    this.setSmoke();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("💨 Smoke");
      this.debugFolder.close();
      this.setDebug();
    }
  }
  setDebug() {
    this.debugFolder.addColor(this.parameters, "color").onChange(() => {
      this.material.uniforms.uColor.value.set(this.parameters.color);
    });
    this.debugFolder
      .add(this.parameters, "perlinSizeX")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uPerlinSizeX.value = this.parameters.perlinSizeX;
      });
    this.debugFolder
      .add(this.parameters, "perlinSizeY")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uPerlinSizeY.value = this.parameters.perlinSizeY;
      });
    this.debugFolder
      .add(this.parameters, "twistFrequency")
      .min(0)
      .max(0.5)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uTwistFrequency.value =
          this.parameters.twistFrequency;
      });
    this.debugFolder
      .add(this.mesh.position, "x")
      .min(-500)
      .max(500)
      .step(0.1)
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
      .step(0.1)
      .name("positionZ");
    this.debugFolder
      .add(this.mesh.rotation, "y")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("rotationY");
  }
  setSmoke() {
    if (this.geometry != null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }

    this.perlinNoise = this.experience.ressources.item.perlinNoise;
    this.perlinNoise.wrapS = THREE.RepeatWrapping;
    this.perlinNoise.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinNoise: new THREE.Uniform(this.perlinNoise),
        uColor: { value: new THREE.Color(this.parameters.color) },
        uPerlinSizeX: new THREE.Uniform(this.parameters.perlinSizeX),
        uPerlinSizeY: new THREE.Uniform(this.parameters.perlinSizeY),
        uTwistFrequency: new THREE.Uniform(this.parameters.twistFrequency),
      },
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 64);
    this.geometry.translate(0, 0.5, 0);
    this.geometry.scale(1, 12, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(-109.7, 78, 58.5);
    this.mesh.rotation.set(0, 0, 0);
    this.scene.add(this.mesh);
  }
  elapsedTime() {
    if (this.material.uniforms.uTime != null) {
      this.material.uniforms.uTime.value = this.time.elapsed;
    }
  }
}
