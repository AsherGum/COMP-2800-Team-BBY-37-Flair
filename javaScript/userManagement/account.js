// Gets the user uid of the clicked account page
var globalUser = localStorage.getItem("globalUser")
console.log(globalUser);

// Authentication state observer.

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
        //globalUser = user.uid;
        // User is signed in.

        /*
        var ref = firebase.database().ref('/Users/' + user.uid + '/following');
        ref.once(globalUser).then(function(snap) {
            var array = snap.val();
            for (var i in array) {
                var value = array[i]
                console.log(value);
                if (value == globalUser) {
                    console.log("found user");
                }
            }
        }); 

        if (globalUser === user.uid){
            document.getElementById("follow").style.display = "none"
        }*/

		// Get User information.
		var docRef = database.collection("Users").doc(globalUser);
		docRef.get().then(function (doc) {
			// Makes sure document exists.
			if (doc.exists) {
				// Reads the data required.
				document.getElementById("accountName").innerHTML = doc.data().UserName;
				//document.getElementById("last").innerHTML = doc.data().LastName;
				document.getElementById("username").innerHTML = "@" + doc.data().UserName;
				//document.getElementById("email").innerHTML = doc.data().Email;
				//document.getElementById("university").innerHTML = doc.data().UserName;
                //document.getElementById("phone").innerHTML = doc.data().PhoneNumber;
                document.getElementById("followers").innerHTML = doc.data().Followers.length;
                document.getElementById("following").innerHTML = doc.data().Following.length;
                document.getElementById("challenges").innerHTML = doc.data().Challenges.length;
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
        window.location.href = "../html/login.html";
        

	}
});

// When user clicks Follow button
$("#follow").click(function(){
    // Get the users data.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Checks if user is verified.
            if (user.emailVerified === false) {
                alert("You have not verified your email.\nPlease verify by clicking on the link sent to your email.")
                return;
            } else {
                // Successful login.
                // Add second user to Current users following list
                database.collection("Users").doc(user.uid).update( {
                    Following: firebase.firestore.FieldValue.arrayUnion( globalUser )
                 });

                // Add current user to second users followers list
                database.collection("Users").doc( globalUser ).update( {
                Followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
                });
            }
            //reload page data
            function load_js()
            {
               var head= document.getElementsByTagName('head')[0];
               var script= document.createElement('script');
               script.src= '../javascript/userManagement/account.js';
               head.appendChild(script);
            }
            load_js();
        }
    })
});