import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter.js";
import {
  DRACOLoader,
  KTX2Loader,
  LUTCubeLoader,
} from "three/examples/jsm/Addons.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";

export default class Ressources extends EventEmitter {
  constructor(sources) {
    super();

    //options
    this.sources = sources;

    //setup

    this.item = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }
  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    this.loaders.exrLoader = new EXRLoader();
    this.loaders.lutLoader = new LUTCubeLoader();
    this.loaders.ktx2Loader = new KTX2Loader();
  }
  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "texture":
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "exrLoader":
          this.loaders.exrLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "lut":
          this.loaders.lutLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "ktx2":
          this.loaders.ktx2Loader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        default:
          break;
      }
    }
  }
  sourceLoaded(source, file) {
    this.item[source.name] = file;
    this.loaded++;

    this.trigger("loading");

    if (this.loaded == this.toLoad) {
      this.trigger("ready");
    }
  }
}
