import * as THREE from "three";
import Experience from "../Experience.js";

export default class Mountain {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.debug = this.experience.debug;

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("mountain");
    }

    //setup
    this.ressource = this.ressources.item.mountainModel;
    this.texture = this.ressources.item.mountainTexture;
    // this.ressource = this.ressources.item.grassSlopes;
    this.texture.flipY = false;
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.setModel();
  }
  setModel() {
    this.model = this.ressource.scene;
    this.scene.add(this.model);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    console.log();

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.material;
      }
    });

    this.model.position.set(75, 2.3, 126);
    // this.model.children[0].rotation.y = -Math.PI;
    if (this.debug.active) {
      this.debugFolder.add(this.model.position, "x", -500, 500, 0.1);
      this.debugFolder.add(this.model.position, "y", -500, 500, 0.1);
      this.debugFolder.add(this.model.position, "z", -500, 500, 0.1);
    }
  }
}
