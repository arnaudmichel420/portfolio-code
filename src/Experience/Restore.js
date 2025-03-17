import gsap from "gsap";
import Experience from "./Experience.js";

export default class Restore {
  constructor() {
    this.experience = new Experience();
    this.data = JSON.parse(sessionStorage.getItem("scroll"));
    this.restore();
  }
  restore() {
    this.experience.animateCamera.scrollY = this.data.scrollY;
    this.experience.animateCamera.currentSection = this.data.currentSection;
    this.experience.animateCamera.previousSection =
      this.data.currentSection - 1;

    this.experience.animateCamera.animateScroll();
    //move overlay with camera
    gsap.to(this.experience.world.overlay.mesh.position, {
      duration: this.experience.animateCamera.parameters.transitionDuration,
      ease: "power4.out",
      onUpdate: () => {
        this.experience.world.overlay.mesh.position.set(
          this.experience.camera.instance.position.x,
          this.experience.camera.instance.position.y,
          this.experience.camera.instance.position.z
        );
      },
    });

    this.experience.world.overlay.removeLoading();
    this.experience.world.overlay.loadingBar.click();

    //hide UI
    const scrollUi = document.querySelector(".scrollUi");
    this.experience.world.overlay.scrollUiActive = false;
    this.experience.world.overlay.scrollUiOut(scrollUi);
  }
}
