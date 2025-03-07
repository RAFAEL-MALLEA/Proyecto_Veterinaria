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
  
  // Obtener los elementos del formulario
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  // Autenticar al usuario al enviar el formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
  
    // Obtener los valores de los campos de correo electrónico y contraseña
    const email = emailInput.value;
    const password = passwordInput.value;
  
    // Autenticar al usuario con Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Verificar que el usuario es administrador
        const user = userCredential.user;
        const db = firebase.firestore();
        const usuariosRef = db.collection("usuarios");
        const uid = user.uid;
        usuariosRef.doc(uid).get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              if (data.admin) {
                console.log("El usuario es un administrador");
                // Redirigir al usuario a la página de administrador
                window.location.replace("aumentar.html");
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
            window.location.replace("inicio.html");
          });
      })
      .catch((error) => {
        console.log("Error al iniciar sesión:", error);
        // Redirigir al usuario a la página de inicio de sesión
        window.location.replace("inicioadmin.html");
      });
  });

  
  