//Sign up button clicked.
$("#submit").closest('form').on('submit', function (event) {
	event.preventDefault();
	// Loading in email, password, first and last name, and university of user.
	let userEmail = document.getElementById("email").value;
	let userPassword = document.getElementById("password").value;
	let userName = document.getElementById("username").value;

	// Create user.
	firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function(result) {
		
	  }).catch(function(error) {
		// Handle error.
		console.log(error);
	  });

	//Authentication state observer.
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			// Add user Profile to database.
			database.collection("Users").doc(user.uid).set({
				Email: user.email,
				FirstName: "",
				LastName: "",
				PhoneNumber: "",
				UserName: userName,
				profilePicture: "",
				likedVideos: [],
				Followers:[],
				Following:[],
				Challenges:[],
				isVerified: false

			});
			console.log("user is logged in");

			//Send email verification to user's email.
			user.sendEmailVerification().then(function() {
				// Email sent.

				//Upload user data to database.
				let docRef = database.collection("Users").doc(user.uid);
				docRef.get().then(function (doc) {
					// Makes sure document exists.
					if (doc.exists) {
						console.log("Document data:", doc.data());
						if (userFirstName == doc.data().FirstName) {
							window.location.href = "main.html";
						}
					} else {
						// doc.data() will be undefined in this case.
						console.log("No such document!");
						alert("Your Account was not Made");
					}
					//Catches error getting document exception.
				}).catch(function (error) {
					console.log("Error getting document:", error);
				});
			  }).catch(function(error) {
				// An error happened.
			});


		} else {
			// User is signed out.
			console.log("user is logged out");
		}


	});
});


//event listener for username input to check if it's empty
document.getElementById('username').addEventListener('focusout', function() {
    checkEmptyInput("username");
})

//event listener for email input to check if it's empty
document.getElementById('email').addEventListener('focusout', function() {
    checkEmptyInput("email");
})

//event listener for password input to check if it's empty
document.getElementById('password').addEventListener('focusout', function() {
    checkEmptyInput("password");
})