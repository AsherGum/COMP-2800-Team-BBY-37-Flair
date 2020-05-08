var docID = window.location.href;
docID = docID.substring((docID.length - 20),docID.length);
console.log(docID);

var postOwner;
var ownerTag;

var docRef = database.collection("Challenges").doc(docID);
// Get the document.
docRef.get().then(function(doc) {
    var docUser = database.collection("Users").doc(doc.data().owner);
    docUser.get().then(function (user) {
        ownerTag = user.data().UserName;
        postOwner = doc.data().owner;
        console.log(postOwner);
        console.log(ownerTag);
    });
    
    // Make sure document exists.
    if(doc.exists) {
        // Create the post on the main page.
        createPost(doc.data().challenge, doc.data().description, doc.data().videoURL,
                doc.data().likes, doc.data().views, doc.data().attempts, ownerTag);

    } else {
        // doc.data() will be undefined in this case.
        console.log("No such document!");
    }
});

function createPost(title, description, url, likes, views, attempts, ownerTag){
    // Set page title to post title.
    document.title = title;
    document.getElementById('title').innerHTML = title;
    document.getElementById('video_player').src = url;
    document.getElementById('likes').innerHTML = likes;
    document.getElementById('views').innerHTML = views;
    document.getElementById('attempts').innerHTML = attempts;
    document.getElementById('owner').innerHTML = '@' + ownerTag;
}

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
                    Following: firebase.firestore.FieldValue.arrayUnion( postOwner )
                 });

                // Add current user to second users followers list
                database.collection("Users").doc(postOwner).update( {
                Followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
                });
            }
            //reload page data
            function load_js()
            {
               var head= document.getElementsByTagName('head')[0];
               var script= document.createElement('script');
               script.src= '../javascript/videoHandling/viewVideo.js';
               head.appendChild(script);
            }
            load_js();
        }
    })
});

/* UNCOMMENT AFTER SO WE DON'T WASTE HOSTING
 let url = "https://firebasestorage.googleapis.com/v0/b/mipee-e5ade.appspot.com/o/userVideos%2FOjuArXPajCKPdFrX9ppx%2FchallengeVideo?alt=media&token=3d13082b-55e1-4c9d-9fef-61a69ee16521";

document.getElementById('video_player').src = url;

*/








