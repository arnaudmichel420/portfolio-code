import * as THREE from "three";
import Experience from "../Experience.js";
import Mountain from "./Models/Mountain.js";
import Props from "./Models/Props.js";
import Refuge from "./Models/Refuge.js";
import Trees from "./Models/Trees.js";
import Bouquetin from "./Models/Bouquetin.js";
import Alien from "./Models/Alien.js";
import Fox from "./Models/Fox.js";
import Light from "./Models/Light.js";

export default class Models {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.hightlight = [];

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🍆 Models");
      this.debugFolder.close();

      //wait for folder to create
      setTimeout(() => {
        this.setModels();
      }, 100);
    } else {
      this.setModels();
    }
  }
  setModels() {
    this.mountain = new Mountain();
    this.props = new Props();
    this.refuge = new Refuge();
    this.trees = new Trees();
    this.bouquetin = new Bouquetin();
    this.alien = new Alien();
    this.fox = new Fox();
    this.light = new Light();
  }
}
