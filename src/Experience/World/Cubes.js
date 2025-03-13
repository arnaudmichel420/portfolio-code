import * as THREE from "three";
import Experience from "../Experience.js";

export default class Cubes {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("cube");
      this.debugFolder.close();
    }

    this.setCube();
  }
  setCube() {
    this.cubePositions = [
      { x: 0, y: 0, z: 0 },
      { x: -58, y: 11, z: -8 },
      { x: -96, y: 25, z: 5 },
      { x: -140, y: 53, z: -7 },
      { x: -165, y: 117, z: -6 },
      { x: -224, y: 190, z: 0 },
    ];
    this.material = new THREE.MeshBasicMaterial({ color: "red" });
    this.geometry = new THREE.BoxGeometry(2, 2, 2);

    this.cubeArray = [];
    this.cubeArrayUUID = [];

    for (let i = 0; i < this.cubePositions.length; i++) {
      this.cube = new THREE.Mesh(this.geometry, this.material);
      this.cube.position.set(
        this.cubePositions[i].x,
        this.cubePositions[i].y,
        this.cubePositions[i].z
      );
      this.cubeArray.push(this.cube);
      this.cubeArrayUUID.push(this.cube.uuid);
      this.scene.add(this.cube);

      if (this.debug.active) {
        this.debugFolder.add(this.cube.position, "x", -500, 500, 1);
        this.debugFolder.add(this.cube.position, "y", -500, 500, 1);
        this.debugFolder.add(this.cube.position, "z", -500, 500, 1);
      }
    }
    // this.experience.renderer.outlineEffect.selection.set(this.cubeArray);
  }
}
