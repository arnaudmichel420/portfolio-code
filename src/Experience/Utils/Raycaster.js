import Experience from "../Experience.js";
import EventEmitter from "./EventEmitter.js";
import * as THREE from "three";

export default class Raycaster extends EventEmitter {
  constructor() {
    super();
    //setup
    this.experience = new Experience();
    this.ressources = this.experience.ressources;
    this.camera = this.experience.camera.instance;
    this.mouse = this.experience.mouse;
    this.world = this.experience.world;
    this.raycaster = new THREE.Raycaster();
    this.currentIntersect = null;

    //object
    this.objectToTest = [];
    this.objectToTestUUID = [];
    //mettre un event trigger de world est fini
    this.ressources.on("ready", () => {
      this.objectToTest = this.world.cubes.cubeArray;
      this.objectToTestUUID = this.world.cubes.cubeArrayUUID;
    });
  }
  setRaycaster() {
    this.raycaster.setFromCamera(this.mouse.mouseXY, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.objectToTest);

    if (this.intersects.length) {
      if (!this.currentIntersect) {
        this.currentIntersect = this.intersects[0];
        this.trigger("mouseEnter");
      }
    } else {
      if (this.currentIntersect) {
        this.trigger("mouseLeave");
      }
      this.currentIntersect = null;
    }
  }
  raycasterClick() {
    if (this.currentIntersect) {
      console.log("click on object id: " + this.currentIntersect.object.uuid);

      for (let i = 0; i < this.objectToTestUUID.length; i++) {
        if (this.currentIntersect.object.uuid === this.objectToTestUUID[i]) {
          //save camera position
          this.savedCamera = {};
          console.log(this.experience.scene);

          this.experience.scene.traverse((child) => {
            if (child.type == "PerspectiveCamera") {
              this.savedCamera.x = child.position.x;
              this.savedCamera.y = child.position.y;
              this.savedCamera.z = child.position.z;
            }
          });
          this.savedCameraConverted = JSON.stringify(this.savedCamera);
          localStorage.setItem("savedCamera", this.savedCameraConverted);

          //scroll
          this.savedScroll = {};
          this.savedScroll.scrollY = this.experience.mouse.scrollY;
          this.savedScroll.currentSection =
            this.experience.mouse.currentSection;
          this.savedScrollConverted = JSON.stringify(this.savedScroll);
          localStorage.setItem("scroll", this.savedScrollConverted);

          //   //go to page project
          window.location.assign(`./projects/project-${i + 1}.html`);
        }
      }
    }
  }
}
