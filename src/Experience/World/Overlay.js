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
    this.active = true;

    this.ui = gsap.timeline();
    this.parameters = {};
    this.parameters.color = "#7aadff";
    this.parameters.offset = 0.5;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Overlay");
      this.debugFolder.close();
      this.setDebug();
    }

    this.setBackground();
    this.setLoadingBar();
  }
  setDebug() {
    this.debugFolder
      .add(this.parameters, "offset")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.setBackground();
      });
    this.debugFolder.addColor(this.parameters, "color").onChange(() => {
      this.overlayMaterial.uniforms.uColor.value.set(this.parameters.color);
    });
  }
  setBackground() {
    this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1 },
        uColor: { value: new THREE.Color(this.parameters.color) },
        uOffset: { value: this.parameters.offset },
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
      uniform vec3 uColor;
      uniform float uOffset;
      varying vec2 vUv;
        void main(){
          float strength = vUv.y + uOffset;
          vec3 mixedColor = mix(uColor, vec3(0.0, 0.0, 0.0), strength);
          gl_FragColor = vec4(vec3(mixedColor), uAlpha);
        }
        
        `,
    });
    this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
    this.overlay.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    this.scene.add(this.overlay);
  }
  setLoadingBar() {
    const loadingBar = document.querySelector(".loading-bar");
    const path = document.querySelector(".loading-bar svg path");
    const pathLenght = path.getTotalLength();
    let loadingProgress = null;
    let loadingAnimation = gsap.to(path, {
      duration: 2,
      ease: "power2.inOut",
      strokeDashoffset: loadingProgress,
    });

    this.ressources.on("loading", () => {
      loadingProgress =
        (pathLenght * (this.ressources.toLoad - this.ressources.loaded)) /
        this.ressources.toLoad;
      loadingAnimation.vars.strokeDashoffset = loadingProgress;
      loadingAnimation.invalidate().restart();
    });
    this.ressources.on("ready", () => {
      const h1 = document.querySelector(".loading-bar h1");
      loadingBar.style.cursor = "pointer";
      loadingBar.addEventListener("click", () => {
        gsap.to(this.overlayMaterial.uniforms.uAlpha, {
          duration: 3,
          value: 0,
        });
        gsap.to(loadingBar, {
          duration: 1,
          opacity: 0,
          ease: "power2.inOut",

          onComplete: () => {
            this.active = false;
            loadingBar.remove();
            this.setScrollUi();
          },
        });
      });

      gsap.to(h1, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        onComplete: () => {
          h1.textContent = "Click to enter";
          gsap.fromTo(
            h1,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
      });
    });
  }
  setScrollUi() {
    this.scrollY = this.experience.animateCamera.scrollY;
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
