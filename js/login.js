// Configuración de Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBgVBGQkersxYtELSQEsotXtyxyXuqN5kQ",
    authDomain: "veterinariahuellita-8d203.firebaseapp.com",
    projectId: "veterinariahuellita-8d203",
    storageBucket: "veterinariahuellita-8d203.appspot.com",
    messagingSenderId: "833441330192",
    appId: "1:833441330192:web:34dd1ff7f2deb73de90695"
};
  firebase.initializeApp(firebaseConfig);
  
  // Obtener elementos del DOM
  var loginForm = document.getElementById("login-form");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  
  // Manejar el evento submit del formulario
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    var email = emailInput.value;
    var password = passwordInput.value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function() {
        alert("¡Bienvenido!");
        window.location.href = "inicio.html";
      })
      .catch(function(error) {
        alert("Ha ocurrido un error: " + error.message);
      });
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Usuario logueado
      var uid = user.uid;
      // Redirigir al perfil del usuario
      window.location.href = "perfil.html?uid=" + uid;
    } else {
      // Usuario deslogueado
    }
  });

  function crearCuenta() {
    firebase.auth().signOut().then(() => {
      window.location.replace("registro.html");
    });
  }
  function iniciaradmin() {
    firebase.auth().signOut().then(() => {
      window.location.replace("inicioadmin.html");
    });
  }