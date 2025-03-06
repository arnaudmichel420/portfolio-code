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

    this.objectToTestUUID = this.experience.world.objectToTestUUID;
    this.objectToTest = this.experience.world.objectToTest;

    this.pages = [
      { name: "panel", url: "./projects/massage-sportif-annecy.html" },
      { name: "fox", url: "./projects/gamejam.html" },
      { name: "bouquetin", url: "./projects/project-3.html" },
      { name: "alien", url: "./projects/project-4.html" },
    ];
  }
  setRaycaster() {
    this.raycaster.setFromCamera(this.mouse.mouseXY, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.objectToTest);

    if (this.intersects.length) {
      if (!this.currentIntersect) {
        this.currentIntersect = this.intersects[0];
      }
    } else {
      this.currentIntersect = null;
    }
  }
  raycasterClick() {
    console.log(this.currentIntersect);

    if (this.currentIntersect) {
      const result = this.objectToTestUUID.find(
        (item) => item.uuid == this.currentIntersect.object.uuid
      );
      const page = this.pages.find((item) => item.name == result.name);
      //scroll
      const savedScroll = {};
      savedScroll.scrollY = this.experience.animateCamera.scrollY;
      savedScroll.currentSection = this.experience.animateCamera.currentSection;
      sessionStorage.setItem("scroll", JSON.stringify(savedScroll));
      // go to page project
      window.location.assign(page.url);
    }
  }
}
