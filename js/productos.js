// Configuración de Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBgVBGQkersxYtELSQEsotXtyxyXuqN5kQ",
    authDomain: "veterinariahuellita-8d203.firebaseapp.com",
    projectId: "veterinariahuellita-8d203",
    storageBucket: "veterinariahuellita-8d203.appspot.com",
    messagingSenderId: "833441330192",
    appId: "1:833441330192:web:34dd1ff7f2deb73de90695"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener la referencia a la colección "productos"
var productosRef = firebase.firestore().collection("productos");

// Obtener el contenedor de la lista de productos
var productList = document.getElementById("product-list");

// Obtener los productos de Firebase y mostrarlos en la página
productosRef.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    var product = doc.data();

    // Crear un elemento de producto y agregar los detalles
    var productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
      <img src="${product.imagenUrl}" alt="${product.nombre}">
      <h2>${product.nombre}</h2>
      <p>${product.descripcion}</p>
      <p>Precio: $${product.precio}</p>
      <label for="quantity-${doc.id}">Cantidad:</label>
      <input type="number" id="quantity-${doc.id}" value="1" min="1"><br><br>
      <button class="add-to-cart-btn" data-product-id="${doc.id}">Añadir al carrito</button>
    `;

    // Agregar el elemento de producto al contenedor de la lista
    productList.appendChild(productElement);

    // Obtener una referencia al botón recién creado
    var addToCartBtn = productElement.querySelector('.add-to-cart-btn');

    // Asignar el evento de clic al botón
    addToCartBtn.addEventListener('click', function() {
      var productId = this.getAttribute('data-product-id');
      var quantityInput = document.getElementById(`quantity-${productId}`);
      var quantity = parseInt(quantityInput.value);
      addToCart(productId, quantity);
    });
  });
}).catch(function(error) {
  console.log("Error al obtener los productos: ", error);
});


// Añadir producto al carrito
function addToCart(productId, quantity) {
  // Verificar si el usuario está autenticado
  var user = firebase.auth().currentUser;
  if (user) {
    // Usuario autenticado, obtener el UID del usuario
    var userId = user.uid;

    // Verificar si el producto ya existe en el carrito del usuario
    var carritoRef = firebase.firestore().collection("carrito").doc(userId);
    carritoRef.get().then(function(doc) {
      if (doc.exists) {
        // El documento del carrito del usuario existe, verificar si el producto ya está en el carrito
        var carrito = doc.data().carrito || [];
        if (carrito.includes(productId)) {
          console.log("El producto ya está en el carrito");
          return;
        }

        // Agregar el producto al carrito del usuario con la cantidad
        carrito.push({ productId: productId, quantity: quantity });
        return carritoRef.update({ carrito: carrito })
          .then(function() {
            console.log("Producto agregado al carrito");
            alert("Producto agregado al carrito")
          })
          .catch(function(error) {
            console.log("Error al agregar el producto al carrito: ", error);
          });
      } else {
        // El documento del carrito del usuario no existe, crearlo y agregar el producto
        return carritoRef.set({ carrito: [{ productId: productId, quantity: quantity }] })
          .then(function() {
            console.log("Producto agregado al carrito");
          })
          .catch(function(error) {
            console.log("Error al agregar el producto al carrito: ", error);
          });
      }
    }).catch(function(error) {
      console.log("Error al obtener el carrito del usuario: ", error);
    });
  } else {
// Usuario no autenticado, solicitar inicio de sesión
alert("Debes iniciar sesión para agregar productos al carrito");
// Redirigir al usuario a la página de inicio de sesión
window.location.href = "login.html";
}
};
