import gsap from "gsap";
import Experience from "../Experience.js";
import EventEmitter from "./EventEmitter.js";
import * as THREE from "three";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    //setup
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.deltaScroll = 0;
    this.delta = 0;
    this.dampingFactor = { x: 0.001 };
    this.mobileScrollSensitivity = { x: 0.5 };
    this.target = 0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Mouse Event");
      this.debugFolder.close();
    }
    this.setDebug();

    this.setMouseMove();
    this.setMouseScroll();
    this.setMouseClick();
  }
  setDebug() {
    //debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.dampingFactor, "x", 0.0001, 0.005, 0.0001)
        .name("dampingFactor");
      this.debugFolder
        .add(this.mobileScrollSensitivity, "x", 0.0001, 1, 0.0001)
        .name("mobileScrollSensitivity");
    }
  }
  setMouseMove() {
    this.mouseXY = new THREE.Vector2();

    window.addEventListener("mousemove", (event) => {
      this.mouseXY.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouseXY.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.trigger("mouseMove");
    });
  }
  setMouseClick() {
    window.addEventListener("click", () => {
      this.trigger("mouseClick");
    });
  }
  setMouseScroll() {
    //desktop
    window.addEventListener("wheel", (event) => {
      this.delta = event.deltaY;
      this.scrollEasing(this.delta);
    });

    //mobile
    this.startY = 0;
    document.addEventListener("touchstart", (event) => {
      this.startY = event.touches[0].pageY;
    });

    document.addEventListener("touchmove", (event) => {
      this.currentY = event.touches[0].pageY;
      this.deltaYMobile = this.startY - this.currentY;
      this.delta = this.deltaYMobile * this.mobileScrollSensitivity.x;
    });
  }
  scrollEasing() {
    if (!this.experience.world.overlay.active) {
      this.deltaTime = this.experience.time.delta;
      this.deltaScroll += this.delta;
      this.delta = 0;
      this.deltaScroll +=
        (this.target - this.deltaScroll) *
        (1 -
          (1 - this.deltaTime * this.dampingFactor.x) *
            (1 - this.deltaTime * this.dampingFactor.x));
      if (this.deltaScroll > -0.5 && this.deltaScroll < 0.5) {
        this.deltaScroll = 0;
      } else {
        this.trigger("mouseScroll");
      }
    }
  }
}
