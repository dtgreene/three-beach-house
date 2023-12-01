import * as THREE from 'three';
import debounce from 'lodash.debounce';

import vertexShader from './shaders/vertex-shader.glsl?raw';
import fragmentShader from './shaders/fragment-shader.glsl?raw';
import gridPath from './texture.png';

import './styles.css';

const renderer = new THREE.WebGLRenderer({ antialias: true, });
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
camera.position.set(0, 0, 1);
const gridTexture = loader.load(gridPath);
gridTexture.wrapS = THREE.RepeatWrapping;
gridTexture.wrapT = THREE.RepeatWrapping;
gridTexture.magFilter = THREE.NearestFilter;
gridTexture.minFilter = THREE.NearestFilter;

const material = new THREE.ShaderMaterial({
  uniforms: {
    cellWidth: {
      value: getCellWidth(),
    },
    time: { value: 0.0 },
    diffuse: { value: gridTexture },
  },
  vertexShader,
  fragmentShader,
});
const geometry = new THREE.PlaneGeometry(0.5, 1);

const plane1 = new THREE.Mesh(geometry, material);
plane1.position.set(0.25, 0.5, 0);
scene.add(plane1);

const plane2 = new THREE.Mesh(geometry, material);
plane2.position.set(0.75, 0.5, 0);
plane2.scale.set(-1, 1, 1);
scene.add(plane2);

const debouncedHandleResize = debounce(handleResize, 100);

let prevTimeStamp = null;
let elapsedTime = 0;

function init() {
  // Add window event listeners
  window.addEventListener('resize', debouncedHandleResize, false);

  // Setup and append renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('render-root').appendChild(renderer.domElement);

  animate();
}

function handleResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  material.uniforms.cellWidth.value = getCellWidth();
}

function getCellWidth() {
  return (window.innerWidth / window.innerHeight) * 0.5;
}

function animate(timeStamp = 0) {
  if (prevTimeStamp === null) {
    prevTimeStamp = timeStamp;
  }

  // Calculate elapsed time in seconds
  elapsedTime += (timeStamp - prevTimeStamp) * 0.001;

  material.uniforms.time.value = elapsedTime;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
  prevTimeStamp = timeStamp;
}

init();
