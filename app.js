let productos = [];

const loadJSON = async () => {
  const resp = await fetch("./productos.json");
  const data = await resp.json();
  productos = data;
  showProducts(productos);
};

loadJSON();

const productcontainer = document.querySelector("#containerProducts");
const containerdetails = document.querySelector("#containerdetails");
const modal = document.querySelector("#modal");
const modalContainer = document.querySelector("#contenedor-modal");
const formSection = document.querySelector(".formu");
const cartIcon = document.querySelector(".cartIcon");
const store = document.querySelector(".store");

let totalPurchase;
let carrito = [];

carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//**********************************************
const theNumberCart = document.querySelector("#numberCart");
numberCart();

//*******************************************************
showCart();

// ************************************************************************
// PARA MOSTRAR PRODUCTOS
// ************************************************************************

function showProducts(productosElegidos) {
  productcontainer.innerHTML = "";
  productosElegidos.forEach((producto) => {
    const productContainerDiv = document.createElement("div");

    productContainerDiv.classList.add("p-6");

    productContainerDiv.innerHTML = `                      
                  <img class="imagen hover:grow hover:shadow-lg" src= "${producto.image}"/>
                  <div class="divContenedorcito pt-3 flex items-start justify-between">
                      <p class="titulo-prod">${producto.titulo}</p>
                      <button type="button" data-detalle="${producto.codigo}" class="botoncito bg-black hover:bg-gray-900 text-white py-2 px-1 rounded">+ details</button>
                  </div>
                  <p class="pt-1 text-gray-900">$${producto.precio}</p>`;

    productcontainer.append(productContainerDiv);
  });
  showDetails();
  emptyCartMsg();
}

// ************************************************************************
//MOSTRAR DETALLES Y DESCRIPCION
// ************************************************************************
function showDetails() {
  const chosen = document.querySelectorAll(".botoncito");
  chosen.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const idBoton = Number(e.currentTarget.dataset.detalle);
      const selectedProduct = productos.filter(
        (producto) => producto.codigo === idBoton
      );
      containerdetails.innerHTML = "";
      selectedProduct.forEach((producto) => {
        const containerDetailsDiv = document.createElement("div");
        containerDetailsDiv.innerHTML = "";
        containerDetailsDiv.classList.add("p-6");
        containerDetailsDiv.classList.add("conte-detalles");
        containerDetailsDiv.innerHTML = `
                            <hr class="pt-10">     
                            <button type="button" class="botonCerrar bg-black hover:bg-gray-900 text-white py-2 px-4 rounded w-10">X</button>
                            <div class="contDetalles">                   
                                <img class="imagencita" src= "${
                                  producto.image
                                }"/>
                                <div class="detalles-texto-y-boton px-8 ">
                                    <p class="titulo-detalles">${
                                      producto.titulo
                                    }</p>
                                    <p class="descripcion">${
                                      producto.descripcion
                                    }</p>
                                    <p class="precio-detalles pt-1 text-gray-900">Price: $${
                                      producto.precio
                                    }</p>
                                    <p>Size</P>
                                    <select class="talles" data-producto-id="${
                                      producto.codigo
                                    }">
                                        ${producto.talles.map(
                                          (talle) =>
                                            `<option value="${talle}">${talle}</option>`
                                        )}
                                    </select>
                                    
                                    <section class="todos">
                                        ${producto.colores
                                          .map(
                                            (color) => `
                                            <div class="fila">                
                                                <p class"tituloColor">${
                                                  color.id
                                                }</p>
                                                <input                
                                                  type="radio"
                                                  class="colores"
                                                  data-producto-id="${
                                                    producto.codigo
                                                  }"
                                                  name="${producto.codigo}"
                                                  id="${
                                                    producto.codigo + color.id
                                                  }"
                                                  value="${color.id}"
                                                >
                                                <label class="label" style="background-color: ${
                                                  color.cod
                                                }" for="${
                                              producto.codigo + color.id
                                            }"></label>               
                                            <div>`
                                          )
                                          .join("")}
                                    </section>
                                    
                                    

                                    <button type="button" id="${
                                      producto.codigo
                                    }" data-codigo="${
          producto.codigo
        }" class="botoncitoAdd add-to-cart bg-black hover:bg-gray-900 text-white py-2 px-4 rounded">Add to cart</button>                                                                      
                                </div>
                            <div>`;
        containerdetails.append(containerDetailsDiv);
        containerDetailsDiv.scrollIntoView({ behavior: "smooth" });
        addToCart();
        closeDetails();
      });
    });
  });
}

function closeDetails() {
  const close = document.querySelectorAll(".botonCerrar");
  close.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      containerdetails.innerHTML = "";
    });
  });
}

// ************************************************************************
// AGREGAR AL CARRITO
// ************************************************************************

function addToCart() {
  const addButtons = document.querySelectorAll(".botoncitoAdd");
  const selectSize = document.querySelectorAll(".talles");
  const colorRadioButtons = document.querySelectorAll(".colores");

  addButtons.forEach((boton) => {
    boton.addEventListener("click", () => {
      //boton.id responde al id que le puse al boton, era como antes hacia el e.target.id
      let productoElegido = productos.find(
        (producto) => producto.codigo === Number(boton.id)
      );

      //en Array.from estoy creando un Array desde un objeto iterable (NodeList) con el proposito de usar el metodo find() que es de los Array
      //con el .value del final estoy accediendo a la eleccion del usuario
      let talleElegido = Array.from(selectSize).find(
        (talle) => talle.dataset.productoId === boton.id
      ).value;

      //hago un filter para que me devuelva todos los valores de los colores y despues iterarlos en el for
      //declaro la variable colorElegido y le asigno undefined para despues poder asignarle un valor en el for
      const radiosDeEsteProducto = Array.from(colorRadioButtons).filter(
        (color) => color.dataset.productoId === boton.id
      );
      //hago un for de la longitud de los radios de este producto para que cuando esté checked se asigne a la variable colorElegido
      //y tambien es un for porque hay productos con distintos colores y cantidad de colores
      let colorElegido;
      for (let i = 0; i < radiosDeEsteProducto.length; i++) {
        if (radiosDeEsteProducto[i].checked) {
          colorElegido = radiosDeEsteProducto[i].value;
          break;
        }
      }

      if (colorElegido == undefined) {
        Swal.fire({
          text: "Please choose size and colour",
          icon: "error",
          iconColor: "#E2B2AE",
          confirmButtonText: "Accept",
          confirmButtonColor: "#000000",
        });
      }

      //es .talle porque es una propiedad que se está creando en ese momento
      //es .color porque es una propiedad que se está creando en ese momento
      productoElegido.talle = talleElegido;
      productoElegido.color = colorElegido;

      //si talle o color no es undefined, te deja agregar al carrito
      if (colorElegido != undefined && talleElegido != undefined) {
        const esteProductoEnCarrito = carrito.find(
          (producto) =>
            producto.codigo === productoElegido.codigo &&
            producto.color === productoElegido.color &&
            producto.talle === productoElegido.talle
        );
        if (esteProductoEnCarrito) {
          esteProductoEnCarrito.cantidad++;
        } else {
          //estoy pusheando un nuevo objeto sin modificar lo anterior que tengo en el carrito
          carrito.push({ ...productoElegido });
        }
        Toastify({
          text: "Product added to cart",
          className: "info",
          style: {
            background: "linear-gradient(to right, #E2B2AE, #E2BDBA)",
          },
        }).showToast();

        showCart();
        localStorage.setItem("carrito", JSON.stringify(carrito));
        numberCart();
      }
    });
  });
}

// ************************************************************************
// MOSTRAR CARRITO
// ************************************************************************

function showCart() {
  modal.innerHTML = "";

  if (carrito.length > 0) {
    const cartTitle = document.createElement("div");
    cartTitle.classList.add("headerCart");
    cartTitle.innerHTML = `                  
                  <h2 class="font-bold text-gray-800 text-xl">CART</h2>
                  `;
    modal.append(cartTitle);

    carrito.forEach((producto) => {
      let subtotal = producto.precio * producto.cantidad;
      const productsInCart = document.createElement("div");
      productsInCart.classList.add("container-cart");

      productsInCart.innerHTML = `                    
                      <img class="carrito-imagen" src= "${producto.image}"/>                            
                      <div class="tituloYPrecio">
                        <p class="card-title">${producto.titulo}</p>
                        <p class="card-text">Prize: $${producto.precio}</p>
                      </div>
                      <div class="talleYColor">              
                          <p class="card-text">Size: ${producto.talle}</p>
                          <p class="card-text">Color: ${producto.color}</p>
                      </div>
                      <div class="columnaBotonesYSubtotal">
                          <div>
                            <button type="button" class="botonMenos bg-black hover:bg-gray-900 text-white py-2 px-2 rounded w-8">-</button>
                            <button type="button" class="botonMenos bg-black hover:bg-gray-900 text-white py-2 px-2 rounded w-8">${producto.cantidad}
                            </button>
                            <button type="button" class="botonMas bg-black hover:bg-gray-900 text-white py-2 px-2 rounded w-8">+</button>
                          </div>
                          <button type="button" id="${producto.codigo}" class="botoncinRemove justify-items-end bg-black hover:bg-gray-900 text-white py-2 px-4 rounded w-24">Remove</button>
                          <p class="subtotal card-text">Subtotal: $${subtotal}</p>
                      </div>`;

      modal.append(productsInCart);
    });
    sumTotalCart();
    const clearButton = document.createElement("div");
    clearButton.classList.add("divVaciar");
    clearButton.innerHTML = `
                <button type="button" class="botoncinVaciar bg-black hover:bg-gray-900 text-white py-2 px-4 rounded">Clear cart
                  </button>
                <button type="button" class="botonComprar bg-black hover:bg-gray-900 text-white py-2 px-4 rounded">Buy
                  </button>`;
    modal.append(clearButton);
    deleteProduct();
    addQuantity();
    substractQuantity();
    alertClearCart();
    goToForm();
  }
}

// ************************************************************************
// MENSAJE CARRITO VACIO
// ************************************************************************

function emptyCartMsg() {
  if (carrito.length <= 0) {
    modal.innerHTML = "";
    const cartTitle = document.createElement("div");
    cartTitle.classList.add("headerCart");
    cartTitle.innerHTML = `                  
                  <h2 class="textCart font-bold text-gray-800 text-xl">CART</h2>
                  `;
    modal.append(cartTitle);
    const cartEmpty = document.createElement("div");
    cartEmpty.innerHTML = `
              <h2 class="textoEmpty">Your cart is empty.</h2>`;
    modal.append(cartEmpty);
    numberCart();
  }
}

// ************************************************************************
// ABRIR Y CERRAR MODAL
// ************************************************************************

cartIcon.addEventListener("click", (e) => {
  e.preventDefault();
  modalContainer.classList.add("active");
});

modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    modalContainer.classList.remove("active");
  }
});

/* ******************************************************************************
ACTUALIZAR NUMERO DEL CARRITO
****************************************************************************** */

function numberCart() {
  let newNumber = carrito.reduce(
    (accum, producto) => accum + producto.cantidad,
    0
  );
  theNumberCart.innerText = newNumber;
}

/* ******************************************************************************
MODIFICAR CANTIDAD DE PRODUCTOS EN CARRITO
****************************************************************************** */

function substractQuantity() {
  const minusButton = document.querySelectorAll(".botonMenos");
  minusButton.forEach((boton, index) => {
    boton.addEventListener("click", (e) => {
      const selectedProduct = carrito[index];
      if (selectedProduct.cantidad > 1) {
        selectedProduct.cantidad--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        showCart();
        numberCart();
      }
    });
  });
}

function addQuantity() {
  const plusButton = document.querySelectorAll(".botonMas");
  plusButton.forEach((boton, index) => {
    boton.addEventListener("click", (e) => {
      const selectedProduct = carrito[index];
      selectedProduct.cantidad++;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      showCart();
      numberCart();
    });
  });
}

/* ******************************************************************************
ELIMINAR ELEMENTO DEL CARRITO
****************************************************************************** */

function deleteProduct() {
  const deleteButtons = document.querySelectorAll(".botoncinRemove");

  deleteButtons.forEach((botonn) => {
    botonn.addEventListener("click", (e) => {
      const deleted = carrito.findIndex(
        (producto) => producto.codigo === Number(e.target.id)
      );
      carrito.splice(deleted, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      showCart();
      if (carrito.length == 0) {
        modalContainer.classList.remove("active");
      }
      emptyCartMsg();
      numberCart();
    });
  });
}

/* ******************************************************************************
VACIAR CARRITO
****************************************************************************** */

function alertClearCart() {
  const paraBotonVaciar = document.querySelector(".botoncinVaciar");
  paraBotonVaciar.addEventListener("click", () => {
    const totalQuantity = carrito.reduce((accum, producto) => {
      return accum + producto.cantidad;
    }, 0);
    Swal.fire({
      title: "Are you sure you want to empty the cart?",
      text: `You have ${totalQuantity} ${
        totalQuantity > 1 ? "items" : "item"
      } in your cart`,
      icon: "warning",
      iconColor: "#E2B2AE",
      showDenyButton: true,
      confirmButtonText: "Accept",
      confirmButtonColor: "#353b41",
      denyButtonText: `Cancel`,
      denyButtonColor: "#ce9b97",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          iconColor: "#E2B2AE",
          text: `Cart emptied. ${totalQuantity} ${
            totalQuantity > 1 ? "items were " : "item was"
          } removed.`,
          confirmButtonText: "Accept",
          confirmButtonColor: "#000000",
        });
        clearCart();
      }
    });
  });
}

function clearCart() {
  carrito.length = 0;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  emptyCartMsg();
  numberCart();
  modalContainer.classList.remove("active");
}

/* ******************************************************************************
FUNCION MOSTRAR U OCULTAR FORMULARIO DE COMPRA
****************************************************************************** */

function goToForm() {
  if (carrito.length == 0) {
    formSection.style.display = "none";
  } else {
    const buyButton = document.querySelector(".botonComprar");
    buyButton.addEventListener("click", () => {
      formSection.style.display = "block";
      formSection.innerHTML = "";
      const formDiv = document.createElement("div");
      formDiv.innerHTML = `
              <form class="container py-12 px-6 mx-auto" id="formulario">
              <h3 class="font-bold text-gray-800 text-xl pb-2">CONTACT FORM</h3>
              <h5 class="subtituloForm">Fill the form to make your purchase.</h5>
              <label>Name and surname</label>
              <input
                type="text"
                class="form-control mb-6"
                id="inputName"
                placeholder="Introduce name and surname"/>
              <label>Email</label>
              <input
                type="email"
                class="form-control"
                id="inputEmail"
                placeholder="Introduce your email"/>
              <div class="container-form">
                <button
                  type="submit"
                  class="sendAndBuy bg-black hover:bg-gray-900 text-white mt-8 py-2 px-4 rounded">
                  Send and buy
                </button>
              </div>
            </form>`;
      formSection.append(formDiv);
      formDiv.scrollIntoView({ behavior: "smooth" });
      modalContainer.classList.remove("active");
      buy();
    });
  }
}

/* ******************************************************************************
FILTRAR POR BOTON DE CATEGORIAS
****************************************************************************** */

// VOLVER A MOSTRAR TODOS
const categoryTitle = document.querySelector("#titulos-cat");
const findAll = document.querySelector("#all");

findAll.addEventListener("click", (e) => {
  e.preventDefault();
  categoryTitle.innerText = "ALL PRODUCTS";
  showProducts(productos);
});

// FILTRAR POR CATEGORIAS
const productToSearch = document.querySelectorAll(".cat");

productToSearch.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();
    //e.target.id porque le puse id a la categoria en el html
    const productCategory = productos.find(
      (producto) => producto.categoria === e.target.id
    );

    categoryTitle.innerText = productCategory.categoria.toUpperCase();

    const searched = productos.filter(
      (producto) => producto.categoria === e.target.id
    );
    productcontainer.innerHTML = "";
    showProducts(searched);
    showDetails();
  });
});

/* ******************************************************************************
FILTRAR POR NOMBRE EN LA BARRA DE BUSQUEDA
****************************************************************************** */

const findByName = document.querySelector("#buscar");
findByName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    validateSearch();
  }
});

function validateSearch() {
  if (findByName.value == "") {
    showProducts();
  } else {
    const searching = productos.some((producto) =>
      producto.titulo.toLowerCase().includes(findByName.value.toLowerCase())
    );
    if (searching) {
      const searched = productos.filter((producto) =>
        producto.titulo.toLowerCase().includes(findByName.value.toLowerCase())
      );
      productcontainer.innerHTML = "";
      showProducts(searched);
    } else {
      productcontainer.innerHTML = "";
      const containerNotFound = document.createElement("div");
      containerNotFound.classList.add("mensajeNoHay");
      containerNotFound.innerHTML = `<p class="pt-8 mb-8 px-8">The product you are looking for is not in the catalogue<p/>`;
      productcontainer.append(containerNotFound);
    }
    showDetails();
  }
}

/* ******************************************************************************
SUMAR TOTAL CARRITO
****************************************************************************** */

function sumTotalCart() {
  totalPurchase = carrito.reduce((accum, producto) => {
    return accum + producto.precio * producto.cantidad;
  }, 0);
  const cartTotal = document.createElement("div");
  cartTotal.innerHTML = `                        
            <p class="total col-span-2 text-right">Total cart: $${totalPurchase}</p>`;
  modal.append(cartTotal);
}

/******************************************************************************
FORMULARIO DE COMPRA
****************************************************************************** */
function buy() {
  const form = document.querySelector("#formulario");
  const clientName = document.querySelector("#inputName");
  const clientEmail = document.querySelector("#inputEmail");

  if (carrito.length > 0) {
    form.addEventListener("submit", validarFormu);

    function validarFormu(e) {
      e.preventDefault();
      if (clientName.value == "" || clientEmail.value == "")
        Swal.fire({
          title: "Error!",
          text: "Please fill in both fields of the form to complete your purchase.",
          icon: "error",
          iconColor: "#E2B2AE",
          confirmButtonText: "Accept",
          confirmButtonColor: "#000000",
        });
      else {
        Swal.fire({
          title: "Successful purchase!",
          text: `Thank you, ${clientName.value}, for shopping at Witches lingerie! We will keep in touch with you at ${clientEmail.value}`,
          iconHtml: '<i class="bi bi-heart-fill"></i>',
          iconColor: "#E2B2AE",
          confirmButtonText: "Accept",
          confirmButtonColor: "#000000",
        });
        carrito.length = 0;

        emptyCartMsg();
        containerdetails.innerHTML = "";

        localStorage.setItem("carrito", JSON.stringify(carrito));
        formSection.style.display = "none";
        setTimeout(function () {
          store.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    }
  }
}
