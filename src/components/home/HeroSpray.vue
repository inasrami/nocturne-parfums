<script setup>
import { computed, ref } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { useShopStore } from "../../stores/shopStore";
import { useScrollScrub, seek, ramp, easeInOut, isReducedMotion } from "../../composables/useScrollScrub";

const store = useShopStore();
const perfumes = computed(() => store.perfumes);
const P = computed(() => perfumes.value.length);

// Each scroll "advance" moves from one perfume at rest to the next:
//   0.0 - 0.5  the bottle sprays (idle -> spray clip, eased)
//   0.5 - 1.0  the spray frame dissolves into the next bottle at rest (eased, with a soft drift)
// Scroll snaps to each resting state, so one gentle scroll plays the whole move on its own timing.
const GLOW = 0.22; // soft accent light during the dissolve; set to 0 to remove

const section = ref(null);
const glow = ref(null);
const hint = ref(null);
const videos = [];
const idles = [];
const names = [];
const active = ref(0);
const fallback = ref(isReducedMotion());

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

function onProgress(p) {
  const last = P.value - 1;
  const u = p * last;
  const a = Math.min(last - 1, Math.floor(u));
  const next = a + 1;
  const l = u - a;
  const s = easeInOut(ramp(l, 0, 0.5));
  const d = easeInOut(ramp(l, 0.5, 1));

  perfumes.value.forEach((_, k) => {
    const v = videos[k];
    const im = idles[k];
    if (!v || !im) return;
    let vo = 0;
    let io = 0;
    let vt = "none";
    let vf = "none";
    let it = "none";
    let iff = "none";
    if (k === a) {
      io = l < 0.5 ? 1 : 0;
      vo = l < 0.5 ? (s > 0.001 ? 1 : 0) : 1 - d;
      if (d > 0) {
        vt = `translate3d(${-2.5 * d}%,0,0) scale(${1 + 0.04 * d})`;
        vf = `blur(${6 * d}px)`;
      }
    } else if (k === next) {
      io = Math.min(1, d * 1.45);
      if (d < 1) {
        it = `translate3d(${2.5 * (1 - d)}%,0,0) scale(${1 + 0.05 * (1 - d)})`;
        iff = `blur(${8 * (1 - d)}px)`;
      }
    }
    v.style.opacity = vo;
    v.style.transform = vt;
    v.style.filter = vf;
    im.style.opacity = io;
    im.style.transform = it;
    im.style.filter = iff;
  });
  seek(videos[a], s);

  if (glow.value) {
    const from = hexToRgb(perfumes.value[a].accentColor);
    const to = hexToRgb(perfumes.value[next].accentColor);
    const c = from.map((x, i) => Math.round(x + (to[i] - x) * d));
    glow.value.style.setProperty("--g", `rgb(${c[0]},${c[1]},${c[2]})`);
    glow.value.style.opacity = Math.sin(Math.PI * d) * GLOW;
  }

  // A name arrives during the dissolve and leaves as the next spray begins.
  let best = 0;
  let bestOpacity = -1;
  names.forEach((el, k) => {
    if (!el) return;
    const arrives = k === 0 ? 1 : ramp(u, k - 1 + 0.62, k - 1 + 0.9);
    const leaves = k === last ? 1 : 1 - ramp(u, k + 0.28, k + 0.5);
    const o = arrives * leaves;
    el.style.opacity = o;
    el.style.transform = `translateY(${(1 - o) * 18}px)`;
    el.style.pointerEvents = o > 0.6 ? "auto" : "none";
    if (o > bestOpacity) [best, bestOpacity] = [k, o];
  });
  active.value = best;
  if (hint.value) hint.value.style.opacity = 1 - ramp(p, 0, 0.03);
}

const scrub = useScrollScrub(section, {
  distance: () => window.innerHeight * (P.value - 1) * (window.innerWidth < 768 ? 0.8 : 1),
  onProgress,
  enabled: () => !fallback.value,
  snap: {
    snapTo: 1 / (P.value - 1),
    directional: true,
    duration: { min: 0.5, max: 1.4 },
    delay: 0.08,
    ease: "power2.inOut",
  },
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

    <!-- Scroll-driven version: stills sit under the videos so a dissolve reveals the next bottle -->
    <div v-if="!fallback" class="stage">
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
      <video
        v-for="(p, i) in perfumes"
        :key="`v-${p.id}`"
        :ref="(el) => (videos[i] = el)"
        :src="`/hero/${p.id}-spray.mp4`"
        muted
        playsinline
        preload="auto"
        disablepictureinpicture
        tabindex="-1"
        aria-hidden="true"
        @error="useFallback"
      />
      <div ref="glow" class="glow" />
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
.stage video,
.stage > img.idle {
  will-change: opacity, transform, filter;
}
.glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(60% 70% at 30% 52%, var(--g, #c9a96b), transparent 70%);
  mix-blend-mode: screen;
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
