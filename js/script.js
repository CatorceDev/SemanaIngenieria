const cartButton = document.querySelector(".cart");
const cartPanel = document.querySelector("#cart-view");

if (!(cartButton instanceof HTMLButtonElement) || !(cartPanel instanceof HTMLElement)) {
  throw new Error("No se encontró el botón o el panel del carrito.");
}

const closeCart = () => {
  cartPanel.hidden = true;
  cartButton.setAttribute("aria-expanded", "false");
};

cartButton.addEventListener("click", () => {
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
    !cartButton.contains(event.target)
  ) {
    closeCart();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartPanel.hidden) {
    closeCart();
    cartButton.focus();
  }
});