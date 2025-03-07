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

// Obtener elementos del formulario
const registroForm = document.querySelector('#registro-form');

// Manejar envío del formulario
registroForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// Obtener email y contraseña
	const email = registroForm['email'].value;
	const password = registroForm['password'].value;
	const nombre = registroForm['nombre'].value;
	const apellido = registroForm['apellido'].value;

	// Registrar usuario en Firebase Auth
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Guardar datos del usuario en Firestore
			const db = firebase.firestore();
			const uid = userCredential.user.uid;
			db.collection('usuarios').doc(uid).set({
				activo: true,
				nombre: nombre,
				apellido: apellido,
				email: email,
				balance: 0
			})
			.then(() => {
				console.log('Usuario registrado exitosamente');
				window.location.replace("login.html");
			})
			.catch((error) => {
				console.error('Error al guardar datos del usuario: ', error);
			});
		})
		.catch((error) => {
			console.error('Error al registrar usuario: ', error);
		});
});
