<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useShopStore } from "../stores/shopStore";
import { ArrowLeft, ShoppingBag } from "lucide-vue-next";
import NotesStage from "../components/product/NotesStage.vue";

const props = defineProps({ id: String });
const store = useShopStore();
const product = computed(() => store.perfumes.find((item) => item.id === props.id) || store.perfumes[0]);
const selectedSize = ref("50ml");
const activeImageIndex = ref(0);

const variant = computed(() => product.value.variants.find((v) => v.size === selectedSize.value));
const activePrice = computed(() => (variant.value ? variant.value.price : product.value.basePrice));
const soldOut = computed(() => !variant.value || variant.value.stock === 0);
const lowStock = computed(() => !soldOut.value && variant.value.stock <= 6);
const related = computed(() =>
  (product.value.completeTheLookIds || []).map((id) => store.perfumes.find((p) => p.id === id)).filter(Boolean),
);

watch(
  () => props.id,
  () => {
    selectedSize.value = "50ml";
    activeImageIndex.value = 0;
    window.scrollTo(0, 0);
  },
);

// Sticky add-to-bag bar once the main button has scrolled out of view (above the viewport).
const addButton = ref(null);
const showBar = ref(false);
let observer;
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => (showBar.value = !entry.isIntersecting && entry.boundingClientRect.top < 0),
    { rootMargin: "0px" },
  );
  if (addButton.value) observer.observe(addButton.value);
});
onBeforeUnmount(() => observer?.disconnect());
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
          <ArrowLeft class="w-4 h-4" /> {{ store.t.shop }}
        </router-link>
        <span class="overline">{{ product.subtitle[store.locale] }}</span>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ activePrice }} {{ store.t.currency }}</p>
        <p class="description">{{ product.description[store.locale] }}</p>

        <div class="size-picker">
          <div class="label-row">
            <span>{{ store.t.size }}</span>
            <span v-if="lowStock" class="low-stock">{{ store.t.onlyLeft(variant.stock) }}</span>
            <span v-else>{{ selectedSize }}</span>
          </div>
          <div class="size-options">
            <button
              v-for="v in product.variants"
              :key="v.size"
              :class="{ active: selectedSize === v.size }"
              :disabled="v.stock === 0"
              @click="selectedSize = v.size"
            >
              {{ v.size }}
            </button>
          </div>
        </div>

        <button ref="addButton" class="add-to-bag" :disabled="soldOut" @click="store.addToCart(product, selectedSize)">
          <ShoppingBag class="w-4 h-4" /> {{ soldOut ? store.t.soldOut : store.t.addToBag }}
        </button>

        <div class="fragrance-notes">
          <h2>{{ store.t.notesTitle }}</h2>
          <div v-for="key in ['top', 'heart', 'base']" :key="key">
            <span>{{ store.t[key] }}</span>
            <p>{{ product.notes[key][store.locale].join(" · ") }}</p>
          </div>
        </div>
        <p class="delivery-note">{{ store.t.deliveryNote(300) }}</p>
      </section>
    </div>

    <NotesStage :key="product.id" :product="product" />

    <section v-if="related.length" class="complete-look">
      <h2>{{ store.t.completeLook }}</h2>
      <div class="look-grid">
        <router-link v-for="item in related" :key="item.id" :to="`/product/${item.id}`" class="look-card">
          <img :src="item.images[0]" :alt="item.name" loading="lazy" />
          <div>
            <h3>{{ item.name }}</h3>
            <span>{{ item.basePrice }} {{ store.t.currency }}</span>
          </div>
        </router-link>
      </div>
    </section>

    <Transition name="bar">
      <div v-if="showBar" class="sticky-bar">
        <div>
          <strong>{{ product.name }}</strong>
          <span>{{ selectedSize }} · {{ activePrice }} {{ store.t.currency }}</span>
        </div>
        <button :disabled="soldOut" @click="store.addToCart(product, selectedSize)">
          <ShoppingBag class="w-4 h-4" /> {{ soldOut ? store.t.soldOut : store.t.addToBag }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.product-page {
  min-height: 100%;
  background: #0a0a09;
  color: #f5f2eb;
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
  background: #151413;
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
  background: #151413;
  cursor: pointer;
}

.thumbnail-list button.active {
  border-color: #c9a96b;
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
  color: #a69e90;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.overline {
  color: #c9a96b;
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
  color: #d8c08a;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 25px;
}

.description {
  max-width: 420px;
  margin: 24px 0 30px;
  color: #a69e90;
  font-size: 12px;
  line-height: 1.8;
}

.size-picker {
  padding: 18px 0;
  border-top: 1px solid rgba(245, 242, 235, 0.119);
  border-bottom: 1px solid rgba(245, 242, 235, 0.119);
}

.label-row {
  display: flex;
  justify-content: space-between;
  color: #a69e90;
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
  border: 1px solid rgba(245, 242, 235, 0.14);
  background: transparent;
  color: #a69e90;
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.08em;
}

.size-options button.active {
  border-color: #c9a96b;
  color: #e6d3a8;
}

.add-to-bag {
  display: flex;
  width: 100%;
  min-height: 51px;
  align-items: center;
  justify-content: center;
  gap: 11px;
  margin-top: 20px;
  border: 1px solid #f5f2eb;
  background: #f5f2eb;
  color: #0a0a09;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background 180ms ease, color 180ms ease;
}

.add-to-bag:hover {
  background: transparent;
  color: #f5f2eb;
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
  border-top: 1px solid rgba(245, 242, 235, 0.091);
}

.fragrance-notes span,
.fragrance-notes p {
  margin: 0;
  color: #a69e90;
  font-size: 10px;
  line-height: 1.6;
}

.fragrance-notes span {
  color: #c9a96b;
  text-transform: uppercase;
}

.delivery-note {
  margin-top: 22px;
  color: #8f8879;
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

<style scoped>
.low-stock {
  color: #e0a070;
}
.size-options button:disabled,
.add-to-bag:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
.complete-look {
  width: min(100% - 64px, 1440px);
  margin: 0 auto;
  padding: 72px 0 96px;
}
.complete-look h2 {
  margin: 0 0 28px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 36px;
  font-weight: 400;
}
.look-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 280px));
  gap: 24px;
}
.look-card {
  color: inherit;
  text-decoration: none;
}
.look-card img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: #151413;
}
.look-card > div {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}
.look-card h3 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 22px;
  font-weight: 500;
}
.look-card span {
  color: #d8c08a;
  font-size: 12px;
}
.sticky-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px clamp(16px, 4vw, 64px) calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid rgba(245, 242, 235, 0.105);
  background: rgba(10, 10, 9, 0.96);
  backdrop-filter: blur(12px);
}
.sticky-bar strong {
  display: block;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 20px;
  font-weight: 500;
}
.sticky-bar span {
  color: #a69e90;
  font-size: 10px;
}
.sticky-bar button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  border: 0;
  background: #f5f2eb;
  color: #0a0a09;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.sticky-bar button:disabled {
  opacity: 0.4;
}
.bar-enter-active,
.bar-leave-active {
  transition: transform 260ms ease, opacity 260ms ease;
}
.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
