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
    this.parameters.blades = 500000;
    this.parameters.offset = 0.2;
    this.parameters.lenght = 1;
    this.parameters.chunkSize = 50;
    this.parameters.gridSize = 250;
    this.parameters.heightMapStrenght = 73;
    this.parameters.bladesTopColor = "#5cc62f";
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
      .onFinishChange(this.setGrass.bind(this));
    this.debugFolder
      .add(this.parameters, "lenght")
      .min(0)
      .max(3)
      .step(0.001)
      .onFinishChange(this.setGrass.bind(this));
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
      .step(1)
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
      .add(this.parameters, "colorOffset")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uColorOffset.value = this.parameters.colorOffset;
      });
    this.debugFolder
      .addColor(this.parameters, "bladesTopColor")
      .onChange(() => {
        this.material.uniforms.ubladesTopColor.value.set(
          this.parameters.bladesTopColor
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
    this.heightMap.wrapS = THREE.RepeatWrapping;
    this.heightMap.wrapT = THREE.RepeatWrapping;
    this.heightMap.flipY = false;

    this.grassMap = this.experience.ressources.item.grassMap;
    this.grassMap.wrapS = THREE.RepeatWrapping;
    this.grassMap.wrapT = THREE.RepeatWrapping;
    this.grassMap.flipY = false;

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
    const centers = new Float32Array(this.parameters.blades * 3 * 2);
    const uvs = new Float32Array(this.parameters.blades * 3 * 2);

    const coordFix = [
      { x: this.parameters.gridSize / 2, y: -this.parameters.gridSize / 2 },
      { x: this.parameters.gridSize / 2, y: this.parameters.gridSize / 2 },
      { x: -this.parameters.gridSize / 2, y: this.parameters.gridSize / 2 },
      { x: -this.parameters.gridSize / 2, y: -this.parameters.gridSize / 2 },
    ];

    for (let y = 0; y < 4; y++) {
      const i9 = y * 9;
      //1
      positions[i9 + 0] = coordFix[y].x;
      positions[i9 + 1] = 0;
      positions[i9 + 2] = coordFix[y].y;
      //2
      positions[i9 + 3] = coordFix[y].x;
      positions[i9 + 4] = 0;
      positions[i9 + 5] = coordFix[y].y;
      //3
      positions[i9 + 6] = coordFix[y].x;
      positions[i9 + 7] = 0;
      positions[i9 + 8] = coordFix[y].y;

      const i6 = y * 6;
      centers[i6 + 0] = coordFix[y].x;
      centers[i6 + 1] = coordFix[y].y;
      centers[i6 + 2] = coordFix[y].x;
      centers[i6 + 3] = coordFix[y].y;
      centers[i6 + 4] = coordFix[y].x;
      centers[i6 + 5] = coordFix[y].y;

      uvs[i6 + 0] =
        (coordFix[y].x + this.parameters.gridSize / 2) /
        this.parameters.gridSize;
      uvs[i6 + 1] =
        (coordFix[y].y + this.parameters.gridSize / 2) /
        this.parameters.gridSize;
      uvs[i6 + 2] = uvs[i6 + 0];
      uvs[i6 + 3] = uvs[i6 + 1];
      uvs[i6 + 4] = uvs[i6 + 0];
      uvs[i6 + 5] = uvs[i6 + 1];
    }

    for (let i = 0; i < this.parameters.blades; i++) {
      const positionX = (Math.random() - 0.5) * this.parameters.gridSize;

      const positionZ = (Math.random() - 0.5) * this.parameters.gridSize;

      const positionY = 0;

      const i9 = i * 9;
      positions[i9 + 0] = positionX;
      positions[i9 + 1] = positionY;
      positions[i9 + 2] = positionZ;
      positions[i9 + 3] = positionX + this.parameters.offset / 2;
      positions[i9 + 4] = positionY + this.parameters.lenght;
      positions[i9 + 5] = positionZ + this.parameters.offset / 2;
      positions[i9 + 6] = positionX + this.parameters.offset;
      positions[i9 + 7] = positionY;
      positions[i9 + 8] = positionZ + this.parameters.offset;

      const i6 = i * 6;
      centers[i6 + 0] = positionX + this.parameters.offset / 2;
      centers[i6 + 1] = positionZ + this.parameters.offset / 2;
      centers[i6 + 2] = positionX + this.parameters.offset / 2;
      centers[i6 + 3] = positionZ + this.parameters.offset / 2;
      centers[i6 + 4] = positionX + this.parameters.offset / 2;
      centers[i6 + 5] = positionZ + this.parameters.offset / 2;

      uvs[i6 + 0] =
        (positionX + this.parameters.gridSize / 2) / this.parameters.gridSize;
      uvs[i6 + 1] =
        (positionZ + this.parameters.gridSize / 2) / this.parameters.gridSize;
      uvs[i6 + 2] = uvs[i6 + 0];
      uvs[i6 + 3] = uvs[i6 + 1];
      uvs[i6 + 4] = uvs[i6 + 0];
      uvs[i6 + 5] = uvs[i6 + 1];
    }

    this.geometry = new THREE.BufferGeometry();

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute(
      "center",
      new THREE.Float32BufferAttribute(centers, 2)
    );
    this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHeightMap: { value: this.heightMap },
        uGrassMap: { value: this.grassMap },
        uPerlinSize: { value: this.parameters.perlinSize },
        uLenght: { value: this.parameters.lenght },
        uPerlinFrequency: { value: this.parameters.perlinFrequency },
        ubladesTopColor: {
          value: new THREE.Color(this.parameters.bladesTopColor),
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
      },
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);

    const box = new THREE.Box3().setFromObject(this.mesh); // Get bounding box from the mesh
    const helper = new THREE.Box3Helper(box, 0xffff00); // Create box helper with yellow color
    this.scene.add(helper);
  }
  elapsedTime() {
    if (this.material.uniforms.uTime != null) {
      this.material.uniforms.uTime.value = this.time.elapsed;
    }
  }
}
