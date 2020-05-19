// Gets the user uid of the clicked account page
var globalUser = window.location.href;
globalUser = globalUser.substring((globalUser.length - 28),globalUser.length);
let home = true;
// Body.
let body = document.getElementsByTagName("body");
// Main container.
let content = document.getElementsByClassName("userVideos")[0];


// Authentication state observer.
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
        if(globalUser.substring((globalUser.length - 12),globalUser.length) == "account.html"){
            globalUser = user.uid;
            
        } else{
            document.getElementById("editProf").style.display = 'none';
        }
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
                upImages();
				document.getElementById("accountName").innerHTML = doc.data().UserName;
				//document.getElementById("last").innerHTML = doc.data().LastName;
				document.getElementById("username").innerHTML = "@" + doc.data().UserName;
				//document.getElementById("email").innerHTML = doc.data().Email;
				//document.getElementById("university").innerHTML = doc.data().UserName;
                //document.getElementById("phone").innerHTML = doc.data().PhoneNumber;
                document.getElementById("userBio").innerHTML = doc.data().Bio;
                //document.getElementById("followers").innerHTML = doc.data().Followers.length;
                //document.getElementById("following").innerHTML = doc.data().Following.length;
                //document.getElementById("challenges").innerHTML = doc.data().Challenges.length;
                let docRef = database.collection("Challenges")
                docRef.where("owner", "==", globalUser).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (post) {
                        if (post) {
                            // Create the post.
                            createPost(post.data().challenge,
                                        post.data().imageURL,
                                        post.data().videoURL,
                                        post.id, post.data().owner, post.data().upvotes);
                        }
                    })
                })

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

//For about us Images
function upImages(){


    if(globalUser === "3WFqhgsdkcezIYV9KtIaE4vhWwm2"){
        document.getElementById("profilePic").src = "../images/3WFqhgsdkcezIYV9KtIaE4vhWwm2.jpg";
        document.getElementById("edit").style.display = "none";
    }
    if(globalUser === "NNeTyFBC1SS9xbV41tCYfxcjWjA2"){
        document.getElementById("profilePic").src = "../images/NNeTyFBC1SS9xbV41tCYfxcjWjA2.jpeg";
        document.getElementById("edit").style.display = "none";
    }
    if(globalUser === "YjdDZklmHceFXMz9vaG1P0WwIru2"){
        document.getElementById("profilePic").src = "../images/YjdDZklmHceFXMz9vaG1P0WwIru2.JPG";
        document.getElementById("edit").style.display = "none";
    }
    if(globalUser ==="TRNhtP0v5pYfNDnBeaY19CfPmwu2"){
        document.getElementById("profilePic").src = "../images/TRNhtP0v5pYfNDnBeaY19CfPmwu2.jpg";
        document.getElementById("edit").style.display = "none";
    }
}


$("#home-tab").on('click', function (param) {
    if(!home){
        home = true;
        var child = document.getElementsByClassName("userVideos")[0].lastElementChild;  
        while (child) { 
            document.getElementsByClassName("userVideos")[0].removeChild(child); 
            child = document.getElementsByClassName("userVideos")[0].lastElementChild; 
        }
    
        let docRef = database.collection("Challenges")
        docRef.where("owner", "==", globalUser).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (post) {
                if (post) {
                    // Create the post.
                    createPost(post.data().challenge,
                                post.data().imageURL,
                                post.data().videoURL,
                                post.id, post.data().upvotes);
                }
            })
        })
    }
})


$("#profile-tab").on('click', function (param) {
    if(home){
        home = false;
        var child = document.getElementsByClassName("userVideos")[0].lastElementChild;  
        while (child) { 
            document.getElementsByClassName("userVideos")[0].removeChild(child); 
            child = document.getElementsByClassName("userVideos")[0].lastElementChild; 
        }
    }

    database.collectionGroup("Responses").where("user", "==", globalUser).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (post) {
            if (post) {
                console.log("here");
                // Create the post.
                createPost(post.data().challenge,
                            post.data().imageURL,
                            post.data().videoURL,
                            post.id, post.data().upvotes);
            }
        })
    })
})



//Create a posting with its title, image URL (picture), and unique ID (to keep track of post) as inputs
function createPost(title, imageURL, videoURL, id, likesCount) {

    // Create the post on the main page.
    var vidBox = document.createElement("div");
    vidBox.className = "card";

    // Getting images.
    var img = document.createElement("img");
    img.src = imageURL;
    img.id = id;
    img.onclick = function() {
    window.location.href = "../html/viewVideo.html?view:" + id;
    }

    var info = document.createElement("p");
    info.innerHTML = title;

    var like = document.createElement('img');
    like.src = "../images/icons/like.png"
    like.id = "view";

    var likes = document.createElement("h4");
    likes.id = "likes";
    likes.innerHTML = likesCount;


    content.appendChild(vidBox);
    vidBox.appendChild(info);
    vidBox.appendChild(like);
    vidBox.appendChild(likes);
    vidBox.appendChild(img);
    
}