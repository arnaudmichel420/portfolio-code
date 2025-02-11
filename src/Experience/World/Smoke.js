import * as THREE from "three";
import Experience from "../Experience.js";
import smokeVertexShader from "./Shaders/Smoke/smokeVertexShader.glsl";
import smokeFragmentShader from "./Shaders/Smoke/smokeFragmentShader.glsl";

export default class Smoke {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Grass");
      //   this.debugFolder.close();
      this.setDebug();
    }
    this.setSmoke();
  }
  setDebug() {}
  setSmoke() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u: { value: 1 },
      },
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
    });
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }
}
