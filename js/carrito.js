// Configuración de Firebase
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBgVBGQkersxYtELSQEsotXtyxyXuqN5kQ",
    authDomain: "veterinariahuellita-8d203.firebaseapp.com",
    projectId: "veterinariahuellita-8d203",
    storageBucket: "veterinariahuellita-8d203.appspot.com",
    messagingSenderId: "833441330192",
    appId: "1:833441330192:web:34dd1ff7f2deb73de90695"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  
  var productosRef = firebase.firestore().collection("productos");
  
  // Get a reference to the "carrito" collection
  var carritoRef = firebase.firestore().collection("carrito");
  
  // Verify if a user is authenticated
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Authenticated user, show cart items and enable checkout button
      showCartItems(user.uid);
      showCartTotal(user.uid);
  
    } else {
      // Non-authenticated user, redirect to login page
      window.location.href = "login.html";
    }
  });
  
  // Function to show cart items
  function showCartItems(userId) {
    var cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
  
    // Get the cart items for the current user
    carritoRef.doc(userId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          var carrito = doc.data().carrito || [];
  
          // Get the product details for the items in the cart
          var promises = carrito.map(function(item) {
            return productosRef.doc(item.productId).get();
          });
  
          Promise.all(promises)
            .then(function(results) {
              var cartItems = results.map(function(doc, index) {
                var product = doc.data();
                product.quantity = carrito[index].quantity; // Add the quantity property
                return product;
              });
  
              cartItems.forEach(function(product) {
                var productElement = document.createElement("div");
                productElement.innerHTML = `
                  <h3>${product.nombre}</h3>
                  <img src="${product.imagenUrl}" alt="${product.nombre}">
                  <p>Precio: $${product.precio}</p>
                  <p>Cantidad: ${product.quantity}</p>
                `;
                cartItemsContainer.appendChild(productElement);
              });
            })
            .catch(function(error) {
              console.log("Error retrieving cart items:", error);
            });
        }
      })
      .catch(function(error) {
        console.log("Error retrieving cart items:", error);
      });
  }
  
  // Function to calculate and show the cart total
function showCartTotal(userId) {
    var cartTotalElement = document.getElementById("cart-total");
    cartTotalElement.textContent = "$0.00";
  
    // Get the cart items for the current user
    carritoRef
      .doc(userId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var carrito = doc.data().carrito || [];
          var promises = carrito.map(function (item) {
            return productosRef.doc(item.productId).get();
          });
  
          Promise.all(promises)
            .then(function (results) {
              var total = 0;
              results.forEach(function (doc, index) {
                var product = doc.data();
                var quantity = carrito[index].quantity;
                total += product.precio * quantity;
              });
              cartTotalElement.textContent = "$" + total.toFixed(2);
  
              // Call processPayment with the updated total value
              processPayment(userId, total);
            })
            .catch(function (error) {
              console.log("Error retrieving cart items:", error);
            });
        }
      })
      .catch(function (error) {
        console.log("Error retrieving cart items:", error);
      });
  }
  
  // Function to process the payment with PayPal
  function processPayment(userId, total) {
    paypal.Buttons({
      // Establecer el entorno de PayPal (sandbox o producción)
      env: "sandbox",
      // Establecer el ID de cliente de PayPal
      client: {
        sandbox:
          "YOUR_SANDBOX_CLIENT_ID",
        production:
          "YOUR_PRODUCTION_CLIENT_ID",
      },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: total.toFixed(2), // Utiliza el valor total del carrito
              },
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          carritoRef
            .doc(userId)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                var carrito = doc.data().carrito || [];
                var promises = carrito.map(function (item) {
                  return productosRef.doc(item.productId).get();
                });
  
                Promise.all(promises)
                  .then(function (results) {
                    var products = results.map(function (doc, index) {
                      var product = doc.data();
                      product.quantity = carrito[index].quantity;
                      return product;
                    });
  
                    // Create a new document in the "pedidos" collection
                    var pedidoData = {
                      userId: userId,
                      products: products,
                      timestamp: firebase.firestore.Timestamp.now(),
                    };
  
                    firebase
                      .firestore()
                      .collection("pedidos")
                      .add(pedidoData)
                      .then(function () {
                        // Remove the items from the cart
                        carritoRef
                          .doc(userId)
                          .update({
                            carrito: firebase.firestore.FieldValue.delete(),
                          })
                          .then(function () {
                            console.log(
                              "Payment processed and cart items removed."
                            );
                            alert("Pago confirmado su pedido ya fue registrado")
                            window.location.href = "productos.html";
                          })
                          .catch(function (error) {
                            console.log(
                              "Error removing cart items:",
                              error
                            );
                          });
                      })
                      .
                      then(function (error) {
                        console.log("Error creating pedido:", error);
                        });
                        })
                        .catch(function (error) {
                        console.log("Error retrieving cart items:", error);
                        });
                        }
                        })
                        .catch(function (error) {
                        console.log("Error retrieving cart items:", error);
                        });
                        });
                        },
                        onCancel: function (data) {
                        console.log("Payment cancelled:", data);
                        },
                        onError: function (err) {
                        console.log("Error during payment:", err);
                        },
                        })
                        .render("#paypal-button-container")
                        .catch(function (error) {
                        console.log("Error rendering PayPal button:", error);
                        });
                    }
                        
                        
                        
                        
                        
                          
