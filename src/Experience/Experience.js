import * as THREE from "three";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Ressources from "./Utils/Ressources.js";
import sources from "./sources.js";
import sourcesPhone from "./sourcesPhone.js";
import Debug from "./Utils/Debug.js";
import Mouse from "./Utils/Mouse.js";
import Raycaster from "./Utils/Raycaster.js";
import Phone from "./Utils/Phone.js";
import AnimateCamera from "./AnimateCamera.js";
import Restore from "./Restore.js";

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
    this.camera = new Camera();
    this.renderer = new Renderer();
    if (this.phone.active) {
      this.ressources = new Ressources(sourcesPhone);
    } else {
      this.ressources = new Ressources(sources);
    }

    this.world = new World();
    this.mouse = new Mouse();
    this.raycaster = new Raycaster();

    this.ressources.on("ready", () => {
      this.animateCamera = new AnimateCamera();
      //restore old position
      if (sessionStorage.getItem("scroll")) {
        this.restore = new Restore();
      }
    });

    //Event listener
    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", () => {
      this.update();
      if (!this.phone?.active) {
        this.parallax();
      }
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
      this.raycasterClick();
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
    if (this.world.overlay.active == false) {
      this.animateCamera.parallax();
    }
  }
  scrollEasing() {
    this.mouse.scrollEasing();
  }
  elapsedTime() {
    ["grass", "smoke", "water", "snow", "fireflies"].forEach((key) => {
      this.world[key]?.elapsedTime();
    });
    if (this.world.models) {
      ["bouquetin", "alien", "fox"].forEach((key) => {
        this.world.models[key]?.elapsedTime();
      });
    }
  }
}
