import * as THREE from "three";
import Experience from "../Experience.js";
import grassVertexShader from "./Shaders/Grass/grassVertexShader.glsl";
import grassFragmentShader from "./Shaders/Grass/grassFragmentShader.glsl";

export default class Grass {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.phone = this.experience.phone;
    this.time = this.experience.time;
    this.world = this.experience.world;
    this.geometry = null;

    this.parameters = {};
    this.parameters.blades = 200000;
    this.parameters.uOffset = 0.2;
    this.parameters.uLength = 1;
    this.parameters.uChunkSize = 125;
    this.parameters.uGrassOffsetX = -85;
    this.parameters.uGrassOffsetZ = -125;
    this.parameters.uGridSize = 250;
    this.parameters.uHeightMapStrenght = 72.5;
    this.parameters.uBladesTopColor1 = "#10b22b";
    this.parameters.uBladesTopColor2 = "#3d9900";
    this.parameters.uBladesBottomColor = "#0b2d06";
    this.parameters.uBladesShadowColor = "#000000";
    this.parameters.uBladesLightColor = "#FF0000";
    this.parameters.uShadowOpacity = 0.3;
    this.parameters.uLightOpacity = 0.4;
    this.parameters.uColorOffset = 0.5;
    this.parameters.uPerlinSize = 0.1;
    this.parameters.uPerlinFrequency = 0.0003;
    this.parameters.uGrassMapOffsetX = -0.0001;
    this.parameters.uGrassMapOffsetZ = 0.0032;

    if (this.phone.active) {
      this.parameters.blades = 70000;
      this.parameters.uChunkSize = 100;
      this.parameters.uGrassOffsetX = -80;
      this.parameters.uGrassOffsetZ = -89;
    }

    this.setGrass();

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🌿 Grass");
      this.debugFolder.close();
      this.setDebug();
    }
  }
  setDebug() {
    this.debugFolder
      .add(this.parameters, "blades")
      .min(0)
      .max(300000)
      .step(10)
      .onFinishChange(this.setGrass.bind(this));
    this.debugFolder
      .add(this.parameters, "uOffset")
      .min(0)
      .max(1)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uOffset.value = this.parameters.uOffset;
      });
    this.debugFolder
      .add(this.parameters, "uLength")
      .min(0)
      .max(3)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uLength.value = this.parameters.uLength;
      });
    this.debugFolder
      .add(this.parameters, "uGridSize")
      .min(0)
      .max(500)
      .step(0.1)
      .onChange(() => {
        this.material.uniforms.uGridSize.value = this.parameters.uGridSize;
      });
    this.debugFolder
      .add(this.parameters, "uHeightMapStrenght")
      .min(0)
      .max(500)
      .step(0.1)
      .onChange(() => {
        this.material.uniforms.uHeightMapStrenght.value =
          this.parameters.uHeightMapStrenght;
      });
    this.debugFolder
      .add(this.parameters, "uChunkSize")
      .min(0)
      .max(100)
      .step(1)
      .onFinishChange(this.setGrass.bind(this));
    this.debugFolder
      .add(this.parameters, "uGrassOffsetX")
      .min(-250)
      .max(250)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uGrassOffsetX.value =
          this.parameters.uGrassOffsetX;
      });
    this.debugFolder
      .add(this.parameters, "uGrassOffsetZ")
      .min(-250)
      .max(250)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uGrassOffsetZ.value =
          this.parameters.uGrassOffsetZ;
      });
    this.debugFolder
      .add(this.parameters, "uGrassMapOffsetX")
      .min(-0.1)
      .max(1)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uGrassMapOffsetX.value =
          this.parameters.uGrassMapOffsetX;
      });
    this.debugFolder
      .add(this.parameters, "uGrassMapOffsetZ")
      .min(-0.1)
      .max(1)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uGrassMapOffsetZ.value =
          this.parameters.uGrassMapOffsetZ;
      });
    this.debugFolder
      .add(this.parameters, "uColorOffset")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uColorOffset.value =
          this.parameters.uColorOffset;
      });
    this.debugFolder
      .addColor(this.parameters, "uBladesTopColor1")
      .onChange(() => {
        this.material.uniforms.uBladesTopColor1.value.set(
          this.parameters.uBladesTopColor1
        );
      });
    this.debugFolder
      .addColor(this.parameters, "uBladesTopColor2")
      .onChange(() => {
        this.material.uniforms.uBladesTopColor2.value.set(
          this.parameters.uBladesTopColor2
        );
      });
    this.debugFolder
      .addColor(this.parameters, "uBladesBottomColor")
      .onChange(() => {
        this.material.uniforms.uBladesBottomColor.value.set(
          this.parameters.uBladesBottomColor
        );
      });
    this.debugFolder
      .addColor(this.parameters, "uBladesShadowColor")
      .onChange(() => {
        this.material.uniforms.uBladesShadowColor.value.set(
          this.parameters.uBladesShadowColor
        );
      });
    this.debugFolder
      .addColor(this.parameters, "uBladesLightColor")
      .onChange(() => {
        this.material.uniforms.uBladesLightColor.value.set(
          this.parameters.uBladesLightColor
        );
      });
    this.debugFolder
      .add(this.parameters, "uShadowOpacity")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uShadowOpacity.value =
          this.parameters.uShadowOpacity;
      });
    this.debugFolder
      .add(this.parameters, "uLightOpacity")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uLightOpacity.value =
          this.parameters.uLightOpacity;
      });
    this.debugFolder
      .add(this.parameters, "uPerlinSize")
      .min(0)
      .max(1)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uPerlinSize.value = this.parameters.uPerlinSize;
      });
    this.debugFolder
      .add(this.parameters, "uPerlinFrequency")
      .min(0)
      .max(0.001)
      .step(0.00001)
      .onChange(() => {
        this.material.uniforms.uPerlinFrequency.value =
          this.parameters.uPerlinFrequency;
      });
  }

  setGrass() {
    this.uHeightMap = this.experience.ressources.item.heightMap;
    this.uHeightMap.flipY = false;

    this.uGrassMap = this.experience.ressources.item.grassMap;
    this.uGrassMap.flipY = false;

    this.uPerlinNoise = this.experience.ressources.item.perlinNoise;
    this.uPerlinNoise.wrapS = THREE.RepeatWrapping;
    this.uPerlinNoise.wrapT = THREE.RepeatWrapping;

    if (this.geometry != null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }

    const positions = new Float32Array(this.parameters.blades * 3 * 3);

    for (let i = 0; i < this.parameters.blades; i++) {
      const positionX = (Math.random() - 0.5) * this.parameters.uChunkSize + 10;

      const positionZ = (Math.random() - 0.5) * this.parameters.uChunkSize - 10;

      const positionY = 0;

      const i9 = i * 9;
      positions[i9 + 0] = positionX;
      positions[i9 + 1] = positionY;
      positions[i9 + 2] = positionZ;
      positions[i9 + 3] = positionX;
      positions[i9 + 4] = positionY;
      positions[i9 + 5] = positionZ;
      positions[i9 + 6] = positionX;
      positions[i9 + 7] = positionY;
      positions[i9 + 8] = positionZ;
    }

    this.geometry = new THREE.BufferGeometry();

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uOffset: new THREE.Uniform(this.parameters.uOffset),
        uLength: new THREE.Uniform(this.parameters.uLength),
        uHeightMap: new THREE.Uniform(this.uHeightMap),
        uGrassMap: new THREE.Uniform(this.uGrassMap),
        uPerlinSize: new THREE.Uniform(this.parameters.uPerlinSize),
        uPerlinFrequency: new THREE.Uniform(this.parameters.uPerlinFrequency),
        uBladesTopColor1: {
          value: new THREE.Color(this.parameters.uBladesTopColor1),
        },
        uBladesTopColor2: {
          value: new THREE.Color(this.parameters.uBladesTopColor2),
        },
        uBladesBottomColor: {
          value: new THREE.Color(this.parameters.uBladesBottomColor),
        },
        uBladesShadowColor: {
          value: new THREE.Color(this.parameters.uBladesShadowColor),
        },
        uBladesLightColor: {
          value: new THREE.Color(this.parameters.uBladesLightColor),
        },
        uShadowOpacity: new THREE.Uniform(this.parameters.uShadowOpacity),
        uLightOpacity: new THREE.Uniform(this.parameters.uLightOpacity),
        uColorOffset: new THREE.Uniform(this.parameters.uColorOffset),
        uHeightMapStrenght: new THREE.Uniform(
          this.parameters.uHeightMapStrenght
        ),
        uGridSize: new THREE.Uniform(this.parameters.uGridSize),
        uChunkSize: new THREE.Uniform(this.parameters.uChunkSize),
        uGrassOffsetX: new THREE.Uniform(this.parameters.uGrassOffsetX),
        uGrassOffsetZ: new THREE.Uniform(this.parameters.uGrassOffsetZ),
        uGrassMapOffsetX: new THREE.Uniform(this.parameters.uGrassMapOffsetX),
        uGrassMapOffsetZ: new THREE.Uniform(this.parameters.uGrassMapOffsetZ),
        uPerlinNoise: new THREE.Uniform(this.uPerlinNoise),
      },
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }
  elapsedTime() {
    if (this.material.uniforms.uTime != null) {
      this.material.uniforms.uTime.value = this.time.elapsed;
    }
  }
}
