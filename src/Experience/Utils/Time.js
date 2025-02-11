import Experience from "../Experience.js";
import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    //setup
    this.experience = new Experience();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    });

    //debug
    if (this.experience.debug.active) {
      this.stats = this.experience.debug.stats;
    }
  }
  tick() {
    if (this.stats) {
      this.stats.begin();
    }

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
    if (this.stats) {
      this.stats.end();
    }
  }
}
