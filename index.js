import * as THREE from "three";
import getLayer from "./getLayer.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const loader = new GLTFLoader().setPath("./glb/");
const textureLoader = new TextureLoader();
const texture = textureLoader.load("./textures/1Texture-00001.jpg");
const material = new THREE.MeshStandardMaterial({
  map: texture,
});
let model;

// load model
loader.load("spiral1.glb", (gltf) => {
  model = gltf.scene;
  scene.add(model);
  model.scale.setScalar(3);
  model.traverse(function (child) {
    if (child.isMesh) {
      child.material = material;
    }
  });
});

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
scene.add(hemiLight);

const spotLight01 = new THREE.SpotLight(0xffffff, 150, 100, 0.2, 0.5);
spotLight01.position.set(-8, -5, 0);
scene.add(spotLight01);

const spotLight02 = new THREE.SpotLight(0xffffff, 65, 100, 5, 5);
spotLight02.position.set(8, 10, 0);
scene.add(spotLight02);

// Sprites BG
const gradientBackground = getLayer({
  hue: 0.4,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -15.5,
});
scene.add(gradientBackground);

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
  ctrls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
