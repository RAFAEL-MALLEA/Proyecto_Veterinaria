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
  
  // Verificar si el usuario actual es un administrador
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Usuario autenticado, verificar si es administrador
      var userRef = firebase.firestore().collection("usuarios").doc(user.uid);
  
      userRef.get().then(function(doc) {
        if (doc.exists) {
          var isAdmin = doc.data().admin === true;
  
          if (isAdmin) {
            // Obtener la referencia a la colección "pedidos"
            var pedidosRef = firebase.firestore().collection("pedidos");
  
            // Obtener el contenedor de la lista de pedidos
            var orderList = document.getElementById("order-list");
  
            // Obtener los pedidos de Firebase y mostrarlos en la página
            pedidosRef.get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                var pedido = doc.data();
                var pedidoId = doc.id;
  
                // Obtener los productos del pedido
                var productos = pedido.products;
  
                // Obtener el nombre y correo del usuario del pedido
                var userId = pedido.userId;
                var usuarioRef = firebase.firestore().collection("usuarios").doc(userId);
  
                usuarioRef.get().then(function(usuarioDoc) {
                  if (usuarioDoc.exists) {
                    var nombreUsuario = usuarioDoc.data().nombre + " " + usuarioDoc.data().apellido;
                    var correoUsuario = usuarioDoc.data().email;
  
                    // Crear una fila de la tabla para cada pedido
                    var row = document.createElement("tr");
                    row.innerHTML = `
                      <td>${pedidoId}</td>
                      <td>${nombreUsuario}</td>
                      <td>${correoUsuario}</td>`;
  
                    // Crear una columna para los productos
                    var productosColumn = document.createElement("td");
  
                    // Recorrer los productos y agregarlos a la columna de productos
                    productos.forEach(function(producto) {
                      var productoHtml = `
                        <div>
                          <p>${producto.nombre}</p>
                          <p>Cantidad: ${producto.quantity}</p>
                          <p>Precio: ${producto.precio}</p>
                          <p>-----------------</p>
                        </div>`;
                      productosColumn.innerHTML += productoHtml;
                    });
  
                    row.appendChild(productosColumn);
  
                    // Crear botón de eliminar pedido
                    var eliminarBtn = document.createElement("button");
                    eliminarBtn.textContent = "Eliminar";
                    eliminarBtn.addEventListener("click", function() {
                      eliminarPedido(pedidoId);
                    });
  
                    var eliminarColumn = document.createElement("td");
                    eliminarColumn.appendChild(eliminarBtn);
                    row.appendChild(eliminarColumn);
  
                    // Asignar un ID a la fila para poder eliminarla posteriormente
                    row.setAttribute("id", pedidoId);
  
                    // Agregar la fila a la tabla
                    orderList.appendChild(row);
                  }
                });
              });
            }).catch(function(error) {
              console.log("Error al obtener los pedidos: ", error);
            });
  
          // Función para eliminar un pedido
          function eliminarPedido(pedidoId) {
            if (confirm("¿Estás seguro de eliminar este pedido?")) {
              // Obtener la referencia al pedido y eliminarlo
              pedidosRef.doc(pedidoId).delete().then(function() {
                console.log("Pedido eliminado correctamente");
                // Actualizar la tabla de pedidos eliminando la fila correspondiente
                var row = document.getElementById(pedidoId);
                row.remove();
              }).catch(function(error) {
                console.log("Error al eliminar el pedido: ", error);
              });
            }
          }
        } else {
          // Usuario no es administrador, redirigir a otra página o mostrar un mensaje de error
          alert("No tienes permisos para ver esta página");
          // Redirigir al usuario a otra página
          window.location.href = "perfil.html";
        }
      } else {
        // El documento de usuario no existe
        console.log("El documento de usuario no existe");
      }
    }).catch(function(error) {
      console.log("Error al obtener el documento de usuario: ", error);
    });
  } else {
    // No hay usuario autenticado, redirigir al inicio de sesión
    window.location.href = "inicioadmin.html";
  }
});

  