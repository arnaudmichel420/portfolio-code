import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
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
  }
  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "exrLoader") {
        this.loaders.exrLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
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
