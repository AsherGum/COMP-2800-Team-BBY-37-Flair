// Authentication state observer.
var globalUser;
firebase.auth().onAuthStateChanged(function (user) {
    globalUser = user;
	if (user) {
		// User is signed in.
		console.log("User is logged in");

		// Get User information.
		var docRef = database.collection("Users").doc('3WFqhgsdkcezIYV9KtIaE4vhWwm2');
		docRef.get().then(function (doc) {
			// Makes sure document exists.
			if (doc.exists) {
				// Reads the data required.
				console.log("Document data:", doc.data());
				//document.getElementById("first").innerHTML = doc.data().FirstName;
				//document.getElementById("last").innerHTML = doc.data().LastName;
				document.getElementById("username").innerHTML = "@" + doc.data().UserName;
				//document.getElementById("email").innerHTML = doc.data().Email;
				//document.getElementById("university").innerHTML = doc.data().UserName;
                //document.getElementById("phone").innerHTML = doc.data().PhoneNumber;
                document.getElementById("followers").innerHTML = doc.data().Followers.length;
                document.getElementById("following").innerHTML = doc.data().Following.length;
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

$("#follow").click(function(){
    
})