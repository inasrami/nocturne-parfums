<script setup>
import { ref } from "vue";
import { useShopStore } from "../../stores/shopStore";
import { useRouter } from "vue-router";
import { X, Plus, Minus, ShoppingBag } from "lucide-vue-next";

const store = useShopStore();
const router = useRouter();
const promoInput = ref("");
const promoStatus = ref(null);

function handlePromo() {
  const ok = store.applyPromo(promoInput.value);
  promoStatus.value = ok ? "success" : "error";
}

function goToCheckout() {
  store.isCartOpen = false;
  router.push("/checkout");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="store.isCartOpen" class="drawer-backdrop" @click="store.isCartOpen = false" />
    </Transition>

    <aside
      class="cart-drawer"
      :class="{ 'is-open': store.isCartOpen }"
      :aria-hidden="!store.isCartOpen"
      :inert="!store.isCartOpen"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <div class="drawer-heading">
        <div class="heading-label">
          <ShoppingBag class="w-4 h-4" />
          <h2>{{ store.t.cartTitle }}</h2>
          <span>{{ store.cartCount }}</span>
        </div>
        <button @click="store.isCartOpen = false" class="close-drawer" aria-label="Close shopping bag"><X class="w-5 h-5" /></button>
      </div>

      <div v-if="store.cart.length" class="shipping-note">
        <span>{{ store.amountRemainingForFreeShipping > 0 ? store.t.freeShippingRemaining(store.amountRemainingForFreeShipping) : store.t.freeShippingUnlocked }}</span>
        <div class="shipping-track">
          <span :style="{ width: `${store.freeShippingProgress}%` }" />
        </div>
      </div>

      <div class="cart-items">
        <div v-if="store.cart.length === 0" class="empty-cart">
          <ShoppingBag class="w-6 h-6" />
          <p>{{ store.t.emptyCart }}</p>
          <router-link to="/shop" @click="store.isCartOpen = false">Discover the collection</router-link>
        </div>
        <div v-for="item in store.cart" :key="item.cartKey" class="cart-item">
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <div>
              <h3>{{ item.name }}</h3>
              <p>{{ item.size }}</p>
            </div>
            <div class="item-controls">
              <div class="quantity-control">
                <button @click="store.updateQuantity(item.cartKey, -1)" :aria-label="`Remove one ${item.name}`"><Minus class="w-3 h-3" /></button>
                <span>{{ item.quantity }}</span>
                <button @click="store.updateQuantity(item.cartKey, 1)" :aria-label="`Add one ${item.name}`"><Plus class="w-3 h-3" /></button>
              </div>
              <strong>{{ item.price * item.quantity }} {{ store.t.currency }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div v-if="store.cart.length > 0" class="drawer-footer">
        <div class="promo-row">
          <input v-model="promoInput" type="text" :placeholder="store.t.promoPlaceholder" />
          <button @click="handlePromo">{{ store.t.apply }}</button>
        </div>
        <p v-if="promoStatus === 'error'" class="promo-error">Invalid code. Try NOCTURNE15</p>
        <p v-if="store.discountPercent > 0" class="promo-success">Code {{ store.promoCode }} active (-{{ store.discountPercent }}%)</p>
        <div class="totals">
          <div><span>{{ store.t.subtotal }}</span><span>{{ store.subtotal }} {{ store.t.currency }}</span></div>
          <div v-if="store.discountAmount > 0"><span>{{ store.t.discount }}</span><span>-{{ store.discountAmount }} {{ store.t.currency }}</span></div>
          <div class="total-row"><span>Total</span><strong>{{ store.finalTotal }} {{ store.t.currency }}</strong></div>
        </div>
        <button @click="goToCheckout" class="checkout-button">{{ store.t.checkoutBtn }}</button>
      </div>
    </aside>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  z-index: 49;
  inset: 0;
  background: rgba(25, 23, 19, 0.35);
}

.cart-drawer {
  position: fixed;
  z-index: 50;
  top: 0;
  right: 0;
  display: flex;
  width: min(440px, 100%);
  height: 100dvh;
  flex-direction: column;
  transform: translateX(102%);
  background: #0a0a09;
  color: #f5f2eb;
  transition: transform 350ms ease;
}

.cart-drawer.is-open {
  transform: translateX(0);
}

.drawer-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(245, 242, 235, 0.105);
}

.heading-label {
  display: flex;
  align-items: center;
  gap: 11px;
  color: #c9a96b;
}

.heading-label h2 {
  margin: 0;
  color: #f5f2eb;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 25px;
  font-weight: 500;
}

.heading-label > span {
  color: #9b9384;
  font-size: 10px;
}

.close-drawer,
.quantity-control button {
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: #a69e90;
  cursor: pointer;
}

.close-drawer {
  width: 36px;
  height: 36px;
}

.shipping-note {
  padding: 14px 24px;
  border-bottom: 1px solid rgba(245, 242, 235, 0.07);
  color: #a69e90;
  font-size: 9px;
}

.shipping-track {
  height: 2px;
  margin-top: 11px;
  background: #2a2824;
}

.shipping-track span {
  display: block;
  height: 100%;
  background: #c9a96b;
  transition: width 250ms ease;
}

.cart-items {
  flex: 1;
  overflow: auto;
  padding: 22px 24px;
}

.empty-cart {
  display: flex;
  height: 100%;
  min-height: 240px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8f8879;
  text-align: center;
}

.empty-cart p {
  max-width: 230px;
  margin: 16px 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 22px;
}

.empty-cart a {
  color: #d8c08a;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
}

.cart-item {
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(245, 242, 235, 0.084);
}

.cart-item + .cart-item {
  padding-top: 18px;
}

.cart-item > img {
  width: 76px;
  height: 92px;
  object-fit: cover;
  background: #151413;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
}

.item-info h3 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 20px;
  font-weight: 500;
}

.item-info p {
  margin: 5px 0 0;
  color: #9b9384;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.item-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(245, 242, 235, 0.126);
  padding: 3px 6px;
}

.quantity-control span {
  font-size: 10px;
}

.item-controls strong {
  color: #d8c08a;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 17px;
  font-weight: 500;
}

.drawer-footer {
  padding: 18px 24px 24px;
  border-top: 1px solid rgba(245, 242, 235, 0.105);
}

.promo-row {
  display: flex;
  gap: 8px;
}

.promo-row input {
  min-width: 0;
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(245, 242, 235, 0.126);
  border-radius: 0;
  background: transparent;
  color: #f5f2eb;
  font-size: 9px;
}

.promo-row button {
  padding: 0 13px;
  border: 1px solid #c9a96b;
  background: transparent;
  color: #d8c08a;
  cursor: pointer;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.promo-error,
.promo-success {
  margin: 7px 0 0;
  font-size: 9px;
}

.promo-error {
  color: #e0958a;
}

.promo-success {
  color: #d8c08a;
}

.totals {
  display: grid;
  gap: 8px;
  margin-top: 16px;
  color: #a69e90;
  font-size: 10px;
}

.totals > div {
  display: flex;
  justify-content: space-between;
}

.total-row {
  align-items: center;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(245, 242, 235, 0.105);
  color: #f5f2eb;
}

.total-row strong {
  color: #d8c08a;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 21px;
  font-weight: 500;
}

.checkout-button {
  width: 100%;
  min-height: 48px;
  margin-top: 16px;
  border: 1px solid #f5f2eb;
  background: #f5f2eb;
  color: #0a0a09;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>