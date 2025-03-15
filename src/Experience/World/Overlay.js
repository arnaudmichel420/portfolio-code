import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Overlay {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.camera = this.experience.camera.instance;

    this.debug = this.experience.debug;
    this.phone = this.experience.phone;
    this.active = true;

    this.ui = gsap.timeline();
    this.loadingOut = gsap.timeline();
    this.parameters = {};
    this.parameters.uColor1 = "#7aadff";
    this.parameters.uColor2 = "#000000";
    this.parameters.uOffset = 0.5;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("⛔️ Overlay");
      this.debugFolder.close();
      this.setDebug();
    }

    this.setBackground();
    this.setLoadingBar();
  }
  setDebug() {
    this.debugFolder
      .add(this.parameters, "uOffset")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.material.uniforms.uOffset.value = this.parameters.uOffset;
      });
    this.debugFolder.addColor(this.parameters, "uColor1").onChange(() => {
      this.material.uniforms.uColor1.value.set(this.parameters.uColor1);
    });
  }
  setBackground() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: new THREE.Uniform(1),
        uColor1: { value: new THREE.Color(this.parameters.uColor1) },
        uColor2: { value: new THREE.Color(this.parameters.uColor2) },
        uOffset: new THREE.Uniform(this.parameters.uOffset),
      },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
          void main(){
          gl_Position =  vec4(position,1.0);
          vUv = uv;
          }
        
        `,
      fragmentShader: `
      uniform float uAlpha;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uOffset;
      varying vec2 vUv;
        void main(){
          float strength = vUv.y + uOffset;
          vec3 mixedColor = mix(uColor1, uColor2, strength);
          gl_FragColor = vec4(vec3(mixedColor), uAlpha);
        }
        
        `,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    this.scene.add(this.mesh);
  }
  setLoadingBar() {
    this.loadingBar = document.querySelector(".loading-bar");
    const path = document.querySelector(".loading-bar svg path");

    //phone path
    if (this.phone.active) {
      path.setAttribute("d", "M0 0 H300 V125 H0 Z");
    }

    const pathLenght = path.getTotalLength();
    let loadingProgress = null;
    let loadingAnimation = gsap.to(path, {
      duration: 2,
      ease: "power2.inOut",
      strokeDashoffset: loadingProgress,
    });

    //progress animation
    this.ressources.on("loading", () => {
      loadingProgress =
        (pathLenght * (this.ressources.toLoad - this.ressources.loaded)) /
        this.ressources.toLoad;
      loadingAnimation.vars.strokeDashoffset = loadingProgress;
      loadingAnimation.invalidate().restart();
    });

    //ready animation
    this.ressources.on("ready", () => {
      const h1 = document.querySelector(".loading-bar h2");
      gsap.to(h1, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        onComplete: () => {
          h1.textContent = "Click to enter";
          this.loadingBar.style.cursor = "pointer";
          this.removeLoading();
          gsap.fromTo(
            h1,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
      });
    });
  }
  removeLoading() {
    this.loadingBar.addEventListener("click", () => {
      this.loadingOut
        .to(this.material.uniforms.uColor2.value, {
          duration: 1,
          r: 1,
          g: 1,
          b: 1,
        })
        .to(
          this.material.uniforms.uOffset,
          {
            duration: 1,
            value: 1,
          },
          "<"
        )
        .to(
          this.loadingBar,
          {
            duration: 1,
            opacity: 0,
            ease: "power2.inOut",

            onComplete: () => {
              this.active = false;
              this.loadingBar.remove();
              this.setScrollUi();
              this.experience.renderer.addLutPass();
            },
          },
          "<"
        )
        .to(this.material.uniforms.uAlpha, {
          duration: 1,
          value: 0,
          onComplete: () => {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.mesh);
          },
        });
    });
  }
  setScrollUi() {
    const scrollUi = document.querySelector(".scrollUi");
    this.scrollUiActive = true;

    document.addEventListener("wheel", () => {
      if (this.scrollUiActive) {
        this.scrollUiActive = false;
        this.scrollUiOut(scrollUi);
      }
    });
    //phone
    document.addEventListener("touchmove", () => {
      if (this.scrollUiActive) {
        this.scrollUiActive = false;
        this.scrollUiOut(scrollUi);
      }
    });

    if (scrollUi) {
      this.ui
        .to(scrollUi, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(".scrollUi div", {
          duration: 1,
          ease: "power2.inOut",
          opacity: 1,
          repeat: -1,
          yoyo: true,
        });
    }
  }
  scrollUiOut(scrollUi) {
    document.removeEventListener("wheel", () => {});
    document.removeEventListener("touchmove", () => {});
    gsap.to(scrollUi, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        scrollUi.remove();
      },
    });
  }
}
