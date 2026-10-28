<script setup>
import { ref, computed } from "vue";
import { useShopStore } from "../stores/shopStore";
import { ArrowRight } from "lucide-vue-next";

const store = useShopStore();
const selectedCategory = ref("all");
const sortBy = ref("featured");
const categories = ["all", "woody", "amber", "floral", "fresh"];

const filteredProducts = computed(() => {
  let products = [...store.perfumes];
  if (selectedCategory.value !== "all") {
    products = products.filter((product) => product.category === selectedCategory.value);
  }
  if (sortBy.value === "price-asc") products.sort((a, b) => a.basePrice - b.basePrice);
  if (sortBy.value === "price-desc") products.sort((a, b) => b.basePrice - a.basePrice);
  return products;
});
</script>

<template>
  <div class="shop-page">
    <header class="shop-intro">
      <span class="overline">Nocturne parfums</span>
      <h1>The collection</h1>
      <p>Four distinct expressions. Find the one that feels like you.</p>
    </header>

    <section class="shop-content">
      <div class="shop-toolbar">
        <div class="category-list" aria-label="Filter by fragrance family">
          <button
            v-for="category in categories"
            :key="category"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <label class="sort-control">
          <span>Sort</span>
          <select v-model="sortBy" aria-label="Sort fragrances">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <div class="product-grid">
        <article v-for="product in filteredProducts" :key="product.id" class="product-card">
          <router-link :to="`/product/${product.id}`" class="product-image">
            <img :src="product.images[0]" :alt="product.name" loading="lazy" />
            <span v-if="product.isNew" class="new-label">New</span>
            <span class="discover-link">Discover <ArrowRight class="w-4 h-4" /></span>
          </router-link>
          <div class="product-details">
            <router-link :to="`/product/${product.id}`" class="product-title">
              <h2>{{ product.name }}</h2>
              <p>{{ product.subtitle[store.locale] }}</p>
            </router-link>
            <div class="product-buy">
              <span>{{ product.basePrice }} {{ store.t.currency }}</span>
              <button @click="store.addToCart(product)">Add to bag</button>
            </div>
          </div>
        </article>
        <p v-if="filteredProducts.length === 0" class="empty-state">No fragrances in this collection yet.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.shop-page {
  min-height: 100%;
  background: #f5f2eb;
  color: #29251f;
}

.shop-intro {
  padding: 78px 24px 54px;
  background: #ede8de;
  text-align: center;
}

.overline {
  color: #927950;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.shop-intro h1 {
  margin: 12px 0 8px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(52px, 7vw, 78px);
  font-weight: 400;
  letter-spacing: -0.05em;
  line-height: 0.9;
}

.shop-intro p {
  margin: 0;
  color: #817a6e;
  font-size: 11px;
  letter-spacing: 0.03em;
}

.shop-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 36px clamp(20px, 6vw, 88px) 100px;
}

.shop-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 27px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(57, 52, 44, 0.17);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 21px;
}

.category-list button,
.sort-control,
.sort-control select {
  color: #766f63;
  font-family: inherit;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.category-list button {
  padding: 5px 0;
  border: 0;
  border-bottom: 1px solid transparent;
  background: none;
  cursor: pointer;
  text-transform: capitalize;
}

.category-list button.active {
  border-color: #927950;
  color: #55462e;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-control select {
  padding: 6px 20px 6px 0;
  border: 0;
  background: transparent;
  color: #39342c;
  cursor: pointer;
}

.sort-control select:focus-visible {
  outline-offset: 2px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 38px 20px;
}

.product-card {
  min-width: 0;
}

.product-image {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 0.8;
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
  top: 13px;
  right: 13px;
  padding: 7px 9px;
  background: rgba(245, 242, 235, 0.94);
  color: #5f5139;
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.discover-link {
  position: absolute;
  right: 16px;
  bottom: 14px;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 9px;
  letter-spacing: 0.14em;
  opacity: 0;
  text-transform: uppercase;
  transition: opacity 180ms ease;
}

.product-image::after {
  position: absolute;
  inset: 55% 0 0;
  content: "";
  background: linear-gradient(transparent, rgba(20, 17, 13, 0.45));
  opacity: 0;
  transition: opacity 180ms ease;
}

.product-card:hover .discover-link,
.product-card:hover .product-image::after {
  opacity: 1;
}

.product-details {
  padding-top: 14px;
}

.product-title {
  color: inherit;
  text-decoration: none;
}

.product-title h2 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1;
}

.product-title p {
  margin: 7px 0 0;
  color: #817a6e;
  font-size: 9px;
}

.product-buy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(57, 52, 44, 0.15);
  color: #665638;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 18px;
}

.product-buy button {
  padding: 7px 0;
  border: 0;
  border-bottom: 1px solid rgba(146, 121, 80, 0.45);
  background: transparent;
  color: #665638;
  cursor: pointer;
  font-family: Inter, sans-serif;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 80px 0;
  color: #817a6e;
  text-align: center;
}

@media (max-width: 760px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px 14px;
  }
}

@media (max-width: 520px) {
  .shop-intro {
    padding: 58px 18px 40px;
  }

  .shop-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .category-list {
    gap: 16px;
  }

  .category-list button,
  .sort-control,
  .sort-control select {
    font-size: 8px;
  }

  .product-title h2 {
    font-size: 21px;
  }

  .product-title p {
    font-size: 8px;
    line-height: 1.45;
  }
}
</style>
