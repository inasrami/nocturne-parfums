<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/layout/Navbar.vue";
import CartDrawer from "./components/layout/CartDrawer.vue";
import SearchModal from "./components/layout/SearchModal.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";

const route = useRoute();
const isHome = computed(() => route.path === "/");
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <Navbar />
    <main class="flex-1" :class="{ 'page-offset': !isHome }">
      <router-view v-slot="{ Component, route: current }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="current.path" />
        </Transition>
      </router-view>
    </main>
    <SiteFooter />
    <CartDrawer />
    <SearchModal />
  </div>
</template>
