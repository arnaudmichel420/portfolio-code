import * as THREE from "three";
import Experience from "./Experience.js";

export default class Restore {
  constructor() {
    this.experience = new Experience();
    this.data = JSON.parse(sessionStorage.getItem("scroll"));
    console.log(this.data);

    this.restore();
  }
  restore() {
    this.experience.animateCamera.scrollY = this.data.scrollY;
    this.experience.animateCamera.currentSection = this.data.currentSection;
    this.experience.animateCamera.previousSection =
      this.data.currentSection - 1;

    const transitionDuration =
      this.experience.animateCamera.parameters.transitionDuration;
    this.experience.animateCamera.parameters.transitionDuration = 0;
    this.experience.animateCamera.animateScroll();
    this.experience.world.overlay.mesh.position.set(
      this.experience.camera.instance.position.x,
      this.experience.camera.instance.position.y,
      this.experience.camera.instance.position.z
    );

    //put back the default value
    setTimeout(() => {
      this.experience.animateCamera.parameters.transitionDuration =
        transitionDuration;
    }, 500);

    //message scene en restoration
    this.experience.world.overlay.removeLoading();
    this.experience.world.overlay.loadingBar.click();

    //hide UI
    const scrollUi = document.querySelector(".scrollUi");
    this.experience.world.overlay.scrollUiActive = false;
    this.experience.world.overlay.scrollUiOut(scrollUi);
  }
}
