const nav = document.querySelector("[data-nav]");
const rail = document.querySelector("[data-rail]");
const reveals = document.querySelectorAll(".reveal");
const hero = document.querySelector("[data-parallax]");
const heroMedia = document.querySelector(".hero-media img");
const staggerGroups = document.querySelectorAll(".reveal-stagger");
const faqItems = document.querySelectorAll(".faq-list details");

document.body.classList.add("is-loaded");

staggerGroups.forEach((group) => {
  const items = group.querySelectorAll(".stagger-item, img");
  items.forEach((item, index) => item.style.setProperty("--i", index + 1));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((item) => revealObserver.observe(item));

const updateScrollEffects = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 24);

  if (hero && heroMedia) {
    const heroBounds = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-heroBounds.top / heroBounds.height, 0), 1);
    heroMedia.style.setProperty("--hero-parallax", `${progress * 58}px`);
  }
};

updateScrollEffects();
window.addEventListener("scroll", updateScrollEffects, { passive: true });

if (rail) {
  let active = false;
  let startX = 0;
  let startScroll = 0;

  rail.addEventListener("pointerdown", (event) => {
    active = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    rail.setPointerCapture(event.pointerId);
    document.body.classList.add("is-dragging");
  });

  rail.addEventListener("pointermove", (event) => {
    if (!active) return;
    rail.scrollLeft = startScroll - (event.clientX - startX);
  });

  const stopDrag = () => {
    active = false;
    document.body.classList.remove("is-dragging");
  };

  rail.addEventListener("pointerup", stopDrag);
  rail.addEventListener("pointercancel", stopDrag);
}

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});
