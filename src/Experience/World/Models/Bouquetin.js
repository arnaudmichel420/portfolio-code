import * as THREE from "three";
import Experience from "../../Experience.js";

export default class Bouquetin {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.hightlight = this.experience.world.models.hightlight;

    //debug
    if (this.debug.active) {
      this.debugModels = this.experience.world.models.debugFolder;

      this.debugFolder = this.debugModels.addFolder("🐐 Bouquetin");
      this.debugFolder.close();
    }

    //setup
    this.ressource = this.ressources.item.bouquetinModel;
    this.texture = this.ressources.item.bouquetinTexture;
    this.texture.flipY = false;
    this.texture.colorSpace = THREE.SRGBColorSpace;
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
    this.hightlight.push(this.ressource.scene.children[0].children[0]);
    this.experience.renderer.outlineEffect.selection.set(this.hightlight);
    if (this.debug.active) {
      this.debugFolder.add(this.model.position, "x", -500, 500, 0.1);
      this.debugFolder.add(this.model.position, "y", -500, 500, 0.1);
      this.debugFolder.add(this.model.position, "z", -500, 500, 0.1);
    }

    this.mixer = new THREE.AnimationMixer(this.ressource.scene);
    this.mixer.timeScale = 0.0005;
    this.animation = this.mixer.clipAction(this.ressource.animations[0]);
    this.animation.play();
  }
  elapsedTime() {
    if (this.mixer != null) {
      this.mixer.update(this.time.delta);
    }
  }
}
