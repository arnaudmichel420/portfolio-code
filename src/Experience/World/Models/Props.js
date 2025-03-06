import * as THREE from "three";
import Experience from "../../Experience.js";

export default class Props {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.debug = this.experience.debug;
    this.hightlight = this.experience.world.models.hightlight;
    this.objectToTestUUID = this.experience.world.objectToTestUUID;
    this.objectToTest = this.experience.world.objectToTest;

    //debug
    if (this.debug.active) {
      this.debugModels = this.experience.world.models.debugFolder;

      this.debugFolder = this.debugModels.addFolder("🛠️ Props");
      this.debugFolder.close();
    }

    //setup
    this.ressource = this.ressources.item.propsModel;
    this.ressourceHightlight = this.ressources.item.panelModel;
    this.texture = this.ressources.item.propsTexture;
    this.texture.flipY = false;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.setModel();
    this.setHighlightModel();
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
  setHighlightModel() {
    this.highlightModel = this.ressourceHightlight.scene;

    this.highlightModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.material;
      }
    });
    this.highlightModel.position.set(75, 2.3, 126);

    this.scene.add(this.highlightModel);

    this.hightlight.push(this.highlightModel.children[0]);
    this.experience.renderer.outlineEffect.selection.set(this.hightlight);

    this.setRaycaster();
  }
  setRaycaster() {
    this.objectToTest.push(this.highlightModel);
    this.objectToTestUUID.push({
      uuid: this.highlightModel.children[0].uuid,
      name: "panel",
    });
  }
}
