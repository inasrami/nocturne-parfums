<script setup>
import { useShopStore } from "../stores/shopStore";
import { ArrowRight } from "lucide-vue-next";

const store = useShopStore();
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <img
        class="hero-image"
        src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1800&q=88"
        alt="A bottle of perfume in soft natural light"
      />
      <div class="hero-copy">
        <span class="overline">NOCTURNE · SOFIA</span>
        <h1>A quieter kind<br />of <em>luxury.</em></h1>
        <router-link to="/shop" class="text-link">
          Discover the collection <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
      <span class="hero-caption">Eau de parfum · Made to be remembered</span>
    </section>

    <section class="collection" id="collection">
      <div class="section-heading">
        <div>
          <span class="overline">The collection</span>
          <h2>Find your signature.</h2>
        </div>
        <router-link to="/shop" class="text-link">
          View all <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <div class="product-grid">
        <router-link
          v-for="product in store.perfumes"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.images[0]" :alt="product.name" loading="lazy" />
            <span v-if="product.isNew" class="new-label">New</span>
          </div>
          <div class="product-meta">
            <div>
              <h3>{{ product.name }}</h3>
              <p>{{ product.subtitle[store.locale] }}</p>
            </div>
            <span>{{ product.basePrice }} {{ store.t.currency }}</span>
          </div>
        </router-link>
      </div>
    </section>

    <section class="atelier">
      <span class="overline">The Nocturne atelier</span>
      <h2>Made slowly.<br /><em>Worn forever.</em></h2>
      <router-link to="/atelier" class="text-link">
        Our story <ArrowRight class="w-4 h-4" />
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  --paper: #f5f2eb;
  --ink: #29251f;
  --muted: #817a6e;
  --accent: #927950;
  background: var(--paper);
  color: var(--ink);
}

.hero {
  position: relative;
  display: flex;
  min-height: min(680px, calc(100svh - 110px));
  align-items: center;
  overflow: hidden;
  background: #d7d1c5;
}

.hero::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(90deg, rgba(28, 26, 22, 0.53), rgba(28, 26, 22, 0.05) 76%);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 52%;
}

.hero-copy {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - 96px));
  margin: 0 auto;
  padding: 80px 0;
  color: #fbf8f1;
}

.overline {
  color: var(--accent);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero .overline {
  color: #e8dbc1;
}

.hero h1,
.section-heading h2,
.atelier h2 {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 400;
}

.hero h1 {
  margin: 24px 0 30px;
  font-size: clamp(62px, 8vw, 104px);
  letter-spacing: -0.045em;
  line-height: 0.82;
}

.hero h1 em,
.atelier h2 em {
  color: #d6c29d;
  font-weight: 400;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(146, 121, 80, 0.55);
  color: inherit;
  font-size: 9px;
  letter-spacing: 0.13em;
  text-decoration: none;
  text-transform: uppercase;
  transition: gap 180ms ease;
}

.text-link:hover {
  gap: 20px;
}

.hero .text-link {
  border-color: rgba(232, 219, 193, 0.6);
  color: #fbf8f1;
}

.hero-caption {
  position: absolute;
  z-index: 1;
  right: 48px;
  bottom: 30px;
  color: rgba(251, 248, 241, 0.8);
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.collection {
  max-width: 1440px;
  margin: 0 auto;
  padding: 100px clamp(24px, 6vw, 88px) 110px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 34px;
}

.section-heading h2 {
  margin: 8px 0 0;
  font-size: clamp(38px, 4vw, 52px);
  letter-spacing: -0.04em;
  line-height: 1;
}

.section-heading > .text-link {
  margin-bottom: 5px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.product-card {
  min-width: 0;
  color: var(--ink);
  text-decoration: none;
}

.product-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 0.78;
  background: #e9e4da;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.035);
}

.new-label {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 7px 9px;
  background: rgba(245, 242, 235, 0.92);
  color: #5f5139;
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-top: 14px;
}

.product-meta h3 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1;
}

.product-meta p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}

.product-meta > span {
  color: #6d5b3e;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 16px;
  white-space: nowrap;
}

.atelier {
  display: flex;
  min-height: 310px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 62px 24px;
  background: #e9e4da;
  text-align: center;
}

.atelier h2 {
  margin: 18px 0 24px;
  font-size: clamp(46px, 6vw, 70px);
  letter-spacing: -0.045em;
  line-height: 0.82;
}

.atelier h2 em {
  color: #8d7651;
}

@media (max-width: 800px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 14px;
  }
}

@media (max-width: 600px) {
  .hero {
    min-height: 620px;
    align-items: flex-end;
  }

  .hero::after {
    background: linear-gradient(0deg, rgba(28, 26, 22, 0.66), rgba(28, 26, 22, 0.03) 85%);
  }

  .hero-image {
    object-position: 55% center;
  }

  .hero-copy {
    width: calc(100% - 48px);
    padding: 80px 0 76px;
  }

  .hero h1 {
    font-size: clamp(62px, 15vw, 82px);
  }

  .hero-caption {
    right: 24px;
    bottom: 22px;
    font-size: 7px;
  }

  .collection {
    padding: 68px 18px 76px;
  }

  .section-heading h2 {
    font-size: 38px;
  }

  .product-meta {
    flex-direction: column;
  }

  .product-meta h3 {
    font-size: 20px;
  }

  .product-meta > span {
    font-size: 15px;
  }
}
</style>
