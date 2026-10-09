const cartButton = document.querySelector(".cart");
const cartPanel = document.querySelector("#cart-view");
const menuButton = document.querySelector(".header-menu-toggle");
const headerMenu = document.querySelector("#header-menu");
const checkoutModal = document.querySelector("#checkout-modal");

if (
  !(cartButton instanceof HTMLButtonElement) ||
  !(cartPanel instanceof HTMLElement) ||
  !(menuButton instanceof HTMLButtonElement) ||
  !(headerMenu instanceof HTMLElement) ||
  !(checkoutModal instanceof HTMLDialogElement)
) {
  throw new Error("No se encontró el botón o panel del carrito, o el menú del header.");
}

const closeCart = () => {
  cartPanel.hidden = true;
  cartButton.setAttribute("aria-expanded", "false");
};

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
});

headerMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", closeMenu);
});

cartButton.addEventListener("click", () => {
  closeMenu();
  const isOpen = cartButton.getAttribute("aria-expanded") === "true";
  cartPanel.hidden = isOpen;
  cartButton.setAttribute("aria-expanded", String(!isOpen));
});

cartPanel.querySelectorAll("[data-cart-close]").forEach((control) => {
  control.addEventListener("click", closeCart);
});

document.addEventListener("click", (event) => {
  if (
    event.target instanceof Node &&
    !cartPanel.contains(event.target) &&
    !cartButton.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeCart();
  }

  if (
    event.target instanceof Node &&
    !headerMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (checkoutModal.open) {
      return;
    }

    if (menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    } else if (!cartPanel.hidden) {
      closeCart();
      cartButton.focus();
    }
  }
});

const elementosPorRevelar = document.querySelectorAll(
  "#hero .faculty, #hero .hero--welcome, #hero .hero--description, " +
    ".program-section .section-topline, .program-section .program-heading, " +
    ".program-section .talk-card, .program-section .program-footnote",
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
  );

  elementosPorRevelar.forEach((element) => {
    element.classList.add("scroll-reveal");
    observer.observe(element);
  });
} else {
  elementosPorRevelar.forEach((element) => element.classList.add("is-visible"));
}