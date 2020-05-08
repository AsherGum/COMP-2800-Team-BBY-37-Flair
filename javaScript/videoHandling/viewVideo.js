var docID = window.location.href;
docID = docID.substring((docID.length - 20),docID.length);
console.log(docID);

var docRef = database.collection("userVideos").doc(docID);

// Get the document.
docRef.get().then(function(doc) {
    // Make sure document exists.

    if (doc.exists) {
        // Create the post on the main page.
        createPost(doc.data().challenge, doc.data().description, doc.data().videoURL);

    } else {
        // doc.data() will be undefined in this case.
        console.log("No such document!");
    }
});

function createPost(title, description, url){
    // Set page title to post title.
    document.title = title;
    var video = document.getElementById('video_player');
    video.src = url;
    
} 

/* UNCOMMENT AFTER SO WE DON'T WASTE HOSTING
 let url = "https://firebasestorage.googleapis.com/v0/b/mipee-e5ade.appspot.com/o/userVideos%2FOjuArXPajCKPdFrX9ppx%2FchallengeVideo?alt=media&token=3d13082b-55e1-4c9d-9fef-61a69ee16521";

document.getElementById('video_player').src = url;

*/








