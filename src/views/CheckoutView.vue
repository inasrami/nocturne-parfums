<script setup>
import { ref } from "vue";
import { useShopStore } from "../stores/shopStore";
import { useRouter } from "vue-router";
import { Check } from "lucide-vue-next";

const store = useShopStore();
const router = useRouter();

const form = ref({
  fullName: "",
  email: "",
  phone: "",
  city: "София",
  deliveryType: "econt",
  officeName: "",
});
const orderPlaced = ref(false);

function submitOrder() {
  orderPlaced.value = true;
  store.clearCart();
}
</script>

<template>
  <div class="checkout-page">
    <div v-if="!orderPlaced" class="checkout-content">
      <header class="checkout-heading">
        <span class="overline">Nocturne parfums</span>
        <h1>Checkout</h1>
      </header>

      <form class="checkout-layout" @submit.prevent="submitOrder">
        <div class="checkout-form">
          <section class="form-section">
            <h2>Contact</h2>
            <label>
              <span>Full name</span>
              <input v-model="form.fullName" required autocomplete="name" />
            </label>
            <div class="field-row">
              <label>
                <span>Email</span>
                <input v-model="form.email" required type="email" autocomplete="email" />
              </label>
              <label>
                <span>Phone</span>
                <input v-model="form.phone" required type="tel" autocomplete="tel" />
              </label>
            </div>
          </section>

          <section class="form-section">
            <h2>Delivery</h2>
            <div class="delivery-options">
              <button
                type="button"
                :class="{ active: form.deliveryType === 'econt' }"
                @click="form.deliveryType = 'econt'"
              >Econt</button>
              <button
                type="button"
                :class="{ active: form.deliveryType === 'speedy' }"
                @click="form.deliveryType = 'speedy'"
              >Speedy</button>
            </div>
            <div class="field-row">
              <label>
                <span>City</span>
                <input v-model="form.city" required autocomplete="address-level2" />
              </label>
              <label>
                <span>Office or delivery address</span>
                <input v-model="form.officeName" required autocomplete="street-address" />
              </label>
            </div>
          </section>

          <section class="form-section payment-section">
            <h2>Payment</h2>
            <div class="payment-method">
              <span>Cash on delivery</span>
              <span>Included</span>
            </div>
          </section>
        </div>

        <aside class="order-summary">
          <h2>Your order</h2>
          <div v-for="item in store.cart" :key="item.cartKey" class="summary-item">
            <img :src="item.image" :alt="item.name" />
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.size }} · Qty {{ item.quantity }}</span>
            </div>
            <span>{{ item.price * item.quantity }} {{ store.t.currency }}</span>
          </div>
          <p v-if="store.cart.length === 0" class="empty-cart">
            Your bag is empty.
            <router-link to="/shop">Browse the collection</router-link>
          </p>
          <div class="summary-total">
            <span>Total</span>
            <strong>{{ store.finalTotal }} {{ store.t.currency }}</strong>
          </div>
          <button class="place-order" type="submit" :disabled="store.cart.length === 0">
            Place order
          </button>
        </aside>
      </form>
    </div>

    <section v-else class="order-confirmation">
      <span class="confirmation-icon"><Check class="w-6 h-6" /></span>
      <span class="overline">Thank you</span>
      <h1>Your order is confirmed.</h1>
      <p>We’ll be in touch with delivery details shortly.</p>
      <button @click="router.push('/shop')">Return to the collection</button>
    </section>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 100%;
  background: #0a0a09;
  color: #f5f2eb;
}

.checkout-content {
  max-width: 1160px;
  margin: 0 auto;
  padding: 64px 26px 100px;
}

.checkout-heading {
  margin-bottom: 32px;
}

.overline {
  color: #c9a96b;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.checkout-heading h1,
.order-confirmation h1 {
  margin: 10px 0 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(270px, 0.7fr);
  gap: 48px;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  padding-bottom: 26px;
  border-bottom: 1px solid rgba(245, 242, 235, 0.112);
}

.form-section h2,
.order-summary h2 {
  margin: 0 0 18px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 26px;
  font-weight: 500;
}

.form-section label {
  display: block;
  min-width: 0;
}

.form-section label > span {
  display: block;
  margin-bottom: 7px;
  color: #a69e90;
  font-size: 9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.form-section input {
  width: 100%;
  min-height: 43px;
  padding: 10px 12px;
  border: 1px solid rgba(245, 242, 235, 0.14);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.32);
  color: #f5f2eb;
  font: inherit;
  font-size: 12px;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 15px;
}

.delivery-options {
  display: flex;
  gap: 9px;
  margin-bottom: 4px;
}

.delivery-options button {
  min-width: 106px;
  padding: 11px 20px;
  border: 1px solid rgba(245, 242, 235, 0.14);
  background: transparent;
  color: #a69e90;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.delivery-options button.active {
  border-color: #c9a96b;
  color: #e6d3a8;
}

.payment-section {
  padding-bottom: 0;
  border: 0;
}

.payment-method {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-top: 1px solid rgba(245, 242, 235, 0.112);
  border-bottom: 1px solid rgba(245, 242, 235, 0.112);
  color: #a69e90;
  font-size: 11px;
}

.payment-method span:last-child {
  color: #c9a96b;
}

.order-summary {
  align-self: start;
  padding: 22px;
  background: #12110f;
}

.summary-item {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-top: 1px solid rgba(245, 242, 235, 0.091);
}

.summary-item img {
  width: 52px;
  height: 62px;
  object-fit: cover;
  background: #2a2824;
}

.summary-item div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.summary-item strong {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 17px;
  font-weight: 500;
}

.summary-item span {
  color: #a69e90;
  font-size: 9px;
}

.empty-cart {
  padding: 16px 0;
  color: #a69e90;
  font-size: 11px;
}

.empty-cart a {
  color: #d8c08a;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(245, 242, 235, 0.14);
  font-size: 11px;
}

.summary-total strong {
  color: #d8c08a;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 21px;
  font-weight: 500;
}

.place-order,
.order-confirmation button {
  width: 100%;
  min-height: 48px;
  margin-top: 18px;
  border: 1px solid #f5f2eb;
  background: #f5f2eb;
  color: #0a0a09;
  cursor: pointer;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.place-order:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.order-confirmation {
  display: flex;
  min-height: 520px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 24px;
  text-align: center;
}

.confirmation-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  margin-bottom: 20px;
  border: 1px solid #c9a96b;
  border-radius: 50%;
  color: #c9a96b;
}

.order-confirmation h1 {
  max-width: 540px;
  margin-top: 17px;
}

.order-confirmation p {
  color: #a69e90;
  font-size: 12px;
}

.order-confirmation button {
  width: auto;
  padding: 0 24px;
}

@media (max-width: 760px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .checkout-content {
    padding: 46px 18px 70px;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
