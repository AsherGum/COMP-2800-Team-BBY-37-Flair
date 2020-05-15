//Sign up button clicked.
$("#submit").closest('form').on('submit', function (event) {
	event.preventDefault();
	// Loading in email, password, first and last name, and university of user.
	var userEmail = document.getElementById("email").value;
	var userPassword = document.getElementById("password").value;
	var userFirstName = document.getElementById("firstName").value;
	var userLastName = document.getElementById("lastName").value;
	var userName = document.getElementById("username").value;

	// Create user.
	firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function(result) {
		// result.user.tenantId should be ‘TENANT_PROJECT_ID’.
	  }).catch(function(error) {
		// Handle error.
		alert(error);
	  });

	//Authentication state observer.
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			// Add user Profile to database.
			database.collection("Users").doc(user.uid).set({
				Email: user.email,
				FirstName: userFirstName,
				LastName: userLastName,
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
				var docRef = database.collection("Users").doc(user.uid);
				docRef.get().then(function (doc) {
					// Makes sure document exists.
					if (doc.exists) {
						console.log("Document data:", doc.data());
						if (userFirstName == doc.data().FirstName) {
							window.location.href = "./home.html";
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
