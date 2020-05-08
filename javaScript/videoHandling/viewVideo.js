var docID = window.location.href;
docID = docID.substring((docID.length - 20),docID.length);
console.log(docID);

document.getElementById("submit_link").href = "./uploadResponse.html?challenge:" + docID;

var postOwner;
var ownerTag;

var docRef = database.collection("Challenges").doc(docID);
// Get the document.
docRef.get().then(function(doc) {
    const dataDoc = doc;

    var docUser = database.collection("Users").doc(doc.data().owner);
    docUser.get().then(function (user) {
        ownerTag = user.data().UserName;
        postOwner = doc.data().owner;
        console.log(postOwner);
        console.log(ownerTag);

    // Create the post on the main page.
    
    }).then(function() {
        createPost(dataDoc);
    });

    
});

function createPost(doc){
    // Set page title to post title.
    document.title = doc.data().challenge;
    document.getElementById('title').innerHTML = doc.data().challenge;
    document.getElementById('video_player').src = doc.data().videoURL;
    document.getElementById('likes').innerHTML = doc.data().upvotes;
    document.getElementById('views').innerHTML = doc.data().views;
    document.getElementById('attempts').innerHTML = doc.data().attempts;
    document.getElementById('owner').innerHTML = '@' + ownerTag;
    document.getElementById('description').innerHTML = doc.data().description;

    let tagsArray = doc.data().tags;
    let tagsContainer = document.getElementById("tag_container");

    tagsArray.forEach(element => {
        const listItem = document.createElement("li");
        listItem.innerHTML = element;
        tagsContainer.appendChild(listItem);
    });
    

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

$("")

/* UNCOMMENT AFTER SO WE DON'T WASTE HOSTING
 let url = "https://firebasestorage.googleapis.com/v0/b/mipee-e5ade.appspot.com/o/userVideos%2FOjuArXPajCKPdFrX9ppx%2FchallengeVideo?alt=media&token=3d13082b-55e1-4c9d-9fef-61a69ee16521";

document.getElementById('video_player').src = url;

*/








