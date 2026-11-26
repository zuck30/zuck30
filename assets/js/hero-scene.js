const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.getElementById('hero-canvas');
const stage = canvas ? canvas.closest('.hero-scene') : null;

if (canvas && stage) {
  init(canvas, stage).catch(function () {
    stage.hidden = true;
  });
}

async function init(canvas, stage) {
  let THREE;
  try {
    THREE = await import(THREE_URL);
  } catch (error) {
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (error) {
    return;
  }

  THREE.ColorManagement.enabled = false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 1, 400);
  camera.position.set(0, 0, 70);

  const cloud = new THREE.Group();
  scene.add(cloud);

  const count = particleCount();
  const fields = buildFields(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(fields.positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(fields.colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(fields.sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(fields.phases, 1));
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(fields.speeds, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0.9 }
    },
    vertexShader: [
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'attribute vec3 aColor;',
      'attribute float aSize;',
      'attribute float aPhase;',
      'attribute float aSpeed;',
      'varying vec3 vColor;',
      'varying float vTwinkle;',
      'void main() {',
      '  vColor = aColor;',
      '  vec3 p = position;',
      '  p.x += sin(uTime * aSpeed + aPhase) * 2.4;',
      '  p.y += cos(uTime * aSpeed * 0.82 + aPhase) * 1.9;',
      '  p.z += sin(uTime * aSpeed * 0.61 + aPhase * 1.7) * 2.2;',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  gl_Position = projectionMatrix * mv;',
      '  gl_PointSize = aSize * uPixelRatio * (150.0 / max(-mv.z, 0.001));',
      '  vTwinkle = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime * 0.9 + aPhase * 2.7));',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform float uOpacity;',
      'varying vec3 vColor;',
      'varying float vTwinkle;',
      'void main() {',
      '  float d = length(gl_PointCoord - vec2(0.5));',
      '  if (d > 0.5) discard;',
      '  float soft = smoothstep(0.5, 0.04, d);',
      '  gl_FragColor = vec4(vColor, soft * vTwinkle * uOpacity);',
      '}'
    ].join('\n')
  });

  cloud.add(new THREE.Points(geometry, material));

  let dark = true;
  let pixelRatio = 1;

  function theme() {
    const styles = getComputedStyle(document.documentElement);
    const read = function (name, fallback) {
      const value = (styles.getPropertyValue(name) || '').trim();
      return value || fallback;
    };
    const bg = read('--bg', '#0f0f11');
    return {
      dark: luminance(bg) < 0.5,
      palette: [
        read('--accent', '#b5a642'),
        read('--gradient-start', '#a855f7'),
        read('--gradient-1', '#d946ef'),
        read('--gradient-2', '#ec4899')
      ]
    };
  }

  function paint() {
    const look = theme();
    dark = look.dark;
    const colors = look.palette.map(function (value) {
      const color = new THREE.Color(value);
      if (!dark) color.multiplyScalar(0.72);
      return color;
    });

    for (let i = 0; i < count; i++) {
      const color = Math.random() < 0.72 ? colors[0] : colors[1 + Math.floor(Math.random() * (colors.length - 1))];
      const shift = 0.85 + Math.random() * 0.35;
      fields.colors[i * 3] = Math.min(1, color.r * shift);
      fields.colors[i * 3 + 1] = Math.min(1, color.g * shift);
      fields.colors[i * 3 + 2] = Math.min(1, color.b * shift);
    }
    geometry.attributes.aColor.needsUpdate = true;

    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.uniforms.uOpacity.value = dark ? 0.9 : 0.42;
    material.needsUpdate = true;
  }

  function resize() {
    const width = stage.clientWidth || window.innerWidth;
    const height = stage.clientHeight || window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    material.uniforms.uPixelRatio.value = pixelRatio;
  }

  let frameId = 0;
  let running = false;
  let elapsed = 0;
  let last = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  function draw() {
    cloud.rotation.y = elapsed * 0.045 + pointerX * 0.32;
    cloud.rotation.x = pointerY * 0.2 + Math.sin(elapsed * 0.11) * 0.06;
    renderer.render(scene, camera);
  }

  function tick(now) {
    frameId = requestAnimationFrame(tick);
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;
    elapsed += delta;
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;
    material.uniforms.uTime.value = elapsed;
    draw();
  }

  function start() {
    if (running || reduceMotion.matches || document.hidden) return;
    running = true;
    last = 0;
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frameId);
  }

  paint();
  resize();
  draw();

  function watchTheme() {
    new MutationObserver(function () {
      paint();
      if (!running) draw();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  }

  window.addEventListener('resize', function () {
    resize();
    if (!running) draw();
  });

  if (reduceMotion.matches) {
    watchTheme();
    return;
  }

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0 }).observe(stage);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (visible) start();
  });

  window.addEventListener('pointermove', function (event) {
    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = (event.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  watchTheme();
}

function particleCount() {
  const width = window.innerWidth;
  if (width < 640) return 380;
  if (width < 1024) return 750;
  return 1250;
}

function buildFields(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 152;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 98;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 62;
    sizes[i] = 1.1 + Math.random() * 2.7;
    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.14 + Math.random() * 0.36;
  }

  return { positions, colors, sizes, phases, speeds };
}

function luminance(value) {
  const hex = String(value).trim().replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) return 0;
  const full = hex.length === 3 ? hex.split('').map(function (c) { return c + c; }).join('') : hex;
  const channels = [0, 2, 4].map(function (i) {
    return parseInt(full.slice(i, i + 2), 16) / 255;
  });
  if (channels.some(isNaN)) return 0;
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
