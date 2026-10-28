<script setup>
import { useShopStore } from "../stores/shopStore";
import { ArrowRight } from "lucide-vue-next";
import HeroSpray from "../components/home/HeroSpray.vue";

const store = useShopStore();
</script>

<template>
  <div class="home-page">
    <HeroSpray />

    <section class="collection" id="collection">
      <div v-reveal class="section-heading">
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
          v-for="(product, index) in store.perfumes"
          :key="product.id"
          :to="`/product/${product.id}`"
          v-reveal="index * 110"
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

    <section v-reveal class="atelier">
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
  --paper: #0a0a09;
  --ink: #f5f2eb;
  --muted: #9b9384;
  --accent: #c9a96b;
  background: var(--paper);
  color: var(--ink);
}

.overline {
  color: var(--accent);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.section-heading h2,
.atelier h2 {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 400;
}

.atelier h2 em {
  color: #d6c29d;
  font-weight: 400;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(201, 169, 107, 0.55);
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
  background: #151413;
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
  background: rgba(10, 10, 9, 0.92);
  color: #d8c08a;
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
  color: #d8c08a;
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
  background: #151413;
  text-align: center;
}

.atelier h2 {
  margin: 18px 0 24px;
  font-size: clamp(46px, 6vw, 70px);
  letter-spacing: -0.045em;
  line-height: 0.82;
}

.atelier h2 em {
  color: #c9a96b;
}

@media (max-width: 800px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 14px;
  }
}

@media (max-width: 600px) {

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
