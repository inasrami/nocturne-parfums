<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { useShopStore } from "../../stores/shopStore";
import { useScrollScrub, seek, ramp, isReducedMotion } from "../../composables/useScrollScrub";

const store = useShopStore();
const perfumes = computed(() => store.perfumes);
const P = computed(() => perfumes.value.length);

// Timeline: 2 segments per perfume.
//   even segment (spray_k): scrubs that perfume's idle -> spray video
//   odd segment  (swap_k):  canvas mist grows over the end frame, the next perfume's idle still
//                           takes over at the mist peak, then the mist clears. Last swap loops to perfume 0.
const section = ref(null);
const canvas = ref(null);
const hint = ref(null);
const videos = [];
const idles = [];
const names = [];
const active = ref(0);
const fallback = ref(isReducedMotion());

let ctx;
let resizeObserver;
let shownKey = "";
let drawnKey = "";

// ---- Mist -------------------------------------------------------------------------------------
const rnd = (n) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const blobs = Array.from({ length: 26 }, (_, i) => ({
  x: 0.26 + 0.14 * rnd(i), // start near the nozzle (left third)
  y: 0.4 + 0.2 * rnd(i + 50),
  dx: 0.25 + 0.6 * rnd(i + 100), // drift to the right
  dy: (rnd(i + 150) - 0.5) * 0.3,
  r: 0.06 + 0.08 * rnd(i + 200),
  grow: 0.15 + 0.35 * rnd(i + 250),
  delay: 0.25 * rnd(i + 300),
}));
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

function resize() {
  const c = canvas.value;
  if (!c) return;
  c.width = Math.round(c.clientWidth * 0.5); // mist is soft, half resolution is plenty
  c.height = Math.round(c.clientHeight * 0.5);
  drawnKey = "";
}

function clearMist() {
  if (!ctx || drawnKey === "off") return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawnKey = "off";
}

function drawMist(s, from, to) {
  if (!ctx) return;
  const key = `${from}-${to}-${s.toFixed(3)}`;
  if (key === drawnKey) return;
  drawnKey = key;

  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  const env = s < 0.5 ? s * 2 : (1 - s) * 2; // 0 -> 1 at the swap point -> 0
  if (env <= 0.002) return;

  const a = hexToRgb(perfumes.value[from].accentColor);
  const b = hexToRgb(perfumes.value[to].accentColor);
  const [r, g, bl] = a.map((v, i) => Math.round(v + (b[i] - v) * s));
  const m = Math.max(w, h);

  // Dense tinted cover that hides the swap, then glowing plumes on top.
  ctx.fillStyle = `rgba(${(r * 0.45) | 0},${(g * 0.45) | 0},${(bl * 0.45) | 0},${env ** 2.2 * 0.96})`;
  ctx.fillRect(0, 0, w, h);

  for (const o of blobs) {
    const u = Math.min(1, Math.max(0, (s - o.delay) / (1 - o.delay)));
    const x = (o.x + o.dx * u) * w;
    const y = (o.y + o.dy * u) * h;
    const rad = (o.r + o.grow * u) * m;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, `rgba(${r},${g},${bl},${0.55 * env})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${bl},${0.25 * env})`);
    grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
}

onMounted(() => {
  if (!canvas.value) return;
  ctx = canvas.value.getContext("2d");
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.value);
});
onBeforeUnmount(() => resizeObserver?.disconnect());

// ---- Scroll -----------------------------------------------------------------------------------
function onProgress(p) {
  const n = P.value * 2;
  const t = p * n;
  const seg = Math.min(n - 1, Math.floor(t));
  const local = t - seg;
  const k = seg >> 1;
  const swap = seg % 2 === 1;
  const next = (k + 1) % P.value;

  // Exactly one layer is visible: video k, or (after the mist peak) the next perfume's idle still.
  const key = !swap || local < 0.5 ? `v${k}` : `i${next}`;
  if (key !== shownKey) {
    shownKey = key;
    videos.forEach((v, i) => v && (v.style.opacity = key === `v${i}` ? 1 : 0));
    idles.forEach((im, i) => im && (im.style.opacity = key === `i${i}` ? 1 : 0));
  }

  if (!swap) {
    seek(videos[k], local);
    clearMist();
  } else {
    if (local < 0.5) seek(videos[k], 1);
    drawMist(local, k, next);
  }

  // A name arrives while the mist peaks and leaves at the start of its own swap.
  let best = 0;
  let bestOpacity = -1;
  names.forEach((el, i) => {
    if (!el) return;
    const leaves = 1 - ramp(t, 2 * i + 1, 2 * i + 1.4);
    const arrivalStart = (i === 0 ? 2 * P.value - 1 : 2 * (i - 1) + 1) + 0.45;
    const arrives = ramp(t, arrivalStart, arrivalStart + 0.35);
    const o = i === 0 ? Math.min(1, leaves + arrives) : arrives * leaves;
    el.style.opacity = o;
    el.style.transform = `translateY(${(1 - o) * 18}px)`;
    el.style.pointerEvents = o > 0.6 ? "auto" : "none";
    if (o > bestOpacity) [best, bestOpacity] = [i, o];
  });
  active.value = best;
  if (hint.value) hint.value.style.opacity = 1 - ramp(p, 0, 0.03);
}

const scrub = useScrollScrub(section, {
  distance: () => window.innerHeight * P.value * 2 * (window.innerWidth < 768 ? 0.6 : 0.8),
  onProgress,
  enabled: () => !fallback.value,
});

function useFallback() {
  if (fallback.value) return;
  scrub.stop();
  fallback.value = true;
}

// Fallback (reduced motion or clips missing): tap-to-spray slider with stills.
const fi = ref(0);
const sprayed = ref(false);
const go = (d) => {
  fi.value = (fi.value + d + P.value) % P.value;
  sprayed.value = false;
};
const hide = (e) => (e.target.style.visibility = "hidden");
const skip = () => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
</script>

<template>
  <section ref="section" class="hero-spray" aria-label="Nocturne fragrances">
    <ul class="sr-only">
      <li v-for="p in perfumes" :key="p.id">
        <router-link :to="`/product/${p.id}`">{{ p.name }}</router-link>
      </li>
    </ul>

    <!-- Scroll-scrubbed version -->
    <div v-if="!fallback" class="stage">
      <video
        v-for="(p, i) in perfumes"
        :key="`v-${p.id}`"
        :ref="(el) => (videos[i] = el)"
        :src="`/hero/${p.id}-spray.mp4`"
        :poster="`/hero/${p.id}-idle.jpg`"
        muted
        playsinline
        preload="auto"
        disablepictureinpicture
        tabindex="-1"
        aria-hidden="true"
        @error="useFallback"
      />
      <img
        v-for="(p, i) in perfumes"
        :key="`i-${p.id}`"
        :ref="(el) => (idles[i] = el)"
        class="idle"
        :src="`/hero/${p.id}-idle.jpg`"
        alt=""
        aria-hidden="true"
        @error="hide"
      />
      <canvas ref="canvas" class="mist" aria-hidden="true" />
      <div class="shade" />

      <span class="overline brand">NOCTURNE · SOFIA</span>
      <span class="counter">0{{ active + 1 }} / 0{{ P }}</span>

      <div class="names">
        <div
          v-for="(p, k) in perfumes"
          :key="p.id"
          :ref="(el) => (names[k] = el)"
          class="name-block"
          :style="{ '--accent': p.accentColor }"
        >
          <span class="note-line">{{ p.subtitle[store.locale] }}</span>
          <h2>{{ p.name }}</h2>
          <router-link :to="`/product/${p.id}`" class="cta">
            {{ store.t.discover }} <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <span ref="hint" class="hint">{{ store.t.scrollHint }}</span>
      <button class="skip" @click="skip">{{ store.t.shop }} ↓</button>
    </div>

    <!-- Fallback version -->
    <div v-else class="stage fallback">
      <img
        :src="`/hero/${perfumes[fi].id}-${sprayed ? 'spray' : 'idle'}.jpg`"
        :alt="perfumes[fi].name"
        @error="hide"
      />
      <div class="shade" />
      <span class="overline brand">NOCTURNE · SOFIA</span>
      <div class="names">
        <div class="name-block" :style="{ '--accent': perfumes[fi].accentColor }">
          <span class="note-line">{{ perfumes[fi].subtitle[store.locale] }}</span>
          <h2>{{ perfumes[fi].name }}</h2>
          <button class="cta" @click="sprayed = !sprayed">{{ store.t.sprayToggle }}</button>
          <router-link :to="`/product/${perfumes[fi].id}`" class="cta">
            {{ store.t.discover }} <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
      <div class="pager">
        <button aria-label="Previous" @click="go(-1)">←</button>
        <button aria-label="Next" @click="go(1)">→</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-spray {
  position: relative;
  height: 100svh;
  background: #050505;
  color: #f5f2eb;
  overflow: hidden;
}
.stage,
.stage video,
.stage > img,
.shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.stage video,
.stage > img {
  object-fit: cover;
  object-position: center;
}
.stage video,
.stage > img.idle,
.name-block {
  opacity: 0;
}
.mist {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.fallback .name-block {
  opacity: 1;
}
.shade {
  pointer-events: none;
  background: linear-gradient(90deg, rgba(5, 5, 5, 0) 45%, rgba(5, 5, 5, 0.55));
}
.brand {
  display: none;
  position: absolute;
  top: 28px;
  left: clamp(24px, 6vw, 88px);
  color: #d9c49c;
  font-size: 9px;
  letter-spacing: 0.2em;
}
.counter {
  position: absolute;
  bottom: 26px;
  left: clamp(24px, 6vw, 88px);
  color: rgba(245, 242, 235, 0.6);
  font-size: 9px;
  letter-spacing: 0.2em;
}
.names {
  position: absolute;
  inset: 0;
  right: clamp(24px, 8vw, 120px);
  display: grid;
  place-items: center end;
}
.name-block {
  --accent: #d9c49c;
  grid-area: 1 / 1;
  width: min(440px, 42vw);
  will-change: opacity, transform;
}
.note-line {
  color: var(--accent);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.name-block h2 {
  margin: 14px 0 26px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(50px, 6vw, 92px);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 0.9;
  text-shadow: 0 0 60px var(--accent);
}
.cta {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-right: 22px;
  padding: 0 0 8px;
  border: 0;
  border-bottom: 1px solid var(--accent);
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.13em;
  text-decoration: none;
  text-transform: uppercase;
}
.hint,
.skip {
  position: absolute;
  bottom: 26px;
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245, 242, 235, 0.6);
}
.hint {
  left: 50%;
  transform: translateX(-50%);
}
.skip {
  right: clamp(24px, 6vw, 88px);
  border: 0;
  background: none;
  cursor: pointer;
}
.pager {
  position: absolute;
  bottom: 22px;
  left: clamp(24px, 6vw, 88px);
  display: flex;
  gap: 10px;
}
.pager button {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(245, 242, 235, 0.3);
  background: none;
  color: inherit;
  cursor: pointer;
}

@media (max-width: 767px) {
  .hero-spray {
    height: 100svh;
  }
  .stage video,
  .stage > img {
    object-position: 24% center;
  }
  .shade {
    background: linear-gradient(0deg, rgba(5, 5, 5, 0.85), rgba(5, 5, 5, 0) 60%);
  }
  .names {
    right: 0;
    place-items: end start;
    padding: 0 24px 84px;
  }
  .name-block {
    width: 100%;
  }
  .name-block h2 {
    margin: 10px 0 18px;
    font-size: clamp(44px, 14vw, 64px);
  }
}
</style>
