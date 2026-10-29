<script setup>
import { ref } from "vue";
import { useShopStore } from "../../stores/shopStore";
import { useScrollScrub, seek, ramp, easeInOut, isReducedMotion } from "../../composables/useScrollScrub";

const props = defineProps({ product: { type: Object, required: true } });
const store = useShopStore();
const KEYS = ["top", "heart", "base"];

const section = ref(null);
const video = ref(null);
const bar = ref(null);
const groups = [];
const isStatic = ref(isReducedMotion());

// Scrolling sprays the bottle (idle -> spray clip) and reveals top, heart and base notes in turn.
function onProgress(p) {
  seek(video.value, easeInOut(p));
  groups.forEach((el, i) => {
    if (!el) return;
    const o = ramp(p, 0.12 + i * 0.28, 0.27 + i * 0.28);
    el.style.opacity = o;
    el.style.transform = `translateX(${(1 - o) * 28}px)`;
  });
  if (bar.value) bar.value.style.transform = `scaleX(${p})`;
}

const scrub = useScrollScrub(section, {
  distance: () => window.innerHeight * 2.4,
  onProgress,
  enabled: () => !isStatic.value,
});

function fail() {
  if (isStatic.value) return;
  scrub.stop();
  isStatic.value = true;
}
</script>

<template>
  <section
    ref="section"
    class="notes-stage"
    :class="{ static: isStatic }"
    :style="{ '--accent': product.accentColor }"
  >
    <video
      v-if="!isStatic"
      ref="video"
      :src="`/hero/${product.id}-spray.mp4`"
      :poster="`/hero/${product.id}-idle.jpg`"
      muted
      playsinline
      preload="auto"
      tabindex="-1"
      aria-hidden="true"
      @error="fail"
    />
    <div class="shade" />

    <div class="notes">
      <span class="eyebrow">{{ store.t.notesTitle }}</span>
      <h2>{{ product.name }}</h2>
      <div v-for="(key, i) in KEYS" :key="key" :ref="(el) => (groups[i] = el)" class="group">
        <span class="label">{{ store.t[key] }}</span>
        <p>{{ product.notes[key][store.locale].join(" · ") }}</p>
      </div>
    </div>

    <div v-if="!isStatic" class="progress"><i ref="bar" /></div>
  </section>
</template>

<style scoped>
.notes-stage {
  position: relative;
  height: 100svh;
  overflow: hidden;
  background: #050505;
  color: #f5f2eb;
}
.notes-stage.static {
  height: auto;
  min-height: 520px;
}
video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(5, 5, 5, 0) 40%, rgba(5, 5, 5, 0.7));
}
.notes {
  position: relative;
  display: grid;
  gap: 26px;
  width: min(440px, 44vw);
  height: 100%;
  align-content: center;
  margin-left: auto;
  margin-right: clamp(24px, 8vw, 120px);
}
.eyebrow,
.label {
  color: var(--accent);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
h2 {
  margin: -12px 0 6px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.92;
  text-shadow: 0 0 50px var(--accent);
}
.group {
  padding-top: 14px;
  border-top: 1px solid rgba(245, 242, 235, 0.18);
}
.notes-stage:not(.static) .group {
  opacity: 0;
}
.group p {
  margin: 8px 0 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 24px;
  line-height: 1.25;
}
.progress {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: rgba(245, 242, 235, 0.12);
}
.progress i {
  display: block;
  height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
}
@media (max-width: 767px) {
  .notes-stage {
    height: 100svh;
  }
  video {
    object-position: 24% center;
  }
  .shade {
    background: linear-gradient(0deg, rgba(5, 5, 5, 0.9), rgba(5, 5, 5, 0) 70%);
  }
  .notes {
    width: auto;
    margin: 0;
    padding: 0 24px 48px;
    align-content: end;
    gap: 16px;
  }
  .group p {
    font-size: 20px;
  }
}
</style>
