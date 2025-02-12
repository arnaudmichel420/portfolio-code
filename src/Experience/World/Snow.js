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
    this.parameters.size = 10;
    this.parameters.snowSpeed = 0.005;
    this.parameters.snowHeightY = 200;
    this.parameters.snowOffsetY = 100;
    this.parameters.snowDensity = 0.1;

    this.setSnow();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("❄️ Snow");
      //   this.debugFolder.close();
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
      .add(this.parameters, "snowHeightY")
      .min(0)
      .max(300)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowHeightY.value = this.parameters.snowHeightY;
      });
    this.debugFolder
      .add(this.parameters, "snowOffsetY")
      .min(0)
      .max(200)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uSnowOffsetY.value = this.parameters.snowOffsetY;
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
      const positionX = (Math.random() - 0.5) * 100 + 80;
      const positionY = (Math.random() - 0) * 300;
      const positionZ = (Math.random() - 0.5) * 100 + 80;

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
        uSnowHeightY: { value: this.parameters.snowHeightY },
        uSnowOffsetY: { value: this.parameters.snowOffsetY },
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
