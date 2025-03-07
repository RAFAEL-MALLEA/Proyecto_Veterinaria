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
  
// Referencia a la colección "productos" en Firestore
const productosRef = firebase.firestore().collection("productos");
// Referencia a la colección "usuarios" en Firestore
const usuariosRef = firebase.firestore().collection("usuarios");


// Obtener el formulario y la tabla
const formularioProducto = document.getElementById("formulario-producto");
const tablaProductos = document.getElementById("tabla-productos");
let productoIdEnEdicion = null;

// Cargar la lista de productos al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});

// Función para cargar la lista de productos desde Firebase y mostrarla en la tabla
function cargarProductos() {
  productosRef.get().then((querySnapshot) => {
    tablaProductos.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const producto = doc.data();
      const productoId = doc.id;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>$${producto.precio}</td>
        <td><img src="${producto.imagenUrl}" alt="${producto.nombre}"></td>
        <td>
          <button class="editar" onclick="editarProducto('${productoId}')">Editar</button><br><br>
          <button class="eliminar" onclick="eliminarProducto('${productoId}')">Eliminar</button>
        </td>
      `;

      tablaProductos.appendChild(row);
    });
  }).catch((error) => {
    console.log("Error al cargar los productos:", error);
  });
}
// Función para agregar o editar un producto
formularioProducto.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const nombre = formularioProducto.nombre.value.trim();
    const descripcion = formularioProducto.descripcion.value.trim();
    const precio = parseFloat(formularioProducto.precio.value.trim());
    const imagenUrl = formularioProducto.imagenUrl.value.trim();
  
    if (nombre === "" || descripcion === "" || isNaN(precio) || imagenUrl === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    const nuevoProducto = {
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      imagenUrl: imagenUrl
    };
  
    if (productoIdEnEdicion) {
      // Modificar el producto existente
      productosRef
        .doc(productoIdEnEdicion)
        .update(nuevoProducto)
        .then(() => {
          console.log("Producto actualizado correctamente");
          formularioProducto.reset();
          document.getElementById("agregar-btn").style.display = "block";
          document.getElementById("editar-btn").style.display = "none";
          productoIdEnEdicion = null;
          cargarProductos();
        })
        .catch((error) => {
          console.log("Error al actualizar el producto:", error);
        });
    } else {
      // Agregar un nuevo producto
      productosRef
        .add(nuevoProducto)
        .then(() => {
          console.log("Producto agregado correctamente");
          formularioProducto.reset();
          cargarProductos();
        })
        .catch((error) => {
          console.log("Error al agregar el producto:", error);
        });
    }
  });
  
  // Función para editar un producto existente
function editarProducto(productoId) {
    const productoRef = productosRef.doc(productoId);
  
    productoRef.get().then((doc) => {
      if (doc.exists) {
        const producto = doc.data();
        formularioProducto.nombre.value = producto.nombre;
        formularioProducto.descripcion.value = producto.descripcion;
        formularioProducto.precio.value = producto.precio;
        formularioProducto.imagenUrl.value = producto.imagenUrl;
  
        formularioProducto.onsubmit = (e) => {
          e.preventDefault();
  
          const nombre = formularioProducto.nombre.value.trim();
          const descripcion = formularioProducto.descripcion.value.trim();
          const precio = parseFloat(formularioProducto.precio.value.trim());
          const imagenUrl = formularioProducto.imagenUrl.value.trim();
  
          if (nombre === "" || descripcion === "" || isNaN(precio) || imagenUrl === "") {
            alert("Por favor, completa todos los campos.");
            return;
          }
  
          const productoActualizado = {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            imagenUrl: imagenUrl
          };
  
          productoRef
            .update(productoActualizado)
            .then(() => {
              console.log("Producto actualizado correctamente");
              formularioProducto.reset();
              cargarProductos();
            })
            .catch((error) => {
              console.log("Error al actualizar el producto:", error);
            });
        };
      } else {
        console.log("El producto no existe");
      }
    }).catch((error) => {
      console.log("Error al obtener el producto:", error);
    });
  }
  
  
  // Función para eliminar un producto
  function eliminarProducto(productoId) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      productosRef
        .doc(productoId)
        .delete()
        .then(() => {
          console.log("Producto eliminado correctamente");
          cargarProductos();
        })
        .catch((error) => {
          console.log("Error al eliminar el producto:", error);
        });
    }
  }

  // Verificar que el usuario es administrador
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;
      usuariosRef.doc(uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data.admin) {
              console.log("El usuario es un administrador");
              // El usuario es un administrador, no hacer nada
            } else {
              console.log("El usuario no es un administrador");
              // Redirigir al usuario a la página de inicio de sesión
              window.location.replace("inicioadmin.html");
            }
          } else {
            console.log("No se encontró el usuario en la base de datos");
            // Redirigir al usuario a la página de inicio de sesión
            window.location.replace("inicioadmin.html");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el usuario de la base de datos:", error);
          // Redirigir al usuario a la página de inicio de sesión
          window.location.replace("inicioadmin.html");
        });
    } else {
      console.log("El usuario no está autenticado");
      // Redirigir al usuario a la página de inicio de sesión
      window.location.replace("inicioadmin.html");
    }
  });
  