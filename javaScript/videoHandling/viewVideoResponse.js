
const responseIDArray = parseSearchURL();
const responseID = responseIDArray[0];
console.log(responseID);

const parentID = parseURLParentID(2);
const title = parseURLParentID(3);

console.log(title);


//Updates the links on the buttons
document.getElementById("submit_link").href = "./uploadResponse.html?challenge:" + parentID;
document.getElementById("view_attempts").href = "./viewChallengeResponses.html?challenge:" + parentID + "?" + title;

document.getElementById("challenge_title").innerHTML = title;

var postOwner;
var ownerTag;

var docRef = database.collection("userVideos").doc(responseID);
// Get the document.
docRef.get().then(function(doc) {
    const dataDoc = doc;

    //update the view challenge attempts link
    console.log("infunction");

    var docUser = database.collection("Users").doc(dataDoc.data().user);
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
    document.getElementById('title').innerHTML = doc.data().title;
    document.getElementById('video_player').src = doc.data().videoURL;
    document.getElementById('likes').innerHTML = doc.data().upvotes;
    document.getElementById('views').innerHTML = doc.data().views;
    document.getElementById('owner').innerHTML = '@' + ownerTag;
    document.getElementById('description').innerHTML = doc.data().description;
    

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



function parseURLParentID(number) {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("?");
    let searchQueries = queries[number];
    return searchQueries;
}




