import * as THREE from "three";
import Experience from "./Experience.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export default class Renderer {
  constructor() {
    this.Experience = new Experience();
    this.canvas = this.Experience.canvas;
    this.scene = this.Experience.scene;
    this.sizes = this.Experience.sizes;
    this.camera = this.Experience.camera;

    this.setInstance();
    this.setCSS2DRenderer();
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor("#101010");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }
  setCSS2DRenderer() {
    this.textRenderer = new CSS2DRenderer();
    this.textRenderer.setSize(this.sizes.width, this.sizes.height);
    this.textRenderer.domElement.style.position = "absolute";
    this.textRenderer.domElement.style.top = "0px";
    this.textRenderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(this.textRenderer.domElement);
  }
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.textRenderer.setSize(this.sizes.width, this.sizes.height);
  }
  update() {
    this.instance.render(this.scene, this.camera.instance);
    this.textRenderer.render(this.scene, this.camera.instance);
  }
}
