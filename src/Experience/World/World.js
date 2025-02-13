import * as THREE from "three";
import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Mountain from "./Mountain.js";
import Overlay from "./Overlay.js";
import Cubes from "./Cubes.js";
import Grass from "./Grass.js";
import Smoke from "./Smoke.js";
import Water from "./Water.js";
import Snow from "./Snow.js";
import Text from "./Text.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;

    //overlay
    this.overlay = new Overlay();
    this.ressources.on("ready", () => {
      //setup
      this.mountain = new Mountain();
      this.cubes = new Cubes();
      this.grass = new Grass();
      this.smoke = new Smoke();
      this.water = new Water();
      this.snow = new Snow();
      this.text = new Text();
      this.environment = new Environment();
    });
  }
}
