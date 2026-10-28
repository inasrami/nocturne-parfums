<script setup>
import { ref, computed, watch } from "vue";
import { useShopStore } from "../stores/shopStore";
import { ArrowLeft, ShoppingBag } from "lucide-vue-next";

const props = defineProps({ id: String });
const store = useShopStore();
const product = computed(() => store.perfumes.find((item) => item.id === props.id) || store.perfumes[0]);
const selectedSize = ref("50ml");
const activeImageIndex = ref(0);

watch(
  () => props.id,
  () => {
    selectedSize.value = "50ml";
    activeImageIndex.value = 0;
  },
);

const activePrice = computed(() => {
  const variant = product.value.variants.find((item) => item.size === selectedSize.value);
  return variant ? variant.price : product.value.basePrice;
});
</script>

<template>
  <div v-if="product" class="product-page">
    <div class="product-layout">
      <section class="gallery">
        <div class="main-image">
          <img :src="product.images[activeImageIndex]" :alt="product.name" />
        </div>
        <div class="thumbnail-list" aria-label="Product images">
          <button
            v-for="(image, index) in product.images"
            :key="image"
            :class="{ active: activeImageIndex === index }"
            :aria-label="`Show product image ${index + 1}`"
            @click="activeImageIndex = index"
          >
            <img :src="image" :alt="`${product.name} view ${index + 1}`" />
          </button>
        </div>
      </section>

      <section class="product-info">
        <router-link to="/shop" class="back-link">
          <ArrowLeft class="w-4 h-4" /> Collection
        </router-link>
        <span class="overline">{{ product.subtitle[store.locale] }}</span>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ activePrice }} {{ store.t.currency }}</p>
        <p class="description">{{ product.description[store.locale] }}</p>

        <div class="size-picker">
          <div class="label-row">
            <span>Size</span>
            <span>{{ selectedSize }}</span>
          </div>
          <div class="size-options">
            <button
              v-for="variant in product.variants"
              :key="variant.size"
              :class="{ active: selectedSize === variant.size }"
              @click="selectedSize = variant.size"
            >
              {{ variant.size }}
            </button>
          </div>
        </div>

        <button class="add-to-bag" @click="store.addToCart(product, selectedSize)">
          <ShoppingBag class="w-4 h-4" /> Add to bag
        </button>

        <div class="fragrance-notes">
          <h2>Fragrance notes</h2>
          <div>
            <span>Top</span>
            <p>{{ product.notes.top[store.locale].join(" · ") }}</p>
          </div>
          <div>
            <span>Heart</span>
            <p>{{ product.notes.heart[store.locale].join(" · ") }}</p>
          </div>
          <div>
            <span>Base</span>
            <p>{{ product.notes.base[store.locale].join(" · ") }}</p>
          </div>
        </div>
        <p class="delivery-note">Complimentary delivery on orders over 300 {{ store.t.currency }}.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  min-height: 100%;
  background: #f5f2eb;
  color: #29251f;
}

.product-layout {
  display: grid;
  max-width: 1360px;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  gap: clamp(42px, 8vw, 118px);
  margin: 0 auto;
  padding: 48px clamp(22px, 6vw, 88px) 100px;
}

.gallery {
  min-width: 0;
}

.main-image {
  overflow: hidden;
  aspect-ratio: 0.91;
  background: #e9e4da;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.thumbnail-list button {
  width: 78px;
  overflow: hidden;
  aspect-ratio: 1;
  padding: 0;
  border: 1px solid transparent;
  background: #e9e4da;
  cursor: pointer;
}

.thumbnail-list button.active {
  border-color: #927950;
}

.thumbnail-list img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  align-self: start;
  padding-top: 12px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 48px;
  color: #766f63;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.overline {
  color: #927950;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.product-info h1 {
  margin: 11px 0 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(44px, 5vw, 64px);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 0.95;
}

.price {
  margin: 15px 0 0;
  color: #665638;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 25px;
}

.description {
  max-width: 420px;
  margin: 24px 0 30px;
  color: #716b60;
  font-size: 12px;
  line-height: 1.8;
}

.size-picker {
  padding: 18px 0;
  border-top: 1px solid rgba(57, 52, 44, 0.17);
  border-bottom: 1px solid rgba(57, 52, 44, 0.17);
}

.label-row {
  display: flex;
  justify-content: space-between;
  color: #766f63;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.size-options {
  display: flex;
  gap: 9px;
  margin-top: 14px;
}

.size-options button {
  min-width: 84px;
  padding: 11px 18px;
  border: 1px solid rgba(57, 52, 44, 0.2);
  background: transparent;
  color: #766f63;
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.08em;
}

.size-options button.active {
  border-color: #927950;
  color: #55462e;
}

.add-to-bag {
  display: flex;
  width: 100%;
  min-height: 51px;
  align-items: center;
  justify-content: center;
  gap: 11px;
  margin-top: 20px;
  border: 1px solid #29251f;
  background: #29251f;
  color: #f5f2eb;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background 180ms ease, color 180ms ease;
}

.add-to-bag:hover {
  background: transparent;
  color: #29251f;
}

.fragrance-notes {
  margin-top: 34px;
}

.fragrance-notes h2 {
  margin: 0 0 14px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 24px;
  font-weight: 500;
}

.fragrance-notes > div {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  padding: 11px 0;
  border-top: 1px solid rgba(57, 52, 44, 0.13);
}

.fragrance-notes span,
.fragrance-notes p {
  margin: 0;
  color: #766f63;
  font-size: 10px;
  line-height: 1.6;
}

.fragrance-notes span {
  color: #927950;
  text-transform: uppercase;
}

.delivery-note {
  margin-top: 22px;
  color: #8c8579;
  font-size: 9px;
}

@media (max-width: 800px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 30px;
    padding-top: 22px;
  }

  .product-info {
    padding-top: 0;
  }

  .back-link {
    margin-bottom: 26px;
  }
}
</style>
