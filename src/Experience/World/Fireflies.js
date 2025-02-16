import * as THREE from "three";
import Experience from "../Experience.js";
import firefliesVertexShader from "./Shaders/Fireflies/firefliesVertexShader.glsl";
import firefliesFragmentShader from "./Shaders/Fireflies/firefliesFragmentShader.glsl";

export default class Fireflies {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.parameters = {};
    this.parameters.fireflies = 30;
    this.parameters.uSize = 1000;
    this.parameters.uSpeed = 0.001;
    this.parameters.rangeX = 45;
    this.parameters.rangeY = 10;
    this.parameters.rangeZ = 38;
    this.parameters.offsetX = 82;
    this.parameters.offsetY = 2;
    this.parameters.offsetZ = 101;
    this.parameters.uColor = "#fff7c2";

    this.setFireflies();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🪰 Fireflies");
      // this.debugFolder.close();
      this.setDebug();
    }
  }
  setDebug() {
    this.debugFolder
      .add(this.parameters, "fireflies")
      .min(0)
      .max(100)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder
      .add(this.parameters, "uSize")
      .min(500)
      .max(3000)
      .step(0.1)
      .onChange(() => {
        this.material.uniforms.uSize.value = this.parameters.uSize;
      });
    this.debugFolder
      .add(this.parameters, "uSpeed")
      .min(0.00001)
      .max(0.01)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uSpeed.value = this.parameters.uSpeed;
      });
    this.debugFolder
      .add(this.parameters, "rangeX")
      .min(0)
      .max(100)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder
      .add(this.parameters, "rangeY")
      .min(0)
      .max(100)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder
      .add(this.parameters, "rangeZ")
      .min(0)
      .max(100)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder
      .add(this.parameters, "offsetX")
      .min(-200)
      .max(200)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder
      .add(this.parameters, "offsetY")
      .min(-200)
      .max(200)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder
      .add(this.parameters, "offsetZ")
      .min(-200)
      .max(200)
      .step(1)
      .onFinishChange(this.setFireflies.bind(this));
    this.debugFolder.addColor(this.parameters, "uColor").onChange(() => {
      this.material.uniforms.uColor.value.set(this.parameters.uColor);
    });
  }
  setFireflies() {
    if (this.geometry != null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }

    const positions = new Float32Array(this.parameters.fireflies * 3);
    const sizes = new Float32Array(this.parameters.fireflies);

    for (let i = 0; i < this.parameters.fireflies; i++) {
      positions[i * 3] =
        (Math.random() - 0.5) * this.parameters.rangeX +
        this.parameters.offsetX;
      positions[i * 3 + 1] =
        Math.random() * this.parameters.rangeY + this.parameters.offsetY;
      positions[i * 3 + 2] =
        (Math.random() - 0.5) * this.parameters.rangeZ +
        this.parameters.offsetZ;

      sizes[i] = Math.random();
    }
    this.geometry = new THREE.BufferGeometry();

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute("aScale", new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: {
          value:
            this.parameters.uSize *
            this.experience.renderer.instance.getPixelRatio(),
        },
        uColor: { value: new THREE.Color(this.parameters.uColor) },
        uSpeed: { value: this.parameters.uSpeed },
      },
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
  elapsedTime() {
    if (this.material.uniforms.uTime != null) {
      this.material.uniforms.uTime.value = this.time.elapsed;
    }
  }
}
