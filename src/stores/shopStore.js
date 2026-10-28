import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { perfumes } from "../data/parfumes";

export const useShopStore = defineStore("shop", () => {
  const locale = ref(localStorage.getItem("nocturne_locale") || "bg");
  const cart = ref(JSON.parse(localStorage.getItem("nocturne_cart") || "[]"));
  const wishlist = ref(JSON.parse(localStorage.getItem("nocturne_wishlist") || "[]"));
  const isCartOpen = ref(false);
  const isSearchOpen = ref(false);
  const promoCode = ref("");
  const discountPercent = ref(0);

  const FREE_SHIPPING_THRESHOLD = 300;

  watch(locale, (val) => localStorage.setItem("nocturne_locale", val));
  watch(cart, (val) => localStorage.setItem("nocturne_cart", JSON.stringify(val)), { deep: true });
  watch(wishlist, (val) => localStorage.setItem("nocturne_wishlist", JSON.stringify(val)), { deep: true });

  function toggleLocale() {
    locale.value = locale.value === "en" ? "bg" : "en";
  }

  function addToCart(product, selectedSize = "50ml", qty = 1) {
    const variant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
    const cartKey = `${product.id}-${variant.size}`;
    const existing = cart.value.find((item) => item.cartKey === cartKey);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.value.push({
        cartKey,
        id: product.id,
        name: product.name,
        size: variant.size,
        price: variant.price,
        image: product.images[0],
        quantity: qty,
      });
    }
    isCartOpen.value = true;
  }

  function updateQuantity(cartKey, delta) {
    const index = cart.value.findIndex((i) => i.cartKey === cartKey);
    if (index === -1) return;
    cart.value[index].quantity += delta;
    if (cart.value[index].quantity <= 0) {
      cart.value.splice(index, 1);
    }
  }

  function toggleWishlist(productId) {
    const idx = wishlist.value.indexOf(productId);
    if (idx > -1) wishlist.value.splice(idx, 1);
    else wishlist.value.push(productId);
  }

  function applyPromo(code) {
    const normalized = code.trim().toUpperCase();
    if (normalized === "NOCTURNE15" || normalized === "VIP15") {
      promoCode.value = normalized;
      discountPercent.value = 15;
      return true;
    }
    discountPercent.value = 0;
    return false;
  }

  function clearCart() {
    cart.value = [];
    promoCode.value = "";
    discountPercent.value = 0;
  }

  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const discountAmount = computed(() => Math.round((subtotal.value * discountPercent.value) / 100));
  const finalTotal = computed(() => subtotal.value - discountAmount.value);

  const freeShippingProgress = computed(() => {
    return Math.min(100, Math.round((subtotal.value / FREE_SHIPPING_THRESHOLD) * 100));
  });

  const amountRemainingForFreeShipping = computed(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal.value);
  });

  const t = computed(() => {
    const dict = {
      en: {
        announcement: "PRIVATE ARCHIVE SALE — 15% OFF WITH CODE: NOCTURNE15",
        shop: "Collection",
        story: "Atelier",
        searchPlaceholder: "Search by fragrance or note...",
        cartTitle: "Your Selection",
        emptyCart: "Your olfactory wardrobe is currently empty.",
        freeShippingUnlocked: "Complimentary express delivery unlocked",
        freeShippingRemaining: (amt) => `Add ${amt} BGN more for complimentary delivery`,
        promoPlaceholder: "Promo code (try NOCTURNE15)",
        apply: "Apply",
        subtotal: "Subtotal",
        discount: "Privilege Discount",
        checkoutBtn: "Proceed to Checkout",
        currency: "BGN",
      },
      bg: {
        announcement: "ЧАСТЕН АРХИВ — 15% ОТСТЪПКА С КОД: NOCTURNE15",
        shop: "Колекция",
        story: "Ателие",
        searchPlaceholder: "Търсене по парфюм или нотка...",
        cartTitle: "Вашата Селекция",
        emptyCart: "Вашата количка е празна.",
        freeShippingUnlocked: "Отключихте безплатна експресна доставка",
        freeShippingRemaining: (amt) => `Добавете още ${amt} лв. за безплатна доставка`,
        promoPlaceholder: "Промо код (NOCTURNE15)",
        apply: "Приложи",
        subtotal: "Междинна сума",
        discount: "Отстъпка",
        checkoutBtn: "Към завършване на поръчката",
        currency: "лв.",
      },
    };
    return dict[locale.value];
  });

  return {
    perfumes,
    locale,
    cart,
    wishlist,
    isCartOpen,
    isSearchOpen,
    promoCode,
    discountPercent,
    cartCount,
    subtotal,
    discountAmount,
    finalTotal,
    freeShippingProgress,
    amountRemainingForFreeShipping,
    toggleLocale,
    addToCart,
    updateQuantity,
    toggleWishlist,
    applyPromo,
    clearCart,
    t,
  };
});