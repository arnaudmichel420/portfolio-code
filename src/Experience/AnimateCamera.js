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

    this.snow = this.experience.world.snow.material.uniforms;

    this.transitionDuration = { x: 1.5 };
    this.scrollSensivity = { x: 0.1 };
    this.parallaxSmoothing = { x: 0.1 };
    this.parallaxAmplitude = { x: 2 };
    this.cameraPositions = [
      {
        x: 97,
        y: 7,
        z: 127,
        lookAtX: -98,
        lookAtY: -28,
        lookAtZ: -300,
        snowDensity: 0,
        snowSpeed: 0.005,
        snowSize: 5,
      },
      {
        x: 3.5,
        y: 26.5,
        z: 127,
        lookAtX: -98,
        lookAtY: -28,
        lookAtZ: -300,
        snowDensity: 0,
        snowSpeed: 0.005,
        snowSize: 5,
      },
      {
        x: -68,
        y: 68,
        z: 111,
        lookAtX: -262,
        lookAtY: 68,
        lookAtZ: -300,
        snowDensity: 0,
        snowSpeed: 0.005,
        snowSize: 5,
      },
      {
        x: -137,
        y: 219,
        z: 117,
        lookAtX: -300,
        lookAtY: 183,
        lookAtZ: -300,
        snowDensity: 0.5,
        snowSpeed: 0.005,
        snowSize: 5,
      },
      {
        x: -87,
        y: 376,
        z: 242,
        lookAtX: -300,
        lookAtY: 313,
        lookAtZ: -300,
        snowDensity: 1,
        snowSpeed: 0.009,
        snowSize: 10,
      },
    ];
    this.previousSection = 0;
    this.currentSection = 0;
    this.listen = true;
    this.scrollY = 0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🎬 Camera Animation");
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
        (this.camera.position.y >
          this.cameraPositions[this.cameraPositions.length - 1].y &&
          this.deltaScroll < 0) ||
        (this.camera.position.y < this.cameraPositions[0].y &&
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
        this.deltaX =
          this.cameraPositions[this.currentSection].x -
          this.cameraPositions[this.currentSection - 1].x;
        this.deltaY =
          this.cameraPositions[this.currentSection].y -
          this.cameraPositions[this.currentSection - 1].y;
        this.deltaZ =
          this.cameraPositions[this.currentSection].z -
          this.cameraPositions[this.currentSection - 1].z;
        this.deltaLookAtX =
          this.cameraPositions[this.currentSection].lookAtX -
          this.cameraPositions[this.currentSection - 1].lookAtX;
        this.deltaLookAtY =
          this.cameraPositions[this.currentSection].lookAtY -
          this.cameraPositions[this.currentSection - 1].lookAtY;
        this.deltaLookAtZ =
          this.cameraPositions[this.currentSection].lookAtZ -
          this.cameraPositions[this.currentSection - 1].lookAtZ;
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
        this.deltaLookAtX =
          this.cameraPositions[this.currentSection + 1].lookAtX -
          this.cameraPositions[this.currentSection].lookAtX;
        this.deltaLookAtY =
          this.cameraPositions[this.currentSection + 1].lookAtY -
          this.cameraPositions[this.currentSection].lookAtY;
        this.deltaLookAtZ =
          this.cameraPositions[this.currentSection + 1].lookAtZ -
          this.cameraPositions[this.currentSection].lookAtZ;
        //both way
        this.deltaSnowDensity =
          this.cameraPositions[this.currentSection + 1].snowDensity -
          this.cameraPositions[this.currentSection].snowDensity;
        this.deltaSnowSpeed =
          this.cameraPositions[this.currentSection + 1].snowSpeed -
          this.cameraPositions[this.currentSection].snowSpeed;
        this.deltaSnowSize =
          this.cameraPositions[this.currentSection + 1].snowSize -
          this.cameraPositions[this.currentSection].snowSize;
      }

      //animate

      this.camera.position.set(
        this.camera.position.x - this.deltaScroll * 0.0001 * this.deltaX,
        this.camera.position.y - this.deltaScroll * 0.0001 * this.deltaY,
        this.camera.position.z - this.deltaScroll * 0.0001 * this.deltaZ
      );

      this.camera.lookAt(
        this.cameraLookAt.x - this.deltaScroll * 0.0001 * this.deltaLookAtX,
        this.cameraLookAt.y - this.deltaScroll * 0.0001 * this.deltaLookAtY,
        this.cameraLookAt.z - this.deltaScroll * 0.0001 * this.deltaLookAtZ
      );

      //update lookat values
      this.cameraLookAt.x -= this.deltaScroll * 0.0001 * this.deltaLookAtX;
      this.cameraLookAt.y -= this.deltaScroll * 0.0001 * this.deltaLookAtY;
      this.cameraLookAt.z -= this.deltaScroll * 0.0001 * this.deltaLookAtZ;

      // //snow

      this.snow.uSnowDensity.value -=
        this.deltaScroll * 0.0001 * this.deltaSnowDensity;
      this.snow.uSnowSpeed.value -=
        this.deltaScroll * 0.0001 * this.deltaSnowSpeed;
      this.snow.uSize.value -= this.deltaScroll * 0.0001 * this.deltaSnowSize;

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
          x: this.cameraPositions[this.currentSection].lookAtX,
          y: this.cameraPositions[this.currentSection].lookAtY,
          z: this.cameraPositions[this.currentSection].lookAtZ,
          onUpdate: () => {
            this.camera.lookAt(
              this.cameraLookAt.x,
              this.cameraLookAt.y,
              this.cameraLookAt.z
            );
          },
        });
        //snow
        gsap.to(this.snow.uSnowDensity, {
          duration: this.transitionDuration.x,
          ease: "power4.out",
          value: this.cameraPositions[this.currentSection].snowDensity,
        });
        gsap.to(this.snow.uSnowSpeed, {
          duration: this.transitionDuration.x,
          ease: "power4.out",
          value: this.cameraPositions[this.currentSection].snowSpeed,
        });
        gsap.to(this.snow.uSize, {
          duration: this.transitionDuration.x,
          ease: "power4.out",
          value: this.cameraPositions[this.currentSection].snowSize,
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
