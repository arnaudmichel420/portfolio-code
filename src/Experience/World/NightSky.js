import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

export default class NightSky {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.parameters = {};
    this.parameters.turbidity = 10;
    this.parameters.rayleigh = 3;
    this.parameters.mieCoefficient = 0.005;
    this.parameters.mieDirectionalG = 0.7;
    this.parameters.sunPositionX = 0.3;
    this.parameters.sunPositionY = -0.038;
    this.parameters.sunPositionZ = -0.95;
    this.parameters.toneMappingExposure = 1.75;

    this.previousSection = null;

    this.setSky();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🌄 Sky");
      this.debugFolder.close();
      this.setDebug();
    }
  }
  setDebug() {
    this.debugFolder
      .add(this.parameters, "turbidity")
      .min(0)
      .max(20)
      .step(0.1)
      .onChange(() => {
        this.mesh.material.uniforms["turbidity"].value =
          this.parameters.turbidity;
      });
    this.debugFolder
      .add(this.parameters, "rayleigh")
      .min(0)
      .max(20)
      .step(0.1)
      .onChange(() => {
        this.mesh.material.uniforms["rayleigh"].value =
          this.parameters.rayleigh;
      });
    this.debugFolder
      .add(this.parameters, "mieCoefficient")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => {
        this.mesh.material.uniforms["mieCoefficient"].value =
          this.parameters.mieCoefficient;
      });
    this.debugFolder
      .add(this.parameters, "mieDirectionalG")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => {
        this.mesh.material.uniforms["mieDirectionalG"].value =
          this.parameters.mieDirectionalG;
      });
    this.debugFolder
      .add(this.parameters, "sunPositionX")
      .min(-10)
      .max(10)
      .step(0.01)
      .onChange(() => {
        this.mesh.material.uniforms["sunPosition"].value.set(
          this.parameters.sunPositionX,
          this.parameters.sunPositionY,
          this.parameters.sunPositionZ
        );
      });
    this.debugFolder
      .add(this.parameters, "sunPositionY")
      .min(-0.05)
      .max(0.01)
      .step(0.0001)
      .onChange(() => {
        this.mesh.material.uniforms["sunPosition"].value.set(
          this.parameters.sunPositionX,
          this.parameters.sunPositionY,
          this.parameters.sunPositionZ
        );
      });
    this.debugFolder
      .add(this.parameters, "sunPositionZ")
      .min(-10)
      .max(10)
      .step(0.01)
      .onChange(() => {
        this.mesh.material.uniforms["sunPosition"].value.set(
          this.parameters.sunPositionX,
          this.parameters.sunPositionY,
          this.parameters.sunPositionZ
        );
      });
  }
  setSky() {
    this.mesh = new Sky();
    this.mesh.position.set(0, 250, 0);
    this.mesh.scale.setScalar(500);
    this.scene.add(this.mesh);
    this.mesh.material.uniforms["turbidity"].value = this.parameters.turbidity;
    this.mesh.material.uniforms["rayleigh"].value = this.parameters.rayleigh;
    this.mesh.material.uniforms["mieCoefficient"].value =
      this.parameters.mieCoefficient;
    this.mesh.material.uniforms["mieDirectionalG"].value =
      this.parameters.mieDirectionalG;
    this.mesh.material.uniforms["sunPosition"].value.set(
      this.parameters.sunPositionX,
      this.parameters.sunPositionY,
      this.parameters.sunPositionZ
    );
  }
  setAnimation() {
    this.currentSection = this.experience.animateCamera.currentSection;
    let nightAnimation = gsap.timeline({ paused: true });

    nightAnimation
      .fromTo(
        this.parameters,
        { toneMappingExposure: 1.75 },
        {
          duration: this.experience.animateCamera.parameters.transitionDuration,
          ease: "power2.inOut",
          toneMappingExposure: 0.5,
          onUpdate: () => {
            this.experience.renderer.instance.toneMappingExposure =
              this.parameters.toneMappingExposure;
          },
        }
      )
      .fromTo(
        this.mesh.material.uniforms["rayleigh"],
        { value: this.parameters.rayleigh },
        {
          duration: this.experience.animateCamera.parameters.transitionDuration,
          ease: "power2.inOut",
          value: 20,
        },
        "<"
      );
    if (this.currentSection == 5 && this.previousSection == 4) {
      nightAnimation.play();
    } else if (this.currentSection == 4 && this.previousSection == 5) {
      nightAnimation.restart().reverse();
    } else if (
      this.currentSection == 6 ||
      (this.currentSection == 5 && this.previousSection == 6)
    ) {
      nightAnimation.progress(1);
    }
    this.previousSection = this.currentSection;
  }
}
