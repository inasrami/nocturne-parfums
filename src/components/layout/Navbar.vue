<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Search, ShoppingBag } from "lucide-vue-next";
import { useShopStore } from "../../stores/shopStore";

const store = useShopStore();
const route = useRoute();
const menuOpen = ref(false);
const hidden = ref(false);
const solid = ref(false);
let lastY = 0;

// Transparent over the hero, hides while scrolling down, returns on scroll up.
function onScroll() {
  const y = window.scrollY;
  solid.value = y > 40;
  if (Math.abs(y - lastY) < 4) return;
  hidden.value = y > 160 && y > lastY && !menuOpen.value;
  lastY = y;
}
const onKey = (e) => e.key === "Escape" && (menuOpen.value = false);

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKey);
  onScroll();
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKey);
  document.documentElement.style.overflow = "";
});

watch(() => route.fullPath, () => (menuOpen.value = false));
watch(menuOpen, (open) => {
  document.documentElement.style.overflow = open ? "hidden" : "";
  if (open) hidden.value = false;
});
</script>

<template>
  <header class="site-header" :class="{ hidden, solid: solid || menuOpen }">
    <div class="bar">
      <button class="menu-btn" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <span class="lines" :class="{ open: menuOpen }"><i /><i /></span>
        <span>{{ menuOpen ? store.t.close : store.t.menu }}</span>
      </button>

      <router-link to="/" class="brand-mark" aria-label="Nocturne home">
        <span>NOCTURNE</span>
        <small>PARFUMS · SOFIA</small>
      </router-link>

      <div class="actions">
        <button class="locale" aria-label="Change language" @click="store.toggleLocale">{{ store.locale }}</button>
        <button aria-label="Search" @click="store.isSearchOpen = true"><Search class="w-5 h-5" /></button>
        <button class="bag" aria-label="Open shopping bag" @click="store.isCartOpen = true">
          <ShoppingBag class="w-5 h-5" />
          <span v-if="store.cartCount > 0" class="count">{{ store.cartCount }}</span>
        </button>
      </div>
    </div>
  </header>

  <Transition name="menu">
    <nav v-if="menuOpen" class="menu-overlay" aria-label="Main navigation">
      <div class="menu-inner">
        <router-link to="/shop" class="big" style="--i: 0">{{ store.t.shop }}</router-link>
        <router-link to="/atelier" class="big" style="--i: 1">{{ store.t.story }}</router-link>
        <div class="scents">
          <router-link
            v-for="(p, i) in store.perfumes"
            :key="p.id"
            :to="`/product/${p.id}`"
            :style="{ '--i': i + 2, '--accent': p.accentColor }"
          >
            <i /> {{ p.name }}
          </router-link>
        </div>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 40;
  color: #f5f2eb;
  border-bottom: 1px solid transparent;
  transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), background 400ms ease, border-color 400ms ease;
}
.site-header.solid {
  background: rgba(10, 10, 9, 0.78);
  border-color: rgba(245, 242, 235, 0.08);
  backdrop-filter: blur(14px);
}
.site-header.hidden {
  transform: translateY(-100%);
}
.bar {
  display: grid;
  height: 72px;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 clamp(20px, 4vw, 56px);
}
button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 250ms ease;
}
button:hover {
  color: #c9a96b;
}
.menu-btn {
  justify-self: start;
}
.lines {
  display: grid;
  width: 22px;
  gap: 6px;
}
.lines i {
  display: block;
  height: 1px;
  background: currentColor;
  transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
.lines.open i:first-child {
  transform: translateY(3.5px) rotate(45deg);
}
.lines.open i:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}
.brand-mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: inherit;
  text-decoration: none;
}
.brand-mark span {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 24px;
  letter-spacing: 0.3em;
  line-height: 0.9;
  padding-left: 0.3em;
}
.brand-mark small {
  color: #c9a96b;
  font-size: 7px;
  letter-spacing: 0.3em;
}
.actions {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 20px;
}
.bag {
  position: relative;
}
.count {
  position: absolute;
  top: -7px;
  right: -9px;
  display: grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border-radius: 50%;
  background: #c9a96b;
  color: #0a0a09;
  font-size: 8px;
  letter-spacing: 0;
}

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 38;
  display: flex;
  align-items: center;
  padding: 96px clamp(24px, 8vw, 120px) 48px;
  background: rgba(7, 7, 6, 0.97);
  backdrop-filter: blur(10px);
  overflow-y: auto;
}
.big {
  display: block;
  color: #f5f2eb;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(52px, 10vw, 128px);
  letter-spacing: -0.04em;
  line-height: 1;
  text-decoration: none;
  transition: color 300ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.big:hover {
  color: #c9a96b;
  transform: translateX(14px);
}
.scents {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 34px;
  margin-top: 44px;
  padding-top: 28px;
  border-top: 1px solid rgba(245, 242, 235, 0.12);
}
.scents a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #a69e90;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 250ms ease;
}
.scents a:hover {
  color: #f5f2eb;
}
.scents i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 450ms ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
.menu-enter-active .big,
.menu-enter-active .scents {
  transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 2) * 80ms + 120ms),
    transform 800ms cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 2) * 80ms + 120ms);
}
.menu-enter-from .big,
.menu-enter-from .scents {
  opacity: 0;
  transform: translateY(36px);
}
@media (max-width: 640px) {
  .bar {
    height: 64px;
  }
  .brand-mark span {
    font-size: 19px;
  }
  .actions {
    gap: 14px;
  }
  .menu-btn span:last-child {
    display: none;
  }
}
</style>
