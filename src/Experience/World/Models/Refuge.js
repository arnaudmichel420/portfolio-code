import * as THREE from "three";
import Experience from "../../Experience.js";

export default class Refuge {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.debug = this.experience.debug;

    //debug
    if (this.debug.active) {
      this.debugModels = this.experience.world.models.debugFolder;

      this.debugFolder = this.debugModels.addFolder("🏡 Refuge");
      this.debugFolder.close();
    }

    //setup
    this.ressource = this.ressources.item.refugeModel;
    // this.texture = this.ressources.item.refugeTexture;
    // this.texture.flipY = false;
    // this.texture.colorSpace = THREE.SRGBColorSpace;
    this.setModel();
  }
  setModel() {
    this.model = this.ressource.scene;
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.material;
      }
    });

    this.model.position.set(75, 2.3, 126);

    this.scene.add(this.model);
    if (this.debug.active) {
      this.debugFolder.add(this.model.position, "x", -500, 500, 0.1);
      this.debugFolder.add(this.model.position, "y", -500, 500, 0.1);
      this.debugFolder.add(this.model.position, "z", -500, 500, 0.1);
    }
  }
}
