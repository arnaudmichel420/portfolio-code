import * as THREE from "three";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Ressources from "./Utils/Ressources.js";
import sources from "./sources.js";
import Debug from "./Utils/Debug.js";
import Mouse from "./Utils/Mouse.js";
import Raycaster from "./Utils/Raycaster.js";
import Phone from "./Utils/Phone.js";
import AnimateCamera from "./AnimateCamera.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    //Globall access
    window.experience = this;

    //Options
    this.canvas = canvas;
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.phone = new Phone();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.ressources = new Ressources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.mouse = new Mouse();
    this.raycaster = new Raycaster();

    this.ressources.on("ready", () => {
      this.animateCamera = new AnimateCamera();
    });

    this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
    this.scene.add(this.overlay);
    //restore old position
    if (localStorage.getItem("savedCamera") && localStorage.getItem("scroll")) {
      console.log(localStorage);

      this.cameraDeconverted = JSON.parse(localStorage.getItem("savedCamera"));
      this.camera.instance.position.set(
        this.cameraDeconverted.x,
        this.cameraDeconverted.y,
        this.cameraDeconverted.z
      );

      this.scrollDeconverted = JSON.parse(localStorage.getItem("scroll"));
      this.mouse.scrollY = this.scrollDeconverted.scrollY;
      this.mouse.currentSection = this.scrollDeconverted.currentSection;
    }

    //Event listener
    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", () => {
      this.update();
      this.parallax();
      this.scrollEasing();
      this.elapsedTime();
    });
    this.mouse.on("mouseScroll", () => {
      this.animateScroll();
    });
    this.mouse.on("mouseMove", () => {
      this.setRaycaster();
    });
    this.mouse.on("mouseClick", () => {
      // this.raycasterClick();
    });
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    this.renderer.update();
  }
  animateScroll() {
    this.animateCamera.animateScroll();
  }
  setRaycaster() {
    this.raycaster.setRaycaster();
  }
  raycasterClick() {
    this.raycaster.raycasterClick();
  }
  parallax() {
    this.ressources.on("ready", () => {
      this.animateCamera.parallax();
    });
  }
  scrollEasing() {
    this.mouse.scrollEasing();
  }
  elapsedTime() {
    if (this.world.grass != null) {
      this.world.grass.elapsedTime();
    }
    if (this.world.smoke != null) {
      this.world.smoke.elapsedTime();
    }
    if (this.world.water != null) {
      this.world.water.elapsedTime();
    }
    if (this.world.snow != null) {
      this.world.snow.elapsedTime();
    }
    if (this.world.fireflies != null) {
      this.world.fireflies.elapsedTime();
    }
  }
}
