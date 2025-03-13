/**
 * Compress image to ktx2 :
 *
 *  toktx --t2 --genmipmap --upper_left_maps_to_s0t0 --uastc 4 --uastc_rdo_l static/textures/arbre-preCompress-png-4.0.ktx2 static/textures/arbre.png
 

 */
export default [
  {
    name: "mountainModel",
    type: "gltfModel",
    path: "models/mountain.glb",
  },
  {
    name: "treesModel",
    type: "gltfModel",
    path: "models/arbre.glb",
  },
  {
    name: "refugeModel",
    type: "gltfModel",
    path: "models/refuge.glb",
  },
  {
    name: "propsModel",
    type: "gltfModel",
    path: "models/props.glb",
  },
  {
    name: "mountainTexture",
    type: "texture",
    path: "textures/mountain.webp",
  },
  {
    name: "refugeTexture",
    type: "texture",
    path: "textures/refuge.webp",
  },
  {
    name: "treesTexture",
    type: "texture",
    path: "textures/arbre.webp",
  },
  {
    name: "propsTexture",
    type: "texture",
    path: "textures/props.webp",
  },
  {
    name: "heightMap",
    type: "exrLoader",
    path: "textures/heightMap.exr",
  },
  {
    name: "grassMap",
    type: "texture",
    path: "textures/grassTest.png",
  },
  {
    name: "perlinNoise",
    type: "texture",
    path: "textures/perlin.png",
  },
  {
    name: "snowTexture",
    type: "texture",
    path: "textures/snow.png",
  },
  {
    name: "lut1",
    type: "lut",
    path: "lut/standard.cube",
  },
  {
    name: "bouquetinModel",
    type: "gltfModel",
    path: "models/bouquetin.glb",
  },
  {
    name: "alienModel",
    type: "gltfModel",
    path: "models/alien.glb",
  },
  {
    name: "animalsTexture",
    type: "texture",
    path: "textures/animals.webp",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "models/fox.glb",
  },
  {
    name: "panelModel",
    type: "gltfModel",
    path: "models/panel.glb",
  },
  {
    name: "lightModel",
    type: "gltfModel",
    path: "models/light.glb",
  },
];
