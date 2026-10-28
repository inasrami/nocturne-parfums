<script setup>
function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main">
      <router-link to="/" class="footer-brand">
        <span>NOCTURNE</span>
        <small>PARFUMS · SOFIA</small>
      </router-link>

      <nav class="footer-links" aria-label="Footer navigation">
        <router-link to="/shop">Collection</router-link>
        <router-link to="/atelier">Our story</router-link>
      </nav>

      <a class="back-to-top" href="#" @click.prevent="backToTop">
        Back to top ↑
      </a>
    </div>
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} Nocturne Parfums</span>
      <span>Made with intention in Sofia</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 48px clamp(22px, 6vw, 88px) 20px;
  background: #151413;
  color: #ece7dc;
}

.footer-main,
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-main {
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 36px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: inherit;
  text-decoration: none;
}

.footer-brand span {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 25px;
  letter-spacing: 0.19em;
  line-height: 0.9;
}

.footer-brand small {
  color: #c9a96b;
  font-size: 7px;
  letter-spacing: 0.25em;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.footer-links a,
.back-to-top {
  color: #a69e90;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.footer-links a:hover,
.back-to-top:hover {
  color: #c9a96b;
}

.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 16px;
  border-top: 1px solid rgba(245, 242, 235, 0.112);
  color: #8f8879;
  font-size: 8px;
  letter-spacing: 0.08em;
}

@media (max-width: 620px) {
  .footer-main {
    align-items: flex-start;
    flex-direction: column;
    gap: 26px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
