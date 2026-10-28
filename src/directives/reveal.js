// v-reveal: fade and rise into view once. Optional value = delay in ms.
const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const observer =
  typeof IntersectionObserver !== "undefined" && !reduced
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }),
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      )
    : null;

export default {
  mounted(el, { value }) {
    if (!observer) return;
    el.classList.add("reveal");
    if (value) el.style.transitionDelay = `${value}ms`;
    observer.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
