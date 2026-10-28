<template>
  <div class="atelier-page">
    <section class="atelier-hero">
      <img
        src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1500&q=85"
        alt="A fragrance bottle in a softly lit atelier"
      />
      <div>
        <span class="overline">The Nocturne atelier</span>
        <h1>Made with<br /><em>intention.</em></h1>
      </div>
    </section>
    <section class="atelier-story">
      <span class="overline">Our point of view</span>
      <p>
        Nocturne is an independent fragrance house in Sofia, creating a small
        collection of personal, lasting scents. We believe in thoughtful
        ingredients, considered form, and the beauty of keeping only what matters.
      </p>
      <router-link to="/shop" class="story-link">Discover the collection →</router-link>
    </section>
  </div>
</template>

<style scoped>
.atelier-page {
  background: #f5f2eb;
  color: #29251f;
}

.atelier-hero {
  position: relative;
  display: flex;
  min-height: min(600px, 72svh);
  align-items: flex-end;
  overflow: hidden;
  padding: clamp(32px, 8vw, 112px);
  background: #d7d1c5;
  color: #fbf8f1;
}

.atelier-hero::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(0deg, rgba(28, 26, 22, 0.62), transparent 80%);
}

.atelier-hero img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 54%;
}

.atelier-hero > div {
  position: relative;
  z-index: 1;
}

.overline {
  color: #d6c29d;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

h1 {
  margin: 20px 0 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(64px, 9vw, 108px);
  font-weight: 400;
  letter-spacing: -0.05em;
  line-height: 0.8;
}

h1 em {
  color: #d6c29d;
  font-weight: 400;
}

.atelier-story {
  max-width: 760px;
  margin: 0 auto;
  padding: 100px 28px 112px;
  text-align: center;
}

.atelier-story .overline {
  color: #927950;
}

.atelier-story p {
  margin: 24px auto 28px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 4vw, 38px);
  line-height: 1.24;
}

.story-link {
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(146, 121, 80, 0.55);
  color: #665638;
  font-size: 9px;
  letter-spacing: 0.13em;
  text-decoration: none;
  text-transform: uppercase;
}
</style>
