import gsap from "gsap";
import Experience from "./Experience";

export default class AnimateCamera {
  constructor() {
    this.experience = new Experience();

    this.cameraGroup = this.experience.camera.cameraGroup;
    this.camera = this.experience.camera.instance;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.worker = new Worker("Experience/worker.js");

    this.cameraLookAt = this.experience.camera.cameraLookAt;
    this.snow = this.experience.world.snow.material.uniforms;

    this.parameters = {};
    this.parameters.transitionDuration = 1.5;
    this.parameters.scrollSensivity = 0.1;
    this.parameters.parallaxSmoothing = 0.1;
    this.parameters.parallaxAmplitude = 2;

    this.cameraPositions = [
      {
        x: 93,
        y: 7.7,
        z: 131,
        lookAtX: -131,
        lookAtY: -20.7,
        lookAtZ: -300,
        snowDensity: 0,
        snowSpeed: 0.005,
        snowSize: 5,
      },
      {
        x: 3.5,
        y: 22.3,
        z: 119,
        lookAtX: -66.5,
        lookAtY: -41.3,
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
        x: -192,
        y: 332,
        z: 210,
        lookAtX: -192,
        lookAtY: 332,
        lookAtZ: 0,
        snowDensity: 1,
        snowSpeed: 0.01,
        snowSize: 10,
      },
      {
        x: -192,
        y: 400,
        z: 210,
        lookAtX: -192,
        lookAtY: 400,
        lookAtZ: 0,
        snowDensity: 0.5,
        snowSpeed: 0.009,
        snowSize: 1,
      },
      {
        x: -192,
        y: 410,
        z: 210,
        lookAtX: -192,
        lookAtY: 410,
        lookAtZ: 0,
        snowDensity: 0,
        snowSpeed: 0.009,
        snowSize: 1,
      },
    ];
    this.previousSection = 0;
    this.currentSection = 0;
    this.listen = true;
    this.scrollY = 0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🎬 Camera Animation");
      this.debugFolder.close();
      this.setDebug();
    }

    this.animateScroll();
  }
  setDebug() {
    this.debugFolder.add(this.parameters, "transitionDuration", 0, 5, 0.1);
    this.debugFolder.add(this.parameters, "scrollSensivity", 0, 0.5, 0.001);
    this.debugFolder.add(this.parameters, "parallaxAmplitude", 0, 5, 0.1);
    this.debugFolder.add(this.parameters, "parallaxSmoothing", 0, 0.2, 0.001);
  }
  animateScroll() {
    if (this.listen) {
      this.deltaScroll = this.experience.mouse.deltaScroll;
      this.deltaScroll *= this.parameters.scrollSensivity;
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
        console.log(this.currentSection);

        setTimeout(() => {
          this.listen = true;
        }, this.parameters.transitionDuration * 1000);
      } else if (
        this.scrollY > -(this.currentSection - 1) * 50 - 30 &&
        this.currentSection == this.previousSection &&
        this.currentSection > 0
      ) {
        this.listen = false;
        this.currentSection--;

        setTimeout(() => {
          this.listen = true;
        }, this.parameters.transitionDuration * 1000);
      }

      //launch animation
      if (this.currentSection !== this.previousSection) {
        this.previousSection = this.currentSection;
        gsap.to(this.camera.position, {
          duration: this.parameters.transitionDuration,
          ease: "power4.out",
          x: this.cameraPositions[this.currentSection].x,
          y: this.cameraPositions[this.currentSection].y,
          z: this.cameraPositions[this.currentSection].z,
        });
        gsap.to(this.cameraLookAt, {
          duration: this.parameters.transitionDuration,
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
          duration: this.parameters.transitionDuration,
          ease: "power4.out",
          value: this.cameraPositions[this.currentSection].snowDensity,
        });
        gsap.to(this.snow.uSnowSpeed, {
          duration: this.parameters.transitionDuration,
          ease: "power4.out",
          value: this.cameraPositions[this.currentSection].snowSpeed,
        });
        gsap.to(this.snow.uSize, {
          duration: this.parameters.transitionDuration,
          ease: "power4.out",
          value: this.cameraPositions[this.currentSection].snowSize,
        });

        //launch text animation
        if (this.currentSection > 4) {
          this.experience.world.text.setAnimation(this.currentSection);
        }
        //launch sky animation
        this.experience.world.nightSky.setAnimation(this.currentSection);
      }
    }
  }
  parallax() {
    let data = [];
    this.mouseXY = this.experience.mouse.mouseXY;
    data.push(this.mouseXY);
    data.push(this.cameraGroup.position);
    data.push(this.parameters.parallaxAmplitude);
    data.push(this.parameters.parallaxSmoothing);

    this.worker.postMessage(data);
    this.worker.onmessage = (e) => {
      const receivedData = e.data;
      this.cameraGroup.position.x = receivedData.x;
      this.cameraGroup.position.y = receivedData.y;
    };

    // this.mouseXY = this.experience.mouse.mouseXY;
    // this.cameraGroup.position.x +=
    //   (this.mouseXY.x * this.parameters.parallaxAmplitude -
    //     this.cameraGroup.position.x) *
    //   this.parameters.parallaxSmoothing;
    // this.cameraGroup.position.y +=
    //   (this.mouseXY.y * this.parameters.parallaxAmplitude -
    //     this.cameraGroup.position.y) *
    //   this.parameters.parallaxSmoothing;
  }
}
