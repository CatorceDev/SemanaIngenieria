const catalogo = document.querySelector(".talk-list");
const botonCarrito = document.querySelector(".cart");
const indicadorCarrito = document.querySelector("#cart-count");
const contenidoCarrito = document.querySelector(".cart-content");
const estadoVacio = document.querySelector("#cart-empty-state");
const seccionItems = document.querySelector("#cart-items");
const listaCarrito = document.querySelector("#cart-list");
const totalCarrito = document.querySelector("#cart-total");
const botonVaciar = document.querySelector("#cart-clear");
const botonContinuarCompra = document.querySelector("#cart-add");
const modalCompra = document.querySelector("#checkout-modal");
const botonCerrarModal = document.querySelector("#checkout-close");
const opcionesBancos = document.querySelector("#checkout-bank-options");
const confirmacionCompra = document.querySelector("#checkout-success");

if (
  !(catalogo instanceof HTMLElement) ||
  !(botonCarrito instanceof HTMLButtonElement) ||
  !(indicadorCarrito instanceof HTMLElement) ||
  !(contenidoCarrito instanceof HTMLElement) ||
  !(estadoVacio instanceof HTMLElement) ||
  !(seccionItems instanceof HTMLElement) ||
  !(listaCarrito instanceof HTMLUListElement) ||
  !(totalCarrito instanceof HTMLElement) ||
  !(botonVaciar instanceof HTMLButtonElement) ||
  !(botonContinuarCompra instanceof HTMLButtonElement) ||
  !(modalCompra instanceof HTMLDialogElement) ||
  !(botonCerrarModal instanceof HTMLButtonElement) ||
  !(opcionesBancos instanceof HTMLElement) ||
  !(confirmacionCompra instanceof HTMLElement)
) {
  throw new Error("No se encontraron los elementos necesarios para el carrito.");
}

const formatoMoneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

let itemsCarrito = [];

catalogo.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const botonAgregar = event.target.closest(".add-button");
  if (!(botonAgregar instanceof HTMLButtonElement)) {
    return;
  }

  const tarjeta = botonAgregar.closest(".talk-card");
  const titulo = tarjeta?.querySelector("h3")?.textContent?.trim();
  const precioTexto = tarjeta?.querySelector(".talk-buy strong")?.textContent;
  const id = botonAgregar.dataset.id;
  const precio = Number(precioTexto?.replace(/[^\d.]/g, ""));

  if (!tarjeta || !titulo || !id || !Number.isFinite(precio) || precio < 0) {
    throw new Error("No se pudo leer la información de la conferencia seleccionada.");
  }

  const itemExistente = itemsCarrito.find((item) => item.id === id);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    itemsCarrito.push({ id, titulo, precio, cantidad: 1 });
  }

  renderizarCarrito();
});

botonContinuarCompra.addEventListener("click", () => {
  if (itemsCarrito.length === 0) {
    return;
  }

  const icono = botonContinuarCompra.querySelector("svg");
  if (icono) {
    icono.classList.remove("is-animating");
    void icono.offsetWidth;
    icono.classList.add("is-animating");
    icono.onanimationend = () => icono.classList.remove("is-animating");
  }

  modalCompra.showModal();
});

botonCerrarModal.addEventListener("click", () => modalCompra.close());

modalCompra.querySelectorAll("[data-bank]").forEach((boton) => {
  boton.addEventListener("click", () => {
    itemsCarrito = [];
    renderizarCarrito();
    opcionesBancos.hidden = true;
    confirmacionCompra.hidden = false;
  });
});

modalCompra.addEventListener("close", () => {
  opcionesBancos.hidden = false;
  confirmacionCompra.hidden = true;
  (itemsCarrito.length > 0 ? botonContinuarCompra : botonCarrito).focus();
});

listaCarrito.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const botonEliminar = event.target.closest("[data-cart-remove]");
  if (!(botonEliminar instanceof HTMLButtonElement)) {
    return;
  }

  itemsCarrito = itemsCarrito.filter((item) => item.id !== botonEliminar.dataset.cartRemove);
  renderizarCarrito();
});

botonVaciar.addEventListener("click", () => {
  itemsCarrito = [];
  renderizarCarrito();
});

function renderizarCarrito() {
  const cantidadTotal = itemsCarrito.reduce((total, item) => total + item.cantidad, 0);
  const precioTotal = itemsCarrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  indicadorCarrito.textContent = String(cantidadTotal);
  indicadorCarrito.hidden = cantidadTotal === 0;
  botonCarrito.setAttribute(
    "aria-label",
    cantidadTotal === 0
      ? "Mi carrito, vacío"
      : `Mi carrito, ${cantidadTotal} ${cantidadTotal === 1 ? "entrada" : "entradas"}`,
  );

  const carritoVacio = itemsCarrito.length === 0;
  estadoVacio.hidden = !carritoVacio;
  seccionItems.hidden = carritoVacio;
  contenidoCarrito.classList.toggle("has-items", !carritoVacio);
  listaCarrito.replaceChildren();

  itemsCarrito.forEach((item) => {
    const fila = document.createElement("li");
    fila.className = "cart-item";

    const informacion = document.createElement("div");
    informacion.className = "cart-item-info";

    const titulo = document.createElement("strong");
    titulo.className = "cart-item-title";
    titulo.textContent = item.titulo;

    const detalle = document.createElement("span");
    detalle.className = "cart-item-detail";
    detalle.textContent = `${formatoMoneda.format(item.precio)} × ${item.cantidad}`;

    const botonEliminar = document.createElement("button");
    botonEliminar.className = "cart-item-remove";
    botonEliminar.type = "button";
    botonEliminar.dataset.cartRemove = item.id;
    botonEliminar.setAttribute("aria-label", `Quitar ${item.titulo} del carrito`);
    botonEliminar.textContent = "×";

    informacion.append(titulo, detalle);
    fila.append(informacion, botonEliminar);
    listaCarrito.append(fila);
  });

  totalCarrito.textContent = formatoMoneda.format(precioTotal);
}
