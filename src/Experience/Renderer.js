import * as THREE from "three";
import { HalfFloatType } from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  EffectComposer,
  RenderPass,
  BloomEffect,
  EffectPass,
  SMAAEffect,
  SMAAPreset,
  OutlineEffect,
  BlendFunction,
  // BrightnessContrastEffect,
  // HueSaturationEffect,
  // ToneMappingEffect,
  ToneMappingMode,
  LUT3DEffect,
  LookupTexture,
} from "postprocessing";
import Experience from "./Experience.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.ressources = this.experience.ressources;

    this.parameters = {};
    this.parameters.bloomBlendFunction = BlendFunction.ADD;
    this.parameters.bloomIntensity = 0.1;
    this.parameters.bloomRadius = 0.9;
    this.parameters.bloomLuminanceThreshold = 1.1;
    this.parameters.bloomLuminanceSmoothing = 0.1;
    this.parameters.outlineBlendFunction = BlendFunction.ADD;
    this.parameters.outlineEdgeStrength = 3;
    this.parameters.outlinePulseSpeed = 0.5;
    this.parameters.outlineVisibleEdgeColor = "#ff5900";
    this.parameters.outlineHiddenEdgeColor = "#FFFFFF";
    this.parameters.colorBlendFunction = BlendFunction.NORMAL;
    this.parameters.colorBrightness = 0.05;
    this.parameters.colorContrast = 0;
    this.parameters.hueBlendFunction = BlendFunction.NORMAL;
    this.parameters.colorHue = 0;
    this.parameters.colorSaturation = 0;
    this.parameters.toneMappingBlendFunction = BlendFunction.SKIP;
    this.parameters.toneMappingMode = ToneMappingMode.NO_TONEMAPPING;
    this.parameters.toneMappingWhitePoint = 16.0;
    this.parameters.toneMappingMiddleGrey = 0.6;
    this.parameters.toneMappingMaxLuminance = 16.0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("📺 Renderer");
      this.debugFolder.close();
      this.setDebug();
    }

    this.setInstance();
    this.setCSS2DRenderer();
    this.setEffectComposer();
  }
  setDebug() {
    this.bloomFolder = this.debugFolder.addFolder("Bloom");
    this.bloomFolder.close();
    this.bloomFolder
      .add(this.parameters, "bloomBlendFunction", Object.keys(BlendFunction))
      .onChange((value) => {
        this.bloomEffect.blendMode.blendFunction = BlendFunction[value];
      });
    this.bloomFolder
      .add(this.parameters, "bloomIntensity")
      .min(0)
      .max(10)
      .step(0.1)
      .onChange(() => {
        this.bloomEffect.intensity = this.parameters.bloomIntensity;
      });
    this.bloomFolder
      .add(this.parameters, "bloomRadius")
      .min(0)
      .max(1)
      .step(0.1)
      .onChange(() => {
        this.bloomEffect.radius = this.parameters.bloomRadius;
      });
    this.bloomFolder
      .add(this.parameters, "bloomLuminanceThreshold")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => {
        this.bloomEffect.luminanceThreshold =
          this.parameters.bloomLuminanceThreshold;
      });
    this.bloomFolder
      .add(this.parameters, "bloomLuminanceSmoothing")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => {
        this.bloomEffect.luminanceSmoothing =
          this.parameters.bloomLuminanceSmoothing;
      });
    this.outlineFolder = this.debugFolder.addFolder("Outline");
    this.outlineFolder.close();
    this.outlineFolder
      .add(this.parameters, "outlineBlendFunction", Object.keys(BlendFunction))
      .onChange((value) => {
        this.outlineEffect.blendMode.blendFunction = BlendFunction[value];
      });
    this.outlineFolder
      .add(this.parameters, "outlineEdgeStrength")
      .min(0)
      .max(100)
      .step(0.1)
      .onChange(() => {
        this.outlineEffect.edgeStrength = this.parameters.outlineEdgeStrength;
      });
    this.outlineFolder
      .add(this.parameters, "outlinePulseSpeed")
      .min(0)
      .max(10)
      .step(0.01)
      .onChange(() => {
        this.outlineEffect.pulseSpeed = this.parameters.outlinePulseSpeed;
      });
    this.outlineFolder
      .addColor(this.parameters, "outlineVisibleEdgeColor")
      .onChange((value) => {
        this.outlineEffect.visibleEdgeColor.set(new THREE.Color(value));
      });
    this.outlineFolder
      .addColor(this.parameters, "outlineHiddenEdgeColor")
      .onChange((value) => {
        this.outlineEffect.hiddenEdgeColor.set(new THREE.Color(value));
      });
    // this.colorFolder = this.debugFolder.addFolder("Color");
    // this.colorFolder.close();
    // this.colorFolder
    //   .add(this.parameters, "colorBlendFunction", Object.keys(BlendFunction))
    //   .onChange((value) => {
    //     this.colorEffect.blendMode.blendFunction = BlendFunction[value];
    //   });
    // this.colorFolder
    //   .add(this.parameters, "colorBrightness")
    //   .min(-1)
    //   .max(1)
    //   .step(0.01)
    //   .onChange(() => {
    //     this.colorEffect.brightness = this.parameters.colorBrightness;
    //   });
    // this.colorFolder
    //   .add(this.parameters, "colorContrast")
    //   .min(-1)
    //   .max(1)
    //   .step(0.01)
    //   .onChange(() => {
    //     this.colorEffect.contrast = this.parameters.colorContrast;
    //   });
    // this.colorFolder
    //   .add(this.parameters, "hueBlendFunction", Object.keys(BlendFunction))
    //   .onChange((value) => {
    //     this.hueSaturationEffect.blendMode.blendFunction = BlendFunction[value];
    //   });
    // this.colorFolder
    //   .add(this.parameters, "colorHue")
    //   .min(-1)
    //   .max(1)
    //   .step(0.001)
    //   .onChange(() => {
    //     this.hueSaturationEffect.hue = this.parameters.colorHue;
    //   });
    // this.colorFolder
    //   .add(this.parameters, "colorSaturation")
    //   .min(-1)
    //   .max(1)
    //   .step(0.001)
    //   .onChange(() => {
    //     this.hueSaturationEffect.saturation = this.parameters.colorSaturation;
    //   });
    // this.toneMappingFolder = this.debugFolder.addFolder("ToneMapping");
    // this.toneMappingFolder.close();
    // this.toneMappingFolder
    //   .add(
    //     this.parameters,
    //     "toneMappingBlendFunction",
    //     Object.keys(BlendFunction)
    //   )
    //   .onChange((value) => {
    //     this.toneMappingEffect.blendMode.blendFunction = BlendFunction[value];
    //   });
    // this.toneMappingFolder
    //   .add(this.parameters, "toneMappingMode", Object.keys(ToneMappingMode))
    //   .onChange((value) => {
    //     this.toneMappingEffect.mode = ToneMappingMode[value];
    //   });
    // this.toneMappingFolder
    //   .add(this.parameters, "toneMappingWhitePoint")
    //   .min(0)
    //   .max(20)
    //   .step(0.001)
    //   .onChange(() => {
    //     this.toneMappingEffect.whitePoint =
    //       this.parameters.toneMappingWhitePoint;
    //   });
    // this.toneMappingFolder
    //   .add(this.parameters, "toneMappingMiddleGrey")
    //   .min(0)
    //   .max(20)
    //   .step(0.001)
    //   .onChange(() => {
    //     this.toneMappingEffect.middleGrey =
    //       this.parameters.toneMappingMiddleGrey;
    //   });
    // this.toneMappingFolder
    //   .add(this.parameters, "toneMappingMaxLuminance")
    //   .min(0)
    //   .max(20)
    //   .step(0.001)
    //   .onChange(() => {
    //     this.toneMappingEffect.maxLuminance =
    //       this.parameters.toneMappingMaxLuminance;
    //   });
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: true,
      stencil: false,
      depth: false,
    });
    this.instance.toneMapping = THREE.NoToneMapping;
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
  setEffectComposer() {
    this.composer = new EffectComposer(this.instance, {
      frameBufferType: HalfFloatType,
    });
    const renderPass = new RenderPass(this.scene, this.camera.instance);

    //Tone mapping
    // this.toneMappingEffect = new ToneMappingEffect({
    //   blendFunction: this.parameters.toneMappingBlendFunction,
    //   mode: this.parameters.toneMappingMode,
    //   adaptive: false,
    //   resolution: 256,
    //   whitePoint: this.parameters.toneMappingWhitePoint,
    //   middleGrey: this.parameters.toneMappingMiddleGrey,
    //   maxLuminance: this.parameters.toneMappingMaxLuminance,
    // });

    // this.toneMappingPass = new EffectPass(
    //   this.camera.instance,
    //   this.toneMappingEffect
    // );

    //Color correction
    // this.colorEffect = new BrightnessContrastEffect({
    //   blendFunction: this.parameters.colorBlendFunction,
    //   brightness: this.parameters.colorBrightness,
    //   contrast: this.parameters.colorContrast,
    // });
    // this.colorPass = new EffectPass(this.camera.instance, this.colorEffect);

    // this.hueSaturationEffect = new HueSaturationEffect({
    //   blendFunction: this.parameters.hueBlendFunction,
    //   hue: this.parameters.colorHue,
    //   saturation: this.parameters.colorSaturation,
    // });
    // this.huePass = new EffectPass(
    //   this.camera.instance,
    //   this.hueSaturationEffect
    // );

    //Anti-aliasing
    const smaaEffect = new SMAAEffect({
      preset: SMAAPreset.HIGH,
      edgeDetectionMode: SMAAEffect.EDGES_LUMA,
    });
    this.smaaPass = new EffectPass(this.camera.instance, smaaEffect);

    //Bloom effect
    this.bloomEffect = new BloomEffect({
      blendFunction: this.parameters.bloomBlendFunction,
      intensity: this.parameters.bloomIntensity,
      radius: this.parameters.bloomRadius,
      luminanceThreshold: this.parameters.bloomLuminanceThreshold,
      luminanceSmoothing: this.parameters.bloomLuminanceSmoothing,
      mipmapBlur: true,
    });
    this.bloomPass = new EffectPass(this.camera.instance, this.bloomEffect);

    //Outline effect
    this.outlineEffect = new OutlineEffect(this.scene, this.camera.instance, {
      blendFunction: this.parameters.outlineBlendFunction,
      multisampling: Math.min(4, this.instance.capabilities.maxSamples),
      edgeStrength: this.parameters.outlineEdgeStrength,
      pulseSpeed: this.parameters.outlinePulseSpeed,
      visibleEdgeColor: this.parameters.outlineVisibleEdgeColor,
      hiddenEdgeColor: new THREE.Color(0, 0, 0, 0),
      height: 480,
      blur: true,
      xRay: true,
    });
    this.outlinePass = new EffectPass(this.camera.instance, this.outlineEffect);

    //Adding base pass
    this.composer.addPass(renderPass);
  }
  addLutPass() {
    this.lut = LookupTexture.from(this.experience.ressources.item.lut1);
    this.lutEffect = new LUT3DEffect(this.lut);
    this.lutPass = new EffectPass(this.camera.instance, this.lutEffect);
    this.addPass();
  }
  addPass() {
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.outlinePass);
    // this.composer.addPass(this.colorPass);
    // this.composer.addPass(this.huePass);
    // this.composer.addPass(this.toneMappingPass);
    this.composer.addPass(this.lutPass);
    this.composer.addPass(this.smaaPass);
  }
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.textRenderer.setSize(this.sizes.width, this.sizes.height);
    this.composer.setSize(this.sizes.width, this.sizes.height);
  }
  update() {
    // this.instance.render(this.scene, this.camera.instance);
    this.composer.render();
    this.textRenderer.render(this.scene, this.camera.instance);
  }
}
