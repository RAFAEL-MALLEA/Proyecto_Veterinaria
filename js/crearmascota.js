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

var usuariosRef = firebase.firestore().collection("usuarios");

function addPet() {
    var ownerEmail = document.getElementById("owner-email").value;
    var petName = document.getElementById("pet-name").value;
    var petBirthdate = document.getElementById("pet-birthdate").value;
    var vaccinated = document.getElementById("vaccinated").checked;
    
    // Obtener el UID del propietario a través de su correo electrónico
    var ownerUid = "";
    firebase.firestore().collection("usuarios")
      .where("email", "==", ownerEmail)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          ownerUid = doc.id;
        });
        
        // Agregar la mascota a la colección "mascotas" con el UID del propietario
        firebase.firestore().collection("mascotas").add({
          nombre: petName,
          fechaNacimiento: petBirthdate,
          vacunasAlDia: vaccinated,
          propietarioUid: ownerUid
        })
        .then((docRef) => {
          console.log("Mascota agregada correctamente con ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error al agregar la mascota: ", error);
        });
      })
      .catch((error) => {
        console.error("Error al obtener el UID del propietario: ", error);
      });
  }
  // Obtener la tabla y el cuerpo de la tabla
var table = document.querySelector("table");
var tableBody = document.querySelector("#table-body");

// Eliminar las filas existentes en la tabla
while (tableBody.firstChild) {
  tableBody.removeChild(tableBody.firstChild);
}

// Recuperar los datos de la colección "mascotas" de Firebase
firebase.firestore().collection("mascotas").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var pet = doc.data();
      
      // Crear una nueva fila en la tabla para cada mascota
      var newRow = document.createElement("tr");
      
      // Crear celdas para cada columna de la fila
      var nameCell = document.createElement("td");
      nameCell.textContent = pet.nombre;
      newRow.appendChild(nameCell);
      
      var birthdateCell = document.createElement("td");
      birthdateCell.textContent = pet.fechaNacimiento;
      newRow.appendChild(birthdateCell);
      
      var vaccinatedCell = document.createElement("td");
      vaccinatedCell.textContent = pet.vacunasAlDia ? "Sí" : "No";
      newRow.appendChild(vaccinatedCell);
      
      // Obtener el nombre del propietario a través de su UID
      firebase.firestore().collection("usuarios").doc(pet.propietarioUid).get()
        .then((doc) => {
          var ownerName = doc.data().nombre + " " +doc.data().apellido;
          var emailowner = doc.data().email;
          
          var ownerCell = document.createElement("td");
          ownerCell.textContent = ownerName;
          newRow.appendChild(ownerCell);

          var emailownercell = document.createElement("td");
          emailownercell.textContent = emailowner;
          newRow.appendChild(emailownercell);
          
          // Agregar la fila a la tabla
          tableBody.appendChild(newRow);
        })
        .catch((error) => {
          console.error("Error al obtener el nombre del propietario: ", error);
        });
    });
  })
  .catch((error) => {
    console.error("Error al obtener las mascotas: ", error);
  });

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
