import gsap from "gsap";
import Experience from "./Experience";

export default class AnimateCamera {
  constructor() {
    this.experience = new Experience();

    this.cameraGroup = this.experience.camera.cameraGroup;
    this.camera = this.experience.camera.instance;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.cameraLookAt = this.experience.camera.cameraLookAt;

    this.transitionDuration = { x: 1.5 };
    this.scrollSensivity = { x: 0.1 };
    this.parallaxSmoothing = { x: 0.1 };
    this.parallaxAmplitude = { x: 2 };
    this.cameraPositions = [
      { x: 7.5, y: 6, z: 14, a: 7.5, b: 6, c: -20 },
      { x: -50, y: 21, z: 6, a: -54, b: 21, c: 0 },
      { x: -137, y: 59, z: -18, a: -158, b: 64, c: -38 },
      { x: -237, y: 214, z: -117, a: -240, b: 222, c: -71 },
      { x: -262, y: 311, z: 163, a: -274, b: 324, c: -80 },
    ];
    this.previousSection = 0;
    this.currentSection = 0;
    this.listen = true;
    this.scrollY = 0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Camera Animation");
      this.debugFolder.close();
    }
    this.setDebug();
    this.animateScroll();
  }
  setDebug() {
    //debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.transitionDuration, "x", 0, 5, 0.1)
        .name("transitionDuration");
      this.debugFolder
        .add(this.scrollSensivity, "x", 0, 0.5, 0.001)
        .name("scrollSensivity");
      this.debugFolder
        .add(this.parallaxAmplitude, "x", 0, 5, 0.1)
        .name("parallaxAmplitude");
      this.debugFolder
        .add(this.parallaxSmoothing, "x", 0, 0.2, 0.001)
        .name("parallaxSmoothing");
    }
  }
  animateScroll() {
    if (this.listen) {
      this.deltaScroll = this.experience.mouse.deltaScroll;
      this.deltaScroll *= this.scrollSensivity.x;

      if (this.deltaScroll <= 1 && this.deltaScroll >= -1) {
        this.deltaScroll = 0;
      } else if (
        (this.camera.position.x <
          this.cameraPositions[this.cameraPositions.length - 1].x &&
          this.deltaScroll < 0) ||
        (this.camera.position.x > this.cameraPositions[0].x &&
          this.deltaScroll > 0)
      ) {
        //check if we are at start or end
        this.deltaScroll = 0;
      }

      this.scrollY += this.deltaScroll * 0.01;

      //calculate trajectory
      if (
        this.currentSection == this.cameraPositions.length - 1 ||
        (this.currentSection == this.previousSection &&
          this.deltaScroll > 0 &&
          this.currentSection > 0)
      ) {
        //going down
        this.deltaX =
          this.cameraPositions[this.currentSection].x -
          this.cameraPositions[this.currentSection - 1].x;
        this.deltaY =
          this.cameraPositions[this.currentSection].y -
          this.cameraPositions[this.currentSection - 1].y;
        this.deltaZ =
          this.cameraPositions[this.currentSection].z -
          this.cameraPositions[this.currentSection - 1].z;
        this.deltaA =
          this.cameraPositions[this.currentSection].a -
          this.cameraPositions[this.currentSection - 1].a;
        this.deltaB =
          this.cameraPositions[this.currentSection].b -
          this.cameraPositions[this.currentSection - 1].b;
        this.deltaC =
          this.cameraPositions[this.currentSection].c -
          this.cameraPositions[this.currentSection - 1].c;
      } else {
        //going up
        this.deltaX =
          this.cameraPositions[this.currentSection + 1].x -
          this.cameraPositions[this.currentSection].x;
        this.deltaY =
          this.cameraPositions[this.currentSection + 1].y -
          this.cameraPositions[this.currentSection].y;
        this.deltaZ =
          this.cameraPositions[this.currentSection + 1].z -
          this.cameraPositions[this.currentSection].z;
        this.deltaA =
          this.cameraPositions[this.currentSection + 1].a -
          this.cameraPositions[this.currentSection].a;
        this.deltaB =
          this.cameraPositions[this.currentSection + 1].b -
          this.cameraPositions[this.currentSection].b;
        this.deltaC =
          this.cameraPositions[this.currentSection + 1].c -
          this.cameraPositions[this.currentSection].c;
      }

      //animate

      this.camera.position.set(
        this.camera.position.x - this.deltaScroll * 0.0001 * this.deltaX,
        this.camera.position.y - this.deltaScroll * 0.0001 * this.deltaY,
        this.camera.position.z - this.deltaScroll * 0.0001 * this.deltaZ
      );

      this.camera.lookAt(
        this.cameraLookAt.x - this.deltaScroll * 0.0001 * this.deltaA,
        this.cameraLookAt.y - this.deltaScroll * 0.0001 * this.deltaB,
        this.cameraLookAt.z - this.deltaScroll * 0.0001 * this.deltaC
      );

      //update lookat values
      this.cameraLookAt.x -= this.deltaScroll * 0.0001 * this.deltaA;
      this.cameraLookAt.y -= this.deltaScroll * 0.0001 * this.deltaB;
      this.cameraLookAt.z -= this.deltaScroll * 0.0001 * this.deltaC;

      //handle section ++
      if (
        this.scrollY < -this.currentSection * 50 - 50 &&
        this.currentSection < this.cameraPositions.length - 1
      ) {
        this.listen = false;
        this.currentSection++;

        setTimeout(() => {
          this.listen = true;
        }, this.transitionDuration.x * 1000);
      } else if (
        this.scrollY > -(this.currentSection - 1) * 50 - 30 &&
        this.currentSection == this.previousSection &&
        this.currentSection > 0
      ) {
        this.listen = false;
        this.currentSection--;

        setTimeout(() => {
          this.listen = true;
        }, this.transitionDuration.x * 1000);
      }

      //launch animation
      if (this.currentSection !== this.previousSection) {
        this.previousSection = this.currentSection;
        gsap.to(this.camera.position, {
          duration: this.transitionDuration.x,
          ease: "power4.out",
          x: this.cameraPositions[this.currentSection].x,
          y: this.cameraPositions[this.currentSection].y,
          z: this.cameraPositions[this.currentSection].z,
        });
        gsap.to(this.cameraLookAt, {
          duration: this.transitionDuration.x,
          ease: "power4.out",
          x: this.cameraPositions[this.currentSection].a,
          y: this.cameraPositions[this.currentSection].b,
          z: this.cameraPositions[this.currentSection].c,
          onUpdate: () => {
            this.camera.lookAt(
              this.cameraLookAt.x,
              this.cameraLookAt.y,
              this.cameraLookAt.z
            );
          },
        });
      }
    }
  }
  parallax() {
    // this.mouseXY = this.experience.mouse.mouseXY;
    // this.deltaTime = this.experience.time.delta;
    // this.cameraGroup.position.x +=
    //   (this.mouseXY.x * this.parallaxAmplitude.x -
    //     this.cameraGroup.position.x) *
    //   this.parallaxSmoothing.x;
    // this.deltaTime;
    // this.cameraGroup.position.y +=
    //   (this.mouseXY.y * this.parallaxAmplitude.x -
    //     this.cameraGroup.position.y) *
    //   this.parallaxSmoothing.x;
    // this.deltaTime;
  }
}
