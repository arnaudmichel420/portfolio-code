import * as THREE from "three";

import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();

    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.phone = this.experience.phone;
    this.orbitActive = { x: false };

    this.FOV = 35;
    this.cameraLookAt = { x: -235, y: -28, z: -300 };

    //Phone
    if (this.phone.active) {
      this.FOV = 45;
    }
    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🎥 Camera");
      // this.debugFolder.close();
    }

    this.setInstance();
    this.setDebug();

    if (this.debug.active) {
      this.setOrbitControl();
    }
  }
  setInstance() {
    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup);

    this.instance = new THREE.PerspectiveCamera(
      this.FOV,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.instance.position.set(97, 7, 127);
    this.instance.lookAt(
      this.cameraLookAt.x,
      this.cameraLookAt.y,
      this.cameraLookAt.z
    );
    this.cameraGroup.add(this.instance);
  }
  setDebug() {
    //debug
    if (this.debug.active) {
      this.debugFolder.add(this.instance.position, "x", -300, 300, 0.1);
      this.debugFolder.add(this.instance.position, "y", -300, 500, 0.1);
      this.debugFolder.add(this.instance.position, "z", -300, 300, 0.1);
      this.debugFolder
        .add(this.cameraLookAt, "x", -300, 300, 0.1)
        .onChange(() => {
          this.instance.lookAt(
            this.cameraLookAt.x,
            this.cameraLookAt.y,
            this.cameraLookAt.z
          );
        });
      this.debugFolder
        .add(this.cameraLookAt, "y", -300, 500, 0.1)
        .onChange(() => {
          this.instance.lookAt(
            this.cameraLookAt.x,
            this.cameraLookAt.y,
            this.cameraLookAt.z
          );
        });
      this.debugFolder
        .add(this.cameraLookAt, "z", -300, 300, 0.1)
        .onChange(() => {
          this.instance.lookAt(
            this.cameraLookAt.x,
            this.cameraLookAt.y,
            this.cameraLookAt.z
          );
        });
      this.debugFolder
        .add(this.orbitActive, "x")
        .name("OrbitControl")
        .onChange(() => {
          this.setOrbitControl();
        });
    }
  }
  setOrbitControl() {
    if (this.orbitActive.x) {
      const controls = new OrbitControls(this.instance, this.canvas);
      controls.enableDamping = true;
    }
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
