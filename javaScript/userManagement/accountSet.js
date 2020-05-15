// Authentication state observer.
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		// User is signed in.
		console.log("User is logged in");



		// Get User information.
		var docRef = database.collection("Users").doc(user.uid);
		docRef.get().then(function (doc) {
			// Makes sure document exists.
			if (doc.exists) {
				// Reads the data required.
				console.log("Document data:", doc.data());
				document.getElementById("firstName").value = doc.data().FirstName;
				document.getElementById("lastName").value = doc.data().LastName;
				document.getElementById("userName").value = doc.data().UserName;
				document.getElementById("email").value = doc.data().Email;
				document.getElementById("bio").value = doc.data().Bio;
			} else {
				// doc.data() will be undefined in this case.
				console.log("No such document!");
			}
			//Error exception.
		}).catch(function (error) {
			console.log("Error getting document:", error);
		});


	} else {
		// User is signed out.
		console.log("user is logged out");
		// Go to log-in page.
		window.location.href = "./login.html";

	}
});

// Submit button clicked.
$("#submit").closest("form").on("submit", function (event) {
	event.preventDefault();

	// Getting all the values.
	var first = document.getElementById("firstName").value;
	var last = document.getElementById("lastName").value;
	var username = document.getElementById("userName").value;
	var Bio= document.getElementById("bio").value;

	var user = firebase.auth().currentUser;

	// Add user profile to database.
	database.collection("Users").doc(user.uid).update({
			FirstName: first,
			LastName: last,
			Bio: Bio,
			UserName: username

			//Show profile updated alert.
		}).then(function () {
			alert("Profile Updated!");
			console.log("Profile successfully updated!");
			window.location.href = "./account.html";
			
		})
		// Error catch if profile is not able to be updated.
		.catch(function (error) {
			// The document doesn't exist.
			alert("Error updating Profile");
			console.error("Error updating Profile", error);
		});
})

$("#deleteAccount").on('click', function (event){
	// Authentication state observer.
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {

			database.collection("Users").doc(user.uid).delete().then(function() {
				console.log("User Document successfully deleted!");
			}).catch(function(error) {
				console.error("Error removing document: ", error);
			});

			database.collection("Users").where("Followers", "array-contains", user.uid)
			.get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					
					database.collection("Users").doc(doc.id).update({
						Followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
					}).then(result => {
						console.log("deleted from followers")
					}).catch(function(error) {
						console.log("Error getting documents: ", error);
					});
				})
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

			database.collection("Users").where("Following", "array-contains", user.uid)
			.get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					
					database.collection("Users").doc(doc.id).update({
						Following: firebase.firestore.FieldValue.arrayRemove(user.uid)
					}).then(result => {
						console.log("deleted from following")
					}).catch(function(error) {
						console.log("Error getting documents: ", error);
					});
				})
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

			database.collection("Challenges").where("owner", "==", user.uid)
			.get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					
					database.collection("Challenges").doc(doc.id).delete()
					.then(result => {
						console.log("deleted challenge")

						let storageRef = firebase.storage().ref();

						var deleteVid = storageRef.child('userVideos/' + doc.id + "/challengeVideo");
						// Delete the file
						deleteVid.delete().then(function() {
						// File deleted successfully
							console.log("challenge video deleted");
						}).catch(function(error) {
						// Uh-oh, an error occurred!
							console.log("challenge video deletion FAILED");
						});

						var deletePhoto = storageRef.child('userVideosThumbnails/' + doc.id + "/thumbnail");
						// Delete the file
						deletePhoto.delete().then(function() {
						// File deleted successfully
							console.log("challenge video deleted");
						}).catch(function(error) {
						// Uh-oh, an error occurred!
							console.log("challenge photo deletion FAILED");
						});

					}).catch(function(error) {
						console.log("Error getting documents: ", error);
					});


				})
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

			database.collection("userVideos").where("user", "==", user.uid)
			.get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					
					database.collection("userVideos").doc(doc.id).delete()
					.then(result => {
						console.log("deleted challenge")
						let storageRef = firebase.storage().ref();

						var deleteVid = storageRef.child('userVideos/' + doc.id + "/challengeVideo");
						// Delete the file
						deleteVid.delete().then(function() {
						// File deleted successfully
							console.log("challenge video deleted");
						}).catch(function(error) {
						// Uh-oh, an error occurred!
							console.log("challenge video deletion FAILED");
						});

						var deletePhoto = storageRef.child('userVideosThumbnails/' + doc.id + "/thumbnail");
						// Delete the file
						deletePhoto.delete().then(function() {
						// File deleted successfully
							console.log("challenge video deleted");
						}).catch(function(error) {
						// Uh-oh, an error occurred!
							console.log("challenge video deletion FAILED");
						});
					}).catch(function(error) {
						console.log("Error getting documents: ", error);
					});
					
				})
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

		} else {
		// User is signed out.
		console.log("user is logged out");
		// Go to login page
		window.location.href = "../html/login.html";
		}
	});
	
})
