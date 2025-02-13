import * as THREE from "three";
import Experience from "../Experience.js";
import snowVertexShader from "./Shaders/Snow/snowVertexShader.glsl";
import snowFragmentShader from "./Shaders/Snow/snowFragmentShader.glsl";

export default class Snow {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.parameters = {};
    this.parameters.snow = 10000;
    this.parameters.size = 5;
    this.parameters.snowSpeed = 0.005;
    this.parameters.snowRangeX = 150;
    this.parameters.snowRangeY = 70;
    this.parameters.snowRangeZ = 100;
    this.parameters.snowOffsetX = -75;
    this.parameters.snowOffsetY = -40;
    this.parameters.snowOffsetZ = -75;
    this.parameters.snowDensity = 0;

    this.setSnow();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("❄️ Snow");
      //   this.debugFolder.close();
      this.setDebug();
    }
  }
  setDebug() {
    this.debugFolder
      .add(this.parameters, "snow")
      .min(0)
      .max(10000)
      .step(1)
      .onChange(() => {
        this.setSnow();
      });
    this.debugFolder
      .add(this.parameters, "size")
      .min(0)
      .max(20)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uSize.value = this.parameters.size;
      });
    this.debugFolder
      .add(this.parameters, "snowSpeed")
      .min(0.00001)
      .max(0.009)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uSnowSpeed.value = this.parameters.snowSpeed;
      });
    this.debugFolder
      .add(this.parameters, "snowRangeX")
      .min(0)
      .max(300)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowRangeX.value = this.parameters.snowRangeX;
      });
    this.debugFolder
      .add(this.parameters, "snowRangeY")
      .min(0)
      .max(300)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowRangeY.value = this.parameters.snowRangeY;
      });
    this.debugFolder
      .add(this.parameters, "snowRangeZ")
      .min(0)
      .max(300)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowRangeZ.value = this.parameters.snowRangeZ;
      });
    this.debugFolder
      .add(this.parameters, "snowOffsetX")
      .min(-100)
      .max(200)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowOffsetX.value = this.parameters.snowOffsetX;
      });
    this.debugFolder
      .add(this.parameters, "snowOffsetY")
      .min(-100)
      .max(200)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowOffsetY.value = this.parameters.snowOffsetY;
      });
    this.debugFolder
      .add(this.parameters, "snowOffsetZ")
      .min(-100)
      .max(200)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowOffsetZ.value = this.parameters.snowOffsetZ;
      });
    this.debugFolder
      .add(this.parameters, "snowDensity")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uSnowDensity.value = this.parameters.snowDensity;
      });
  }
  setSnow() {
    this.snowTexture = this.experience.ressources.item.snowTexture;

    if (this.geometry != null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }
    const positions = new Float32Array(this.parameters.snow * 3);
    const sizes = new Float32Array(this.parameters.snow);

    for (let i = 0; i < this.parameters.snow; i++) {
      const positionX = (Math.random() - 0.5) * 150;
      const positionY = (Math.random() - 0) * 300;
      const positionZ = (Math.random() - 0.5) * 150 - 75;

      const i3 = i * 3;

      positions[i3 + 0] = positionX;
      positions[i3 + 1] = positionY;
      positions[i3 + 2] = positionZ;

      sizes[i] = Math.random() * 0.5 + 0.5;
    }

    this.geometry = new THREE.BufferGeometry();

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute(
      "aSize",
      new THREE.Float32BufferAttribute(positions, 1)
    );

    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: {
          value:
            this.parameters.size *
            this.experience.renderer.instance.getPixelRatio(),
        },
        uSnowTexture: new THREE.Uniform(this.snowTexture),
        uSnow: { value: this.parameters.snow },
        uSnowSpeed: { value: this.parameters.snowSpeed },
        uSnowRangeX: { value: this.parameters.snowRangeX },
        uSnowRangeY: { value: this.parameters.snowRangeY },
        uSnowRangeZ: { value: this.parameters.snowRangeZ },
        uSnowOffsetX: { value: this.parameters.snowOffsetX },
        uSnowOffsetY: { value: this.parameters.snowOffsetY },
        uSnowOffsetZ: { value: this.parameters.snowOffsetZ },
        uSnowDensity: { value: this.parameters.snowDensity },
      },
      fragmentShader: snowFragmentShader,
      vertexShader: snowVertexShader,
      transparent: true,
      //   wireframe: true,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    // this.mesh.position.set(100, 17, 100);
    this.scene.add(this.mesh);
    console.log(this.mesh);
  }
  elapsedTime() {
    if (this.material.uniforms.uTime != null) {
      this.material.uniforms.uTime.value = this.time.elapsed;
    }
  }
}
