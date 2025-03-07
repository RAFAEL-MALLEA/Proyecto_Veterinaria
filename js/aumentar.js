
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

// Obtener la referencia a la colección usuarios en Firestore
const db = firebase.firestore();
const usuariosRef = db.collection("usuarios");

// Obtener la tabla donde se mostrarán los usuarios
const usuariosTable = document.getElementById("usuarios-table");

// Obtener el input para ingresar el valor a aumentar
const aumentoInput = document.getElementById("aumento-input");

// Obtener el botón para aumentar el saldo
const aumentarButton = document.getElementById("aumentar-button");

// Obtener el botón para aumentar el saldo
const disminuirBoton = document.getElementById("disminuir-button");

// Obtener todos los documentos de la colección usuarios
usuariosRef
.where("activo", "==", true)
.get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    // Obtener los datos del usuario actual
    const data = doc.data();

    // Crear una nueva fila en la tabla
    const row = usuariosTable.insertRow();

    // Agregar el email del usuario como una celda en la fila
    const emailCell = row.insertCell();
    emailCell.textContent = data.email;

    // Agregar el nombre del usuario como una celda en la fila
    const nombrecell = row.insertCell();
    nombrecell.textContent = data.nombre;

    // Agregar el nombre del usuario como una celda en la fila
    const apellidocell = row.insertCell();
    apellidocell.textContent = data.apellido;

    // Agregar el balance del usuario como una celda en la fila
    const balanceCell = row.insertCell();
    balanceCell.textContent = data.balance;

    // Agregar un input para ingresar el valor a aumentar en la fila
    const aumentoInputCell = row.insertCell();
    const input = document.createElement("input");
    input.type = "number";
    aumentoInputCell.appendChild(input);

    // Agregar un botón "Aumentar" en la fila
    const aumentarCell = row.insertCell();
    const button = document.createElement("button");
    button.textContent = "Aumentar";
    button.addEventListener("click", () => {
        const aumento = parseInt(input.value);
        aumentarBalance(doc.id, aumento);
    });
    aumentarCell.appendChild(button);
    // Agregar un botón "Disminuir" en la fila
    const disminuirCell = row.insertCell();
    const boton = document.createElement("button");
    boton.textContent = "Disminuir";
    boton.addEventListener("click", () => {
        const disminucion = parseInt(input.value);
        disminuirBalance(doc.id, disminucion);
    });
    disminuirCell.appendChild(boton);
    });
})
.catch((error) => {
    console.log("Error al obtener los usuarios:", error);
});

// Función para aumentar el balance de un usuario en Firestore
function aumentarBalance(usuarioId, aumento) {
// Obtener el documento del usuario correspondiente
const usuarioDoc = usuariosRef.doc(usuarioId);
usuarioDoc
    .get()
    .then((doc) => {
    if (doc.exists) {
        const data = doc.data();

        // Mostrar el balance actual del usuario
        console.log(`El balance actual del usuario es: ${data.balance}`);

        // Aumentar el balance del usuario con el valor ingresado
        const newBalance = data.balance + aumento;

        // Actualizar el balance del usuario en la base de datos
        usuariosRef
        .doc(usuarioId)
        .update({
            balance: newBalance,
        })
        .then(() => {
            console.log(
            "Se ha actualizado el balance del usuario correctamente"
            );
            location.reload()
        })
        .catch((error) => {
            console.error(
            "Error al actualizar el balance del usuario:",
            error
            );
        });
    }
    })
    .catch((error) => {
    console.error("Error al obtener el documento del usuario:", error);
    });
}

// Función para disminuir el balance de un usuario en Firestore
function disminuirBalance(usuarioId, aumento) {
  // Obtener el documento del usuario correspondiente
  const usuarioDoc = usuariosRef.doc(usuarioId);
  usuarioDoc
      .get()
      .then((doc) => {
      if (doc.exists) {
          const data = doc.data();
  
          // Mostrar el balance actual del usuario
          console.log(`El balance actual del usuario es: ${data.balance}`);
  
          // Aumentar el balance del usuario con el valor ingresado
          const newBalance = data.balance - aumento;
  
          // Actualizar el balance del usuario en la base de datos
          usuariosRef
          .doc(usuarioId)
          .update({
              balance: newBalance,
          })
          .then(() => {
              console.log(
              "Se ha actualizado el balance del usuario correctamente"
              );
              location.reload()
          })
          .catch((error) => {
              console.error(
              "Error al actualizar el balance del usuario:",
              error
              );
          });
      }
      })
      .catch((error) => {
      console.error("Error al obtener el documento del usuario:", error);
      });
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

// Obtener el botón para cerrar sesión
const logoutButton = document.getElementById("logout-button");

// Agregar un listener al botón de cerrar sesión
logoutButton.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    // Redirigir al usuario a la página de inicio de sesión
    window.location.replace("inicio.html");
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error);
  });
});

// Obtener el botón mascotas
const mascotas = document.getElementById("mascotas");

// Agregar un listener al botón de cerrar sesión
mascotas.addEventListener("click", () => {
  window.location.replace("crearmascota.html")
});


// Obtener el botón pedidos
const pedidos = document.getElementById("pedidos");

// Agregar un listener al botón de cerrar sesión
pedidos.addEventListener("click", () => {
  window.location.replace("listapedidos.html")
});

// Obtener el botón pedidos
const productos = document.getElementById("productos");

// Agregar un listener al botón de cerrar sesión
productos.addEventListener("click", () => {
  window.location.replace("crearproducto.html")
});