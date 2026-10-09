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