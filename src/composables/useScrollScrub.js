import { onBeforeUnmount, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const headerHeight = () => 0; // header is fixed and overlays the stage

/**
 * Pins `sectionRef` and reports smoothed scroll progress (0..1) every frame.
 * Used by the home hero and the product notes stage.
 */
export function useScrollScrub(sectionRef, { distance, onProgress, enabled = () => true }) {
  let trigger;
  let tick;
  const state = { target: 0, current: 0 };

  function start() {
    if (trigger || !sectionRef.value || !enabled()) return;
    trigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: () => `top ${headerHeight()}`,
      end: () => `+=${distance()}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => (state.target = self.progress),
    });
    tick = () => {
      state.current += (state.target - state.current) * 0.14;
      if (Math.abs(state.target - state.current) < 0.0004) state.current = state.target;
      onProgress(state.current);
    };
    gsap.ticker.add(tick);
    onProgress(0);
  }

  function stop() {
    if (tick) gsap.ticker.remove(tick);
    trigger?.kill(true);
    trigger = tick = undefined;
  }

  onMounted(start);
  onBeforeUnmount(stop);
  return { start, stop };
}

/** Seek a video to a 0..1 position. Needs clips encoded with frequent keyframes. */
export function seek(video, p) {
  if (!video || !video.duration) return;
  const t = Math.min(Math.max(p, 0), 1) * (video.duration - 0.05);
  if (Math.abs(video.currentTime - t) > 0.02) video.currentTime = t;
}

export const ramp = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const isReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
