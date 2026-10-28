<script setup>
import Navbar from "./components/layout/Navbar.vue";
import CartDrawer from "./components/layout/CartDrawer.vue";
import SearchModal from "./components/layout/SearchModal.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <SiteFooter />
    <CartDrawer />
    <SearchModal />
  </div>
</template>