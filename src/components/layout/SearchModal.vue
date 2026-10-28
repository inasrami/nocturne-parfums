<script setup>
import { ref, computed } from "vue";
import { useShopStore } from "../../stores/shopStore";
import { useRouter } from "vue-router";
import { Search, X } from "lucide-vue-next";

const store = useShopStore();
const router = useRouter();
const query = ref("");

const results = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return store.perfumes.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) ||
    Object.values(p.notes.top[store.locale]).some(n => n.toLowerCase().includes(q))
  );
});

function selectItem(id) {
  store.isSearchOpen = false;
  router.push(`/product/${id}`);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="store.isSearchOpen"
      class="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search fragrances"
      @click.self="store.isSearchOpen = false"
    >
      <button @click="store.isSearchOpen = false" class="close-button" aria-label="Close search"><X class="w-5 h-5" /></button>
      <div class="search-content">
        <div class="search-field">
          <Search class="w-5 h-5" />
          <input v-model="query" autofocus type="text" :placeholder="store.t.searchPlaceholder" />
        </div>
        <div class="search-results">
          <button v-for="item in results" :key="item.id" @click="selectItem(item.id)" class="search-result">
            <img :src="item.images[0]" :alt="item.name" />
            <span>
              <strong>{{ item.name }}</strong>
              <small>{{ item.subtitle[store.locale] }}</small>
            </span>
            <span class="result-price">{{ item.basePrice }} {{ store.t.currency }}</span>
          </button>
          <p v-if="query && results.length === 0" class="no-results">No matching fragrances.</p>
          <div v-if="!query" class="search-hint">
            <span>Try a fragrance or note</span>
            <router-link to="/shop" @click="store.isSearchOpen = false">Browse collection</router-link>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 18vh 24px 48px;
  background: rgba(10, 10, 9, 0.97);
}

.close-button {
  position: absolute;
  top: 26px;
  right: 28px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(245, 242, 235, 0.126);
  border-radius: 50%;
  background: transparent;
  color: #ece7dc;
  cursor: pointer;
}

.search-content {
  width: min(680px, 100%);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 0 13px;
  border-bottom: 1px solid #c9a96b;
  color: #c9a96b;
}

.search-field input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f5f2eb;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(24px, 4vw, 36px);
}

.search-field input::placeholder {
  color: #8f8879;
}

.search-results {
  margin-top: 20px;
}

.search-result {
  display: grid;
  width: 100%;
  grid-template-columns: 56px 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid rgba(245, 242, 235, 0.084);
  background: transparent;
  color: #f5f2eb;
  cursor: pointer;
  text-align: left;
}

.search-result:hover strong {
  color: #c9a96b;
}

.search-result img {
  width: 56px;
  height: 66px;
  object-fit: cover;
  background: #151413;
}

.search-result > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-result strong {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 20px;
  font-weight: 500;
}

.search-result small,
.result-price,
.no-results,
.search-hint {
  color: #9b9384;
  font-size: 9px;
}

.result-price {
  white-space: nowrap;
}

.no-results,
.search-hint {
  padding: 14px 0;
}

.search-hint {
  display: flex;
  justify-content: space-between;
}

.search-hint a {
  color: #d8c08a;
  text-decoration: none;
}
</style>