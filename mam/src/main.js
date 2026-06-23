import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap"
import Lenis from '@studio-freight/lenis'

// lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothTouch: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const links = document.querySelectorAll('a[href^="#"]')

links.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'))
    if (target) {
      e.preventDefault()
      lenis.scrollTo(target)
    }
  })
})

// renderer
const canvas = document.getElementById("webgl");
const width = canvas.clientWidth
const height = canvas.clientHeight

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  stencil: true
});
renderer.setSize(width, height, false)

// scene
const scene = new THREE.Scene()

// camera
let fov = 75;
if (width < 1024) fov = 130;
else fov = 75;
const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 5000)
camera.updateProjectionMatrix()
camera.position.set(2000, 400, -200)
scene.add(camera)

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(1500, 300, 0);

controls.enableRotate = false;
controls.enablePan = false;
controls.enableZoom = false;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

renderer.domElement.style.touchAction = 'auto';

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.checked = false
});

const mouvementBtn = document.getElementById('mouvementBtn');
mouvementBtn.addEventListener('change', (e) => {
  mouvementBtn.parentElement.classList.toggle("active");
  const active = e.target.checked;

  controls.enableRotate = active;
  controls.enablePan = active;

  renderer.domElement.style.touchAction = active ? 'none' : 'auto';

  renderer.domElement.style.cursor = active ? 'grab' : 'default';
});

const autoRotateBtn = document.getElementById('autoRotateBtn')
autoRotateBtn.addEventListener('change', (e) => {
  autoRotateBtn.parentElement.classList.toggle("active");
  controls.autoRotate = e.target.checked
});

// light
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(0, 0, -100)
dirLight.target.position.set(0, 0, 0)
scene.add(dirLight.target)
scene.add(dirLight)

const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x778899, 1)
scene.add(hemiLight)

// const helper = new THREE.CameraHelper(dirLight.shadow.camera)
// scene.add(helper)

// load glb file
const loader = new GLTFLoader()
loader.load('/models/mam_v9.glb', (gltf) => {
  const model = gltf.scene

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.FrontSide
      child.geometry.computeBoundingBox()
      child.geometry.computeBoundingSphere()
      child.geometry.computeVertexNormals()
    }
})

  model.position.set(0, 0, 0)
  scene.add(model)
}, undefined, (error) => {
  console.error('Erreur lors du chargement du modèle :', error)
})

// outline
// const effect = new OutlineEffect(renderer, {
//   defaultThickness: 0.002,
//   defaultAlpha: 1,
//   defaultColor: [0, 0, 0]
// })

// animation
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera);
  // effect.render(scene, camera);
}
animate()

function isVertical() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const heroContent = document.querySelector(".heroContent")
  const heroTitle = document.querySelector(".heroTitle")
  const heroSubtitle = document.querySelector(".heroSubtitle")

  if (width < height) {
    heroContent.classList.add("vertical");
    heroTitle.classList.add("vertical");
    heroSubtitle.classList.add("vertical");
  } else {
    heroContent.classList.remove("vertical");
    heroTitle.classList.remove("vertical");
    heroSubtitle.classList.remove("vertical");
  }
}

isVertical();

// resize
window.addEventListener('resize', () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  isVertical();

  if (width < 1024) fov = 130;
  else fov = 75;

  camera.fov = fov;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height, false);

  function isScrollable(el) {
    return el.scrollHeight > el.clientHeight;
  }

  const mainContent = document.querySelector('.mainContent');

  if (isScrollable(mainContent)) {
    mainContent.setAttribute('data-lenis-prevent', '');
  } else {
    mainContent.removeAttribute('data-lenis-prevent');
  }
});

// anchors
const anchors = []

const anchor1 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor1.position.set(2000, 400, -200)
anchor1.name = "anchor1"
anchor1.lookAtTarget = new THREE.Vector3(1500, 300, 0)
scene.add(anchor1)
anchors.push(anchor1)

const anchor2 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor2.position.set(900, 450, -200)
anchor2.name = "anchor2"
anchor2.lookAtTarget = new THREE.Vector3(850, 350, 0)
scene.add(anchor2)
anchors.push(anchor2)

const anchor3 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor3.position.set(950, 330, 50)
anchor3.name = "anchor3"
anchor3.lookAtTarget = new THREE.Vector3(930, 300, 100)
scene.add(anchor3)
anchors.push(anchor3)

const anchor4 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor4.position.set(900, 350, 220)
anchor4.name = "anchor4"
anchor4.lookAtTarget = new THREE.Vector3(600, 350, 600)
scene.add(anchor4)
anchors.push(anchor4)

const anchor5 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor5.position.set(500, 350, 100)
anchor5.name = "anchor5"
anchor5.lookAtTarget = new THREE.Vector3(350, 350, 600)
scene.add(anchor5)
anchors.push(anchor5)

const anchor6 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor6.position.set(-150, 350, 75)
anchor6.name = "anchor6"
anchor6.lookAtTarget = new THREE.Vector3(100, 350, 600)
scene.add(anchor6)
anchors.push(anchor6)

const anchor7 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor7.position.set(-1000, 600, 0)
anchor7.name = "anchor7"
anchor7.lookAtTarget = new THREE.Vector3(0, 0, 500)
scene.add(anchor7)
anchors.push(anchor7)

const anchor8 = new THREE.Mesh(
  // new THREE.SphereGeometry(20),
  // new THREE.MeshStandardMaterial({ color: 0x8651e9 })
)
anchor8.position.set(-800, 1200, -600)
anchor8.name = "anchor8"
anchor8.lookAtTarget = new THREE.Vector3(-700, 0, -200)
scene.add(anchor8)
anchors.push(anchor8)

// raycast
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(anchors)

  if (intersects.length > 0) {
    const clickedAnchor = intersects[0].object
    moveCameraToAnchor(clickedAnchor)
  }
})

// camera to anchor
function moveCameraToAnchor(anchor) {
  const target = anchor.position.clone()
  const offset = new THREE.Vector3(0, 0, 0)
  const destination = target.clone().add(offset)

  const lookAt = anchor.lookAtTarget ? anchor.lookAtTarget.clone() : target.clone()

  controls.enabled = false

  const tl = gsap.timeline({
    onComplete: () => {
      controls.enabled = true
    }
  })

  tl.to(camera.position, {
    duration: 2,
    x: destination.x,
    y: destination.y,
    z: destination.z,
    ease: "power2.out",
    onUpdate: () => controls.update()
  }, 0)

  tl.to(controls.target, {
    duration: 2,
    x: lookAt.x,
    y: lookAt.y,
    z: lookAt.z,
    ease: "power2.out",
    onUpdate: () => controls.update()
  }, 0)
}

const anchorsMap = {
  anchor1,
  anchor2,
  anchor3,
  anchor4,
  anchor5,
  anchor6,
  anchor7,
  anchor8,
}

// link anchor to <a> tag
const anchorLinks = document.querySelectorAll('#anchorsLinks a')

anchorLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    anchorLinks.forEach(link => {
      link.classList.remove("active");
    });
    link.classList.add("active");
    const anchorName = e.target.dataset.anchor
    const anchor = anchorsMap[anchorName]
    if (anchor) {
      moveCameraToAnchor(anchor)
    }
  });
});

const toggleMenu = document.getElementById("toggleMenu");
console.log(toggleMenu)
toggleMenu.addEventListener('change', (e) => {
  toggleMenu.parentElement.parentElement.classList.toggle("hide");
});

