import * as THREE from "three";
import Experience from "../Experience.js";
import grassVertexShader from "./Shaders/Grass/grassVertexShader.glsl";
import grassFragmentShader from "./Shaders/Grass/grassFragmentShader.glsl";

export default class Grass {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.world = this.experience.world;
    this.geometry = null;

    this.parameters = {};
    this.parameters.blades = 50000;
    this.parameters.offset = 0.2;
    this.parameters.length = 1;
    this.parameters.chunkSize = 100;
    this.parameters.grassOffsetX = -80;
    this.parameters.grassOffsetZ = -95;
    this.parameters.gridSize = 250;
    this.parameters.heightMapStrenght = 72.5;
    this.parameters.bladesTopColor1 = "#54ce12";
    this.parameters.bladesTopColor2 = "#212f13";
    this.parameters.bladesBottomColor = "#0b2d06";
    this.parameters.colorOffset = 0.5;
    this.parameters.perlinSize = 0.1;
    this.parameters.perlinFrequency = 0.0002;

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
      .max(100000)
      .step(10)
      .onFinishChange(this.setGrass.bind(this));
    this.debugFolder
      .add(this.parameters, "offset")
      .min(0)
      .max(1)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uOffset.value = this.parameters.offset;
      });
    this.debugFolder
      .add(this.parameters, "length")
      .min(0)
      .max(3)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uLength.value = this.parameters.length;
      });
    this.debugFolder
      .add(this.parameters, "gridSize")
      .min(0)
      .max(500)
      .step(0.1)
      .onFinishChange(this.setGrass.bind(this));
    this.debugFolder
      .add(this.parameters, "heightMapStrenght")
      .min(0)
      .max(500)
      .step(0.1)
      .onChange(() => {
        this.material.uniforms.uHeightMapStrenght.value =
          this.parameters.heightMapStrenght;
      });
    this.debugFolder
      .add(this.parameters, "chunkSize")
      .min(0)
      .max(100)
      .step(1)
      .onFinishChange(this.setGrass.bind(this));
    this.debugFolder
      .add(this.parameters, "grassOffsetX")
      .min(-250)
      .max(250)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uGrassOffsetX.value =
          this.parameters.grassOffsetX;
      });
    this.debugFolder
      .add(this.parameters, "grassOffsetZ")
      .min(-250)
      .max(250)
      .step(1)
      .onChange(() => {
        this.material.uniforms.uGrassOffsetZ.value =
          this.parameters.grassOffsetZ;
      });
    this.debugFolder
      .add(this.parameters, "colorOffset")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uColorOffset.value = this.parameters.colorOffset;
      });
    this.debugFolder
      .addColor(this.parameters, "bladesTopColor1")
      .onChange(() => {
        this.material.uniforms.ubladesTopColor1.value.set(
          this.parameters.bladesTopColor1
        );
      });
    this.debugFolder
      .addColor(this.parameters, "bladesTopColor2")
      .onChange(() => {
        this.material.uniforms.ubladesTopColor2.value.set(
          this.parameters.bladesTopColor2
        );
      });
    this.debugFolder
      .addColor(this.parameters, "bladesBottomColor")
      .onChange(() => {
        this.material.uniforms.ubladesBottomColor.value.set(
          this.parameters.bladesBottomColor
        );
      });
    this.debugFolder
      .add(this.parameters, "perlinSize")
      .min(0)
      .max(1)
      .step(0.0001)
      .onChange(() => {
        this.material.uniforms.uPerlinSize.value = this.parameters.perlinSize;
      });
    this.debugFolder
      .add(this.parameters, "perlinFrequency")
      .min(0)
      .max(0.001)
      .step(0.00001)
      .onChange(() => {
        this.material.uniforms.uPerlinFrequency.value =
          this.parameters.perlinFrequency;
      });
  }

  setGrass() {
    this.heightMap = this.experience.ressources.item.heightMap;
    this.heightMap.flipY = false;

    this.grassMap = this.experience.ressources.item.grassMap;
    this.grassMap.flipY = false;

    this.perlinNoise = this.experience.ressources.item.perlinNoise;
    this.perlinNoise.wrapS = THREE.RepeatWrapping;
    this.perlinNoise.wrapT = THREE.RepeatWrapping;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(250, 250),
      new THREE.MeshBasicMaterial({ map: this.grassMap })
    );
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);

    if (this.geometry != null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }

    const positions = new Float32Array(this.parameters.blades * 3 * 3);

    for (let i = 0; i < this.parameters.blades; i++) {
      const positionX = (Math.random() - 0.5) * this.parameters.chunkSize;

      const positionZ = (Math.random() - 0.5) * this.parameters.chunkSize;

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
        uTime: { value: 0 },
        uOffset: { value: this.parameters.offset },
        uLength: { value: this.parameters.length },
        uHeightMap: { value: this.heightMap },
        uGrassMap: { value: this.grassMap },
        uPerlinSize: { value: this.parameters.perlinSize },
        uPerlinFrequency: { value: this.parameters.perlinFrequency },
        ubladesTopColor1: {
          value: new THREE.Color(this.parameters.bladesTopColor1),
        },
        ubladesTopColor2: {
          value: new THREE.Color(this.parameters.bladesTopColor2),
        },
        ubladesBottomColor: {
          value: new THREE.Color(this.parameters.bladesBottomColor),
        },
        uColorOffset: {
          value: this.parameters.colorOffset,
        },
        uHeightMapStrenght: {
          value: this.parameters.heightMapStrenght,
        },
        uGridSize: {
          value: this.parameters.gridSize,
        },
        uChunkSize: {
          value: this.parameters.chunkSize,
        },
        uGrassOffsetX: {
          value: this.parameters.grassOffsetX,
        },
        uGrassOffsetZ: {
          value: this.parameters.grassOffsetZ,
        },
        uPerlinNoise: new THREE.Uniform(this.perlinNoise),
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
