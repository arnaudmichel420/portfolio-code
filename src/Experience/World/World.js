import * as THREE from "three";
import Experience from "../Experience.js";
import Models from "./Models.js";
import Overlay from "./Overlay.js";
import Grass from "./Grass.js";
import Smoke from "./Smoke.js";
import Water from "./Water.js";
import Snow from "./Snow.js";
import Text from "./Text.js";
import Fireflies from "./Fireflies.js";
import NightSky from "./NightSky.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;

    this.objectToTestUUID = [];
    this.objectToTest = [];

    //overlay
    this.overlay = new Overlay();
    this.ressources.on("ready", () => {
      //setup
      this.models = new Models();
      this.nightSky = new NightSky();
      this.grass = new Grass();
      this.water = new Water();
      this.fireflies = new Fireflies();
      this.smoke = new Smoke();
      this.snow = new Snow();
      this.text = new Text();
    });
  }
}
