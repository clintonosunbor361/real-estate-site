const nav = document.querySelector("[data-nav]");
const rail = document.querySelector("[data-rail]");
const reveals = document.querySelectorAll(".reveal");
const hero = document.querySelector("[data-parallax]");
const heroMedia = document.querySelector(".hero-media img");
const staggerGroups = document.querySelectorAll(".reveal-stagger");
const faqItems = document.querySelectorAll(".faq-list details");
const filterForm = document.querySelector("[data-filter-form]");
const propertyCards = document.querySelectorAll("[data-property-card]");
const filterStatus = document.querySelector("[data-filter-status]");
const propertyTriggers = document.querySelectorAll("[data-open-property]");
const closeDialogButtons = document.querySelectorAll("[data-close-dialog]");
const leadForm = document.querySelector(".lead-form");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav-links a");

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

if (menuToggle && nav) {
  const setMenuState = (isOpen) => {
    nav.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  menuToggle.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("is-menu-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

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

const animateFaq = (item, shouldOpen) => {
  const answer = item.querySelector(".faq-answer");
  if (!answer) return;

  if (shouldOpen) {
    item.open = true;
    answer.style.height = "0px";

    requestAnimationFrame(() => {
      answer.style.height = `${answer.scrollHeight}px`;
    });

    answer.addEventListener(
      "transitionend",
      () => {
        if (item.open) answer.style.height = "auto";
      },
      { once: true }
    );
    return;
  }

  answer.style.height = `${answer.scrollHeight}px`;

  requestAnimationFrame(() => {
    answer.style.height = "0px";
  });

  answer.addEventListener(
    "transitionend",
    () => {
      item.open = false;
    },
    { once: true }
  );
};

faqItems.forEach((item) => {
  const answer = item.querySelector(".faq-answer");
  if (answer) answer.style.height = item.open ? "auto" : "0px";

  item.querySelector("summary")?.addEventListener("click", (event) => {
    event.preventDefault();
    const shouldOpen = !item.open;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.open) animateFaq(otherItem, false);
    });

    animateFaq(item, shouldOpen);
  });
});

if (filterForm) {
  const applyFilters = () => {
    const data = new FormData(filterForm);
    const location = data.get("location");
    const budget = data.get("budget");
    const beds = data.get("beds");
    let visibleCount = 0;

    propertyCards.forEach((card) => {
      const cardPrice = Number(card.dataset.price);
      const cardBeds = Number(card.dataset.beds);
      const matchesLocation = location === "all" || card.dataset.location === location;
      const matchesBeds = beds === "all" || cardBeds >= Number(beds);
      const matchesBudget =
        budget === "all" ||
        (budget === "under1500" && cardPrice < 1500000) ||
        (budget === "under2500" && cardPrice < 2500000) ||
        (budget === "over2500" && cardPrice >= 2500000);
      const isVisible = matchesLocation && matchesBeds && matchesBudget;

      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (filterStatus) {
      filterStatus.textContent = `${visibleCount} residence${visibleCount === 1 ? "" : "s"} matched your criteria.`;
    }
  };

  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  filterForm.addEventListener("change", applyFilters);
  applyFilters();
}

propertyTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.openProperty);
    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
});

closeDialogButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("dialog")?.close();
  });
});

document.querySelectorAll(".property-dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = leadForm.querySelector("button");
    if (!button) return;

    button.textContent = "Inquiry Received";
    setTimeout(() => {
      button.textContent = "Submit Inquiry";
      leadForm.reset();
    }, 1800);
  });
}
