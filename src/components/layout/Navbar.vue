<script setup>
import { useShopStore } from "../../stores/shopStore";
import { Search, ShoppingBag } from "lucide-vue-next";

const store = useShopStore();
</script>

<template>
  <header class="site-header sticky top-0 z-40">
    <div class="navigation-shell">
      <nav class="primary-nav" aria-label="Main navigation">
        <router-link to="/shop">{{ store.t.shop }}</router-link>
        <router-link to="/atelier">{{ store.t.story }}</router-link>
      </nav>

      <router-link to="/" class="brand-mark" aria-label="Nocturne home">
        <span>NOCTURNE</span>
        <small>PARFUMS · SOFIA</small>
      </router-link>

      <div class="nav-actions">
        <button @click="store.toggleLocale" class="locale-action" aria-label="Change language">
          <span>{{ store.locale }}</span>
        </button>

        <button @click="store.isSearchOpen = true" class="icon-action" aria-label="Search">
          <Search class="w-5 h-5" />
        </button>

        <button @click="store.isCartOpen = true" class="icon-action bag-action" aria-label="Open shopping bag">
          <ShoppingBag class="w-5 h-5" />
          <span v-if="store.cartCount > 0" class="bag-count">
            {{ store.cartCount }}
          </span>
          <span class="bag-label">Bag</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  color: #39342c;
  background: rgba(245, 242, 235, 0.97);
  border-bottom: 1px solid rgba(57, 52, 44, 0.12);
  backdrop-filter: blur(12px);
}

.navigation-shell {
  position: relative;
  display: grid;
  width: min(100% - 64px, 1440px);
  height: 78px;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin: 0 auto;
}

.primary-nav,
.nav-actions {
  display: flex;
  align-items: center;
}

.primary-nav {
  gap: 30px;
}

.primary-nav a,
.locale-action,
.bag-label {
  color: #71695d;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 180ms ease;
}

.primary-nav a:hover,
.locale-action:hover,
.icon-action:hover {
  color: #927950;
}

.brand-mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: #29251f;
  text-decoration: none;
}

.brand-mark span {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 29px;
  font-weight: 500;
  letter-spacing: 0.24em;
  line-height: 0.9;
}

.brand-mark small {
  color: #927950;
  font-size: 7px;
  letter-spacing: 0.28em;
}

.nav-actions {
  justify-content: flex-end;
  gap: 20px;
}

.locale-action,
.icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 6px 0;
  border: 0;
  background: transparent;
  color: #71695d;
  cursor: pointer;
  transition: color 180ms ease;
}

.icon-action {
  position: relative;
  padding: 6px;
}

.icon-action svg {
  width: 17px;
  height: 17px;
  stroke-width: 1.4;
}

.bag-action {
  gap: 9px;
}

.bag-count {
  position: absolute;
  top: -1px;
  right: -2px;
  display: grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border-radius: 50%;
  background: #927950;
  color: #fffdf8;
  font-size: 9px;
}

.bag-label {
  display: none;
}

@media (min-width: 900px) {
  .bag-label {
    display: inline;
  }
}

@media (max-width: 680px) {
  .navigation-shell {
    width: calc(100% - 32px);
    height: 72px;
    grid-template-columns: 1fr auto;
  }

  .primary-nav {
    display: none;
  }

  .brand-mark {
    align-items: flex-start;
  }

  .brand-mark span {
    font-size: 24px;
  }

  .brand-mark small {
    font-size: 6px;
  }

  .nav-actions {
    gap: 11px;
  }

  .locale-action {
    font-size: 8px;
  }

}
</style>