const socket = io();


// /////////////////////// PARA CHAT /////////////////////// 
// ////////////  sentencias
const input = document.getElementById("textbox");
const texto = document.getElementById("texto");
// import MessageManager from "../../DAOs/messageManager.class";

// let messageManager = new MessageManager()
// //////////// EMIT

function enterChat() { 
    socket.emit("message", input.value); 
    document.getElementById("textbox").value="" 
};

//////////// ON
socket.on("imprimir", (data) => {
  // messageManager.addChat(data) 
  console.log("mensajes", data)
  let mensajes = ''
    data.forEach(msj=>{
        mensajes = `${msj.socketId} escribio: ${msj.message} <br/>`
    })
    texto.innerHTML += mensajes
});
   



  /////////////////////// PARA PRODUCTS ////////////////
let allProducts = null;
let addProductBtn = document.getElementById("add-product-btn")

// Socket.on

socket.on("update-products", (products) => {
  let productsContainer = document.getElementById("products-container")
  productsContainer.innerHTML = "" 
  
  for (let product of products.docs) {
    let productElement = document.createElement("div");
    productElement.innerHTML = `
      <p> Title: ${product.title} </p>
      <p> Description: ${product.description} </p>
      <p> Price: ${product.price} </p>
      <p> Price: ${product.category} </p>
      <p> Price: ${product.stock} </p>
      <p> Price: ${product.thumbnail} </p>
      <p> Price: ${product.code} </p>
      <p> Price: ${product.status} </p>
      <button id=${product._id} onclick="deleteProduct(this)"> Borrar </button>
      <button id=${product._id} onclick="editarProduct(this)"> Editar </button>
      <div id="xEdit"></div>
    `

    productElement.setAttribute("style", "border: 1px solid #000; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem")
    productsContainer.appendChild(productElement)
  }
  allProducts = products.docs

})

// Event listeners

addProductBtn.addEventListener("click", (e) => {
 
  e.preventDefault()

  // Obtenemos los inputs

  let titleInput = document.getElementById("title")
  let descriptionInput = document.getElementById("description")
  let priceInput = document.getElementById("price")
  let codeInput = document.getElementById("code")
  let stockInput = document.getElementById("stock")
  let categoryInput = document.getElementById("category")
  let statusInput = document.getElementById("status")

  // Creamos la "data" del producto a partir de los valores de los inputs, y la enviamos

  let productData = {
    title: titleInput.value,
    description: descriptionInput.value,
    price: Number(priceInput.value),
    code: Number(codeInput.value),
    stock: Number(stockInput.value),
    category: categoryInput.value,
    status: (statusInput.value.toLowerCase() === "true")
  }

  socket.emit("add-product", productData)

  // "Limpiamos" los inputs

  titleInput.value = ""
  descriptionInput.value = ""
  priceInput.value = ""
  codeInput.value = ""
  stockInput.value = ""
  categoryInput.value = ""
  statusInput.value = ""
  window.location.reload()
})

// Declaracion de funciones auxiliares

function deleteProduct(button) { 
  socket.emit("delete-product", button.id) // El id del boton es del producto
  // socket.emit("upload-product")
  window.location.reload()

}


function editarProduct(button) {  
  let result = allProducts.find(each=> each._id === button.id) 
  let productElement = document.getElementById("xEdit")
  productElement.innerHTML = `
  EDITAR
  <label>Título:</label>
  <input style="margin-bottom: 0.5rem" id="title1">
  <br>

  <label>Descripción:</label>
  <input style="margin-bottom: 0.5rem" id="description1">
  <br>

  <label>Precio:</label>
  <input type="number" style="margin-bottom: 0.5rem" id="price1">
  <br>

  URL de la miniatura:</label>
  <input id="thumbnails1">
  <br>  

  <label>Code:</label>
  <input type="number" style="margin-bottom: 0.5rem" id="code1">
  <br>

  <label>Stock:</label>
  <input type="number" style="margin-bottom: 0.5rem" id="stock1">
  <br>

  <label>Categoría:</label>
  <input  style="margin-bottom: 0.5rem" id="category1">
  <br>

  <label>Status: (use "true") </label>
  <input style="margin-bottom: 0.5rem" id="status1">
  <br>
  <button>GUARDAR !</button>
  <button >CERRAR/ DESCARTAR</button>
  `
  let titleInput = document.getElementById("title1")
  let descriptionInput = document.getElementById("description1")
  let priceInput = document.getElementById("price1")
  let thumbnailsInput = document.getElementById("thumbnails1")
  let codeInput = document.getElementById("code1")
  let stockInput = document.getElementById("stock1")
  let categoryInput = document.getElementById("category1")
  let statusInput = document.getElementById("status1")

  let productData = {
    title: titleInput.value,
    description: descriptionInput.value,
    price: Number(priceInput.value),
    code: Number(codeInput.value),
    stock: Number(stockInput.value),
    thumbnail : thumbnailsInput,
    category: categoryInput.value,
    status: (statusInput.value.toLowerCase() === "true")
  }
 

  // "Limpiamos" los inputs

  titleInput.value = ""
  descriptionInput.value = ""
  priceInput.value = ""
  codeInput.value = ""
  thumbnailsInput = ""
  stockInput.value = ""
  categoryInput.value = ""
  statusInput.value = ""
  // window.location.reload() 
  socket.emit("upload-product", productData) // El id del boton es del producto 
  // window.location.reload() 
}

function alert2(){
  alert("agregada")
}