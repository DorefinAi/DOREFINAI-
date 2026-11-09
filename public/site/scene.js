// Hero scene: news from everywhere, seen from orbit.
// Earth at night fills the lower part of the frame, its city lights are where stories start.
// Stories lift off from the cities to the centre of the horizon, where the product demo sits,
// then stream out along the horizon in both directions, published. Wire arcs link cities on the globe.
//
// Earth night lights: NASA Black Marble (public domain), as packaged by the three-globe project.
// For production, copy the image next to this file and point EARTH_NIGHT at the local copy.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const EARTH_NIGHT = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-night.jpg";
// Light theme only, loaded on first use: NASA Blue Marble and a terrain height map (public domain)
const EARTH_DAY = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const EARTH_RELIEF = "https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-topology.png";

const hero = document.querySelector("[data-hero3d]");
if (hero) {
  try {
    start(hero);
  } catch (err) {
    console.warn("3D hero unavailable:", err);
  }
}

function start(hero) {
  const canvas = hero.querySelector("canvas");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const lowPower = window.innerWidth < 900 || (navigator.hardwareConcurrency || 8) <= 4;

  /* ---------- Renderer ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 3000);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.8, 0.6, 0.7);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let seed = 21;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  /* ---------- Stars ---------- */
  const starCount = lowPower ? 1500 : 3000;
  const starPos = new Float32Array(starCount * 3);
  const starSize = new Float32Array(starCount);
  const starPhase = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    const u = rand() * Math.PI * 2;
    const y = rand() * 2 - 1;
    const r = Math.sqrt(1 - y * y);
    starPos.set([Math.cos(u) * r * 1200, y * 1200, Math.sin(u) * r * 1200 - 200], i * 3);
    starSize[i] = 0.6 + Math.pow(rand(), 7) * 3.4;
    starPhase[i] = rand() * 6.28;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("size", new THREE.BufferAttribute(starSize, 1));
  starGeo.setAttribute("phase", new THREE.BufferAttribute(starPhase, 1));
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { time: { value: 0 }, opacity: { value: 1 }, pr: { value: renderer.getPixelRatio() } },
    vertexShader:
      "attribute float size; attribute float phase; uniform float time; uniform float pr; varying float vA;" +
      "void main(){ vA = 0.55 + 0.45 * sin(time * (0.5 + phase * 0.15) + phase); gl_PointSize = size * pr * (0.8 + 0.3 * vA); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform float opacity; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vec3(1.25) * vA, a * opacity); }"
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ---------- Earth ---------- */
  const R = 110;
  const EARTH = V(0, -R - 11, -70);
  const earth = new THREE.Group();
  earth.position.copy(EARTH);
  const spin = new THREE.Group();
  earth.add(spin);
  scene.add(earth);

  const earthMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 1.6, roughness: 0.9 });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 96), earthMat);
  spin.add(globe);
  // Light theme: cities drawn as dark dots on a pale globe
  const cityDotsMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, depthWrite: false, visible: false });
  const cityDots = new THREE.Mesh(new THREE.SphereGeometry(R + 0.05, 128, 96), cityDotsMat);
  spin.add(cityDots);

  new THREE.TextureLoader().load(
    EARTH_NIGHT,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMat.emissiveMap = tex;
      earthMat.needsUpdate = true;
      cityDotsMat.alphaMap = tex;
      cityDotsMat.needsUpdate = true;
      if (!running) renderStill();
    },
    undefined,
    () => console.warn("Earth night texture not loaded")
  );

  // Light theme globe: daylight Earth rendered as a silver atlas, oceans pale and land in greys,
  // with real terrain relief catching the sun.
  let dayMat = null;
  const dayOcean = new THREE.Color(0xf2f2f2);
  const dayLand = new THREE.Color(0x8a8a8a);
  function dayMaterial() {
    if (dayMat) return dayMat;
    dayMat = new THREE.MeshStandardMaterial({ color: 0xe6e6e6, roughness: 0.85, metalness: 0, bumpScale: 3 });
    // Duotone in the site's own colour: pale tinted oceans, continents in the style colour
    dayMat.onBeforeCompile = (shader) => {
      shader.uniforms.uOcean = { value: dayOcean };
      shader.uniforms.uLand = { value: dayLand };
      shader.fragmentShader =
        "uniform vec3 uOcean;\nuniform vec3 uLand;\n" +
        shader.fragmentShader.replace(
          "#include <map_fragment>",
          [
            "#include <map_fragment>",
            "#ifdef USE_MAP",
            "  float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));",
            "  float landAmount = clamp(sqrt(lum) * 2.8 - 0.15, 0.0, 1.0);",
            "  diffuseColor.rgb = mix(uOcean, uLand, landAmount);",
            "#endif"
          ].join("\n")
        );
    };
    const loader = new THREE.TextureLoader();
    loader.load(EARTH_DAY, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      dayMat.map = t;
      dayMat.color.set(0xffffff);
      dayMat.needsUpdate = true;
      if (!running) renderStill();
    });
    loader.load(EARTH_RELIEF, (t) => {
      dayMat.bumpMap = t;
      dayMat.needsUpdate = true;
      if (!running) renderStill();
    });
    return dayMat;
  }

  // Atmosphere: a thin bright limb, the horizon line of the scene
  const atmoMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    uniforms: { color: { value: new THREE.Color(0xcfe0ff) }, strength: { value: 1.4 } },
    vertexShader:
      "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
    fragmentShader:
      "uniform vec3 color; uniform float strength; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(clamp(1.0 + dot(vN, vV), 0.0, 1.0), 5.0); gl_FragColor = vec4(color * f * strength, f); }"
  });
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.035, 96, 64), atmoMat);
  earth.add(atmo);

  // Points on the globe surface given latitude and longitude, in the spinning frame
  function onGlobe(lat, lon, lift = 0) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180);
    const r = R + lift;
    return V(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
  }
  // Turn the globe so South Asia faces the camera just below the horizon
  earth.quaternion.setFromUnitVectors(onGlobe(23, 76, 0).normalize(), V(0, 0.965, 0.26).normalize());

  const CITIES = [
    [28.6, 77.2], [19.1, 72.9], [26.9, 75.8], [13.1, 80.3], [22.6, 88.4], [12.97, 77.6], [17.4, 78.5],
    [25.3, 55.3], [24.9, 67.0], [23.8, 90.4], [27.7, 85.3], [6.9, 79.9], [1.35, 103.8], [51.5, -0.1],
    [30.0, 31.2], [-1.3, 36.8], [39.9, 116.4], [35.7, 139.7], [41.0, 28.9], [55.8, 37.6], [48.9, 2.35], [40.7, -74.0]
  ];

  // Wire arcs between cities, hugging the globe
  const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, depthWrite: false });
  const wires = [];
  for (let i = 0; i < 9; i++) {
    const a = CITIES[Math.floor(rand() * 13)];
    const b = CITIES[Math.floor(rand() * CITIES.length)];
    if (a === b) continue;
    const pa = onGlobe(a[0], a[1], 0.3);
    const pb = onGlobe(b[0], b[1], 0.3);
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    const lift = R + pa.distanceTo(pb) * 0.35;
    mid.setLength(lift);
    const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
    spin.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), wireMat));
    wires.push({ curve, offset: rand(), speed: 0.12 + rand() * 0.1 });
  }

  /* ---------- Where stories gather: the centre of the horizon, behind the product demo ---------- */
  const GAP = V(0, -16, -80);

  /* ---------- Story lights ---------- */
  // Story dots into and out of the middle are off; words around the globe replace them.
  const IN = 0;
  const OUT = 0;
  const WIRE_DOTS = wires.length;
  const total = IN + OUT + WIRE_DOTS;
  const sigPos = new Float32Array(total * 3);
  const sigCol = new Float32Array(total * 3);
  const sigGeo = new THREE.BufferGeometry();
  sigGeo.setAttribute("position", new THREE.BufferAttribute(sigPos, 3));
  sigGeo.setAttribute("color", new THREE.BufferAttribute(sigCol, 3));
  const sigMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: { pr: { value: renderer.getPixelRatio() } },
    vertexShader:
      "uniform float pr; varying vec3 vC; void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = pr * 720.0 / -mv.z; gl_Position = projectionMatrix * mv; }",
    fragmentShader: "varying vec3 vC; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, d); gl_FragColor = vec4(vC, a); }"
  });
  const signals = new THREE.Points(sigGeo, sigMat);
  signals.frustumCulled = false;
  scene.add(signals);

  const incoming = [];
  for (let i = 0; i < IN; i++) {
    const c = CITIES[Math.floor(rand() * 13)];
    incoming.push({ lat: c[0] + (rand() - 0.5) * 3, lon: c[1] + (rand() - 0.5) * 3, offset: rand(), speed: 0.07 + rand() * 0.06, lift: 10 + rand() * 18 });
  }
  const outgoing = [];
  for (let i = 0; i < OUT; i++) outgoing.push({ side: i % 2, offset: rand(), speed: 0.1 + rand() * 0.08, dy: (rand() - 0.5) * 0.9, dz: (rand() - 0.5) * 0.9 });

  /* ---------- Wire words: some story lights rise as words from the cities ---------- */
  const WORDS = [
    "#Jaipur", "Breaking", "Metro phase 2", "KOTA", "Yellow alert", "Footage · 3 clips",
    "Exam dates", "Udaipur", "High court", "Monsoon", "Jodhpur", "Budget"
  ].slice(0, window.innerWidth < 768 ? 4 : lowPower ? 8 : 12);
  // Phones see a narrow slice of the horizon, so their few words sit closer to the middle
  const narrow = window.innerWidth < 768;
  // Words are real HTML text laid over the canvas, so they stay sharp at every zoom level
  // and are not softened by the bloom pass. Each one is pinned to a 3D point and projected per frame.
  const wordLayer = document.createElement("div");
  wordLayer.className = "hero3d-words";
  wordLayer.setAttribute("aria-hidden", "true");
  canvas.after(wordLayer);
  const words = WORDS.map((text, i) => {
    const el = document.createElement("span");
    el.className = "hero3d-word";
    el.textContent = text;
    wordLayer.appendChild(el);
    // Alternate sides, spread outward from the middle and down the curve of the globe
    const side = i % 2 ? 1 : -1;
    const rank = Math.floor(i / 2) / Math.max(1, Math.ceil(WORDS.length / 2) - 1);
    const theta = side * ((narrow ? 0.1 + rank * 0.12 : 0.24 + rank * 0.36) + (rand() - 0.5) * 0.03);
    const phi = -0.01 + rand() * 0.05;
    const dir = V(Math.sin(theta), Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi)).normalize();
    // On phones the inner pair floats higher so the two words on each side never overlap
    const lift = narrow && rank === 0 ? 5 : 0;
    return { el, dir, lift, offset: (i * 0.37) % 1, speed: 0.07 + rand() * 0.02, hw: 0, hh: 0 };
  });
  const proj = new THREE.Vector3();
  // Half sizes in whole pixels, so each tag lands on the pixel grid (half-pixel text looks soft)
  function measureWords() {
    words.forEach((w) => {
      w.hw = Math.round(w.el.offsetWidth / 2);
      w.hh = Math.round(w.el.offsetHeight / 2);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureWords);

  const tmp = new THREE.Vector3();
  const from = new THREE.Vector3();
  const ctrl = new THREE.Vector3();
  const q = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
  let sigTint = new THREE.Color(1, 1, 1);
  let sigBoost = 2.4;

  function updateSignals(time) {
    spin.updateMatrixWorld(true);
    let n = 0;
    incoming.forEach((s) => {
      const t = (s.offset + time * s.speed) % 1;
      from.copy(onGlobe(s.lat, s.lon, 0.5)).applyMatrix4(spin.matrixWorld);
      ctrl.copy(from).lerp(GAP, 0.5);
      ctrl.y += s.lift * 0.5;
      q.v0.copy(from);
      q.v1.copy(ctrl);
      q.v2.copy(GAP);
      q.getPoint(t, tmp);
      const k = Math.min(1, t / 0.12) * Math.min(1, (1 - t) / 0.08) * sigBoost;
      sigPos.set([tmp.x, tmp.y, tmp.z], n * 3);
      sigCol.set([sigTint.r * k, sigTint.g * k, sigTint.b * k], n * 3);
      n++;
    });
    outgoing.forEach((s) => {
      const t = (s.offset + time * s.speed) % 1;
      const endX = s.side ? 260 : -260;
      tmp.set(GAP.x + endX * Math.pow(t, 1.6), GAP.y + s.dy, GAP.z + s.dz);
      const k = Math.min(1, t / 0.05) * Math.pow(1 - t, 1.5) * sigBoost;
      sigPos.set([tmp.x, tmp.y, tmp.z], n * 3);
      sigCol.set([sigTint.r * k, sigTint.g * k, sigTint.b * k], n * 3);
      n++;
    });
    wires.forEach((w) => {
      const t = (w.offset + time * w.speed) % 1;
      w.curve.getPoint(t, tmp).applyMatrix4(spin.matrixWorld);
      const k = Math.sin(t * Math.PI) * sigBoost * 0.8;
      sigPos.set([tmp.x, tmp.y, tmp.z], n * 3);
      sigCol.set([sigTint.r * k, sigTint.g * k, sigTint.b * k], n * 3);
      n++;
    });
    sigGeo.attributes.position.needsUpdate = true;
    sigGeo.attributes.color.needsUpdate = true;

    // Words around the globe, kept clear of the middle where the headline sits.
    words.forEach((w) => {
      const t = (w.offset + time * w.speed) % 1;
      // Each word sits over its spot on the globe, drifts up a little, and fades in and out
      tmp.copy(w.dir).multiplyScalar(R + 4 + w.lift + t * 6).add(EARTH);
      proj.copy(tmp).project(camera);
      // Fully visible for most of its life, with a short fade in and out
      const edge = Math.min(1, t / 0.15, (1 - t) / 0.15);
      const fade = edge * edge * (3 - 2 * edge);
      if (proj.z > 1) {
        w.el.style.opacity = "0";
        return;
      }
      if (!w.hw) w.hw = Math.round(w.el.offsetWidth / 2);
      if (!w.hh) w.hh = Math.round(w.el.offsetHeight / 2);
      const x = Math.round(((proj.x + 1) / 2) * W) - w.hw;
      const y = Math.round(((1 - proj.y) / 2) * H) - w.hh;
      w.el.style.transform = `translate(${x}px, ${y}px)`;
      // Hide a tag that would be cut off by the screen edge
      const inside = x >= 8 && x + w.hw * 2 <= W - 8;
      w.el.style.opacity = inside ? fade.toFixed(2) : "0";
    });
  }

  /* ---------- Lights ---------- */
  const rim = new THREE.DirectionalLight(0xdfe8ff, 2.2);
  rim.position.set(-60, 40, -200);
  const fill = new THREE.DirectionalLight(0xffffff, 0.6);
  fill.position.set(80, 60, 120);
  scene.add(rim, fill);

  /* ---------- Theme ---------- */
  function applyTheme() {
    const dark = document.documentElement.getAttribute("data-theme") !== "light";
    // Two looks. Night: black sky, real city lights, white story lights.
    // Day: white sky, continents in the newspaper red, dark story lights.
    const cs = getComputedStyle(document.documentElement);
    const token = (n, f) => new THREE.Color(cs.getPropertyValue(n).trim() || f);
    const pageBg = token("--bg", dark ? "#000000" : "#ffffff");
    const red = token("--accent-scene", "#fa4942");
    const tint = dark ? new THREE.Color(0xffffff) : new THREE.Color(0x111111);
    scene.background.copy(pageBg);
    starMat.uniforms.opacity.value = dark ? 1 : 0;
    globe.material = dark ? earthMat : dayMaterial();
    cityDotsMat.visible = !dark;
    cityDotsMat.opacity = 0.35;
    dayOcean.copy(pageBg).lerp(red, 0.05);
    dayLand.copy(pageBg).lerp(red, 0.85);
    cityDotsMat.color.set(0x111111);
    atmoMat.uniforms.color.value.set(dark ? 0xcfe0ff : 0x5f646b);
    atmoMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    atmoMat.uniforms.strength.value = dark ? 1.5 : 1.3;
    fill.intensity = dark ? 0.6 : 1.3;
    fill.position.set(dark ? 80 : -120, dark ? 60 : 160, dark ? 120 : 90);
    rim.intensity = dark ? 2.2 : 0.4;
    atmoMat.needsUpdate = true;
    wireMat.color.copy(tint);
    wireMat.opacity = dark ? 0.16 : 0.22;
    sigMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    sigMat.needsUpdate = true;
    sigTint = tint.clone();
    sigBoost = dark ? 2.4 : 1;
    bloom.strength = dark ? 0.6 : 0.15;
    bloom.threshold = dark ? 0.7 : 1.2;
    scene.environmentIntensity = dark ? 0.6 : 0.55;
    // Film-style mapping suits the night scene; daylight skips it so the page white stays pure white
    renderer.toneMapping = dark ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
  }

  /* ---------- Camera ---------- */
  const pointer = { x: 0, y: 0, ex: 0, ey: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
  const look = V(0, 0, 0);
  let W = 1;
  let H = 1;
  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.fov = camera.aspect < 0.8 ? 56 : 38;
    camera.updateProjectionMatrix();
  }
  function placeCamera(time, animate) {
    const r = hero.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    const k = animate ? 0.05 : 1;
    pointer.ex += (pointer.x - pointer.ex) * k;
    pointer.ey += (pointer.y - pointer.ey) * k;
    const portrait = W / H < 0.8;
    const sway = animate ? Math.sin(time * 0.1) * 1.5 : 0;
    camera.position.set(pointer.ex * 5 + sway, 4 - pointer.ey * 2 + p * 10, portrait ? 120 : 70);
    look.set(pointer.ex * 2, (portrait ? 14 : 4) - p * 6, -90);
    camera.lookAt(look);
    camera.updateMatrixWorld();
  }

  /* ---------- Drag to turn the globe ---------- */
  // Phones only: swiping left and right spins the Earth on its axis. Text and links keep their
  // normal behaviour, and vertical swipes still scroll the page. Desktop has no drag.
  const phone = window.matchMedia("(max-width: 767px)");
  const baseQuat = earth.quaternion.clone();
  const tiltQuat = new THREE.Quaternion();
  const X_AXIS = V(1, 0, 0);
  const drag = { on: false, id: null, x: 0, y: 0, yaw: 0, pitch: 0, vYaw: 0 };
  const NO_DRAG = "a, button, input, textarea, select, label, h1, p, .hero-demo-wrap";
  hero.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || !phone.matches || e.target.closest(NO_DRAG)) return;
    drag.on = true;
    drag.id = e.pointerId;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.vYaw = 0;
    hero.setPointerCapture(e.pointerId);
    hero.classList.add("is-dragging");
  });
  hero.addEventListener("pointermove", (e) => {
    if (!drag.on || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.vYaw = dx * 0.004;
    drag.yaw += drag.vYaw;
    drag.pitch = Math.min(0.3, Math.max(-0.3, drag.pitch + dy * 0.003));
    if (!running) renderStill();
  });
  const endDrag = (e) => {
    if (!drag.on || e.pointerId !== drag.id) return;
    drag.on = false;
    hero.classList.remove("is-dragging");
  };
  hero.addEventListener("pointerup", endDrag);
  hero.addEventListener("pointercancel", endDrag);
  function applyDrag(animate) {
    if (animate && !drag.on) {
      // Let a flick carry on and slow down, and ease the tilt back to the resting view
      drag.yaw += drag.vYaw;
      drag.vYaw *= 0.94;
      drag.pitch *= 0.985;
    }
    tiltQuat.setFromAxisAngle(X_AXIS, drag.pitch);
    earth.quaternion.copy(tiltQuat).multiply(baseQuat);
  }

  /* ---------- Loop ---------- */
  let time = 0;
  let last = performance.now();
  let running = false;
  let inView = true;

  function render(animate) {
    placeCamera(time, animate);
    applyDrag(animate);
    spin.rotation.y = Math.sin(time * 0.03) * 0.12 + drag.yaw;
    starMat.uniforms.time.value = time;
    updateSignals(time);
    composer.render();
  }
  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    render(true);
    requestAnimationFrame(loop);
  }
  function play() {
    if (running || !inView || document.hidden || reduce.matches) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
  }
  let pending = false;
  function renderStill() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if (!time) time = 6;
      render(false);
    });
  }
  window.addEventListener("scroll", () => !running && inView && renderStill(), { passive: true });
  new IntersectionObserver((e) => {
    inView = e[0].isIntersecting;
    if (inView) {
      play();
      if (!running) renderStill();
    } else stop();
  }).observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  reduce.addEventListener("change", () => (reduce.matches ? (stop(), renderStill()) : play()));
  new ResizeObserver(() => {
    resize();
    if (!running) renderStill();
  }).observe(hero);
  new MutationObserver(() => {
    applyTheme();
    if (!running) renderStill();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-style"] });

  applyTheme();
  resize();
  render(false);
  hero.classList.add("is-ready");
  play();
}
