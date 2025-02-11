import Experience from "../Experience";

export default class Phone {
  constructor() {
    this.experience = new Experience();
    this.width = this.experience.sizes.width;
    this.active = this.width < 768;
  }
}
