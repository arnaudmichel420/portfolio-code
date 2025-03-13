import * as THREE from "three";
import Experience from "../../Experience.js";

export default class Light {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.debug = this.experience.debug;

    this.parameters = {};
    this.parameters.color = "#ffd952";

    //debug
    if (this.debug.active) {
      this.debugModels = this.experience.world.models.debugFolder;

      this.debugFolder = this.debugModels.addFolder("💡 Light");
      this.debugFolder.close();

      this.debugFolder.addColor(this.parameters, "color").onChange(() => {
        this.material.color.set(this.parameters.color);
      });
    }

    //setup
    this.ressource = this.ressources.item.lightModel;
    this.setModel();
  }
  setModel() {
    this.model = this.ressource.scene;
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.parameters.color).multiplyScalar(120),
    });

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
