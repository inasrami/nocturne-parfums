import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ShopView from "../views/ShopView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import AtelierView from "../views/AtelierView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: ShopView },
  { path: "/product/:id", name: "product", component: ProductDetailView, props: true },
  { path: "/checkout", name: "checkout", component: CheckoutView },
  { path: "/atelier", name: "atelier", component: AtelierView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  // wait for the page fade-out before jumping to the top
  scrollBehavior(to, from, saved) {
    return new Promise((resolve) => setTimeout(() => resolve(saved || { top: 0 }), 380));
  },
});