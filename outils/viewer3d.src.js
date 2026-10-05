// Vue 3D interactive (three.js) — même rendu que le site star-ai.fr.
// Ce fichier est la source ; le site utilise la version compilée vendor/viewer3d.js.
// Recompiler : npx esbuild outils/viewer3d.src.js --bundle --minify --format=esm --outfile=vendor/viewer3d.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const ACCENT = 0x2ab6ff;

// Oriente, met à l'échelle et centre le modèle sur son socle.
function prepareModel(model, rotX) {
  model.rotation.x = rotX;
  model.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  model.scale.setScalar(7.65 / Math.max(size.x, size.z));
  model.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y + 0.03, -center.z);
  model.traverse((obj) => {
    if (!obj.isMesh) return;
    const mats = (Array.isArray(obj.material) ? obj.material : [obj.material]).map((m) => {
      const c = m.clone();
      c.side = THREE.DoubleSide;
      if (c.isMeshStandardMaterial) c.roughness = THREE.MathUtils.clamp(c.roughness, 0.22, 0.86);
      return c;
    });
    obj.material = Array.isArray(obj.material) ? mats : mats[0];
    obj.castShadow = true;
    obj.receiveShadow = true;
  });
  model.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(model);
}

export function monterModele3D(container, label, url, options = {}) {
  const rotX = ((options.rotation ?? 90) * Math.PI) / 180;
  const textes = options.textes || {};
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    if (label) label.textContent = textes.indispo || "Affichage 3D indisponible sur cet appareil";
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07101a, 0.032);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
  camera.position.set(8.8, 6.6, 9.2);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.zoomToCursor = false;
  controls.minDistance = 5.2;
  controls.maxDistance = 18;
  controls.maxPolarAngle = 1.48;
  controls.target.set(0, 2.1, 0);
  // La molette ne zoome que si on a cliqué dans la vue (évite de bloquer le défilement de la page)
  renderer.domElement.addEventListener("pointerdown", () => { controls.enableZoom = true; });
  controls.enableZoom = false;
  container.addEventListener("mouseleave", () => { controls.enableZoom = false; });

  scene.add(new THREE.HemisphereLight(0x74cfff, 0x07101a, 2.1));
  const sun = new THREE.DirectionalLight(0xf1f7ff, 4.8);
  sun.position.set(7, 11, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  scene.add(sun);
  const rimBlue = new THREE.PointLight(ACCENT, 82, 24, 2);
  rimBlue.position.set(-7, 5, -3);
  scene.add(rimBlue);
  const rimWarm = new THREE.PointLight(0xff765b, 28, 16, 2);
  rimWarm.position.set(5, 2, -5);
  scene.add(rimWarm);

  const grid = new THREE.GridHelper(23, 28, ACCENT, 0x17334a);
  grid.material.opacity = 0.22;
  grid.material.transparent = true;
  scene.add(grid);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(4.55, 4.8, 0.18, 96),
    new THREE.MeshStandardMaterial({ color: 0x0a1722, metalness: 0.78, roughness: 0.38, emissive: 0x06151f }),
  );
  base.position.y = -0.13;
  base.receiveShadow = true;
  scene.add(base);

  const ringMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.42, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(new THREE.RingGeometry(4.88, 4.92, 128), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.025;
  scene.add(ring);

  const scanMat = new THREE.MeshBasicMaterial({
    color: ACCENT, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 9.5), scanMat);
  scan.rotation.x = -Math.PI / 2;
  scene.add(scan);

  const holder = new THREE.Group();
  scene.add(holder);

  const restPos = camera.position.clone();
  const restTarget = controls.target.clone();
  let lastInteraction = performance.now();
  let dragging = false;
  controls.addEventListener("start", () => { dragging = true; lastInteraction = performance.now(); });
  controls.addEventListener("end", () => {
    restPos.copy(camera.position);
    restTarget.copy(controls.target);
    dragging = false;
    lastInteraction = performance.now();
  });

  const setLabel = (text, hidden) => {
    if (!label) return;
    label.textContent = text;
    label.hidden = !!hidden;
  };

  setLabel(textes.chargement || "Chargement du modèle 3D…");
  const draco = new DRACOLoader();
  draco.setDecoderPath(options.dracoPath || "vendor/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      const box = prepareModel(model, rotX);
      restTarget.y = Math.max(1.2, box.max.y * 0.48);
      holder.add(model);
      setLabel("", true);
    },
    (e) => {
      if (e.total) setLabel((textes.chargement || "Chargement du modèle 3D…") + " " + Math.round((e.loaded / e.total) * 100) + " %");
    },
    (err) => {
      console.error("Impossible de charger le modèle 3D", err);
      setLabel(textes.erreur || "Modèle 3D indisponible");
    },
  );

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = camera.aspect < 0.78 ? 52 : 38;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(container);
  resize();

  // N'anime que lorsque la vue est visible à l'écran
  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(container);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (!dragging) {
      camera.position.lerp(restPos, 0.035);
      controls.target.lerp(restTarget, 0.045);
    }
    if (!reducedMotion && holder.children.length && performance.now() - lastInteraction > 1800) {
      holder.rotation.y += 0.0014;
    }
    scan.position.y = 0.25 + ((t * 0.72) % 5.8);
    scanMat.opacity = 0.05 + Math.sin(t * 3.2) * 0.025;
    ringMat.opacity = 0.28 + Math.sin(t * 1.8) * 0.12;
    controls.update();
    renderer.render(scene, camera);
  };
  tick();
}
