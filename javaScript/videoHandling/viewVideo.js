var docID = window.location.href;
docID = docID.substring((docID.length - 20),docID.length);
console.log(docID);

//Updates the links on the buttons
document.getElementById("submit_link").href = "./uploadResponse.html?challenge:" + docID;



var postOwner;
var ownerTag;

var docRef = database.collection("Challenges").doc(docID);
// Get the document.
docRef.get().then(function(doc) {
    let userData;
    const dataDoc = doc;
    let newViewCount = doc.data().views;
    newViewCount++;
    console.log(newViewCount);

    

    //update the view challenge attempts link
    document.getElementById("view_attempts").href = "./viewChallengeResponses.html?challenge:" + docID + "?" + doc.data().challenge;

    var docUser = database.collection("Users").doc(doc.data().owner);
    docUser.get().then(function (user) {
        userData = user;
        ownerTag = user.data().UserName;
        postOwner = doc.data().owner;

        var currentUser = firebase.auth().currentUser;

        if(postOwner == currentUser.uid){
            document.getElementById("follow").style.display = "none";
        }
    // Populate the DOM on the main page.
    }).then(function() {
        createPost(dataDoc);

        //Check if user has liked the video or not, then
        //toggle the button if true 
        if (userData.data().likedVideos.includes(docID)) {
            upvoteBorderToggle(true);
        } else {
            upvoteBorderToggle(false);
        }

        //Increment the views count of the video
        database.collection("Challenges").doc(docID).update({
            views: newViewCount
        })
        .catch(error => {
            console.log(error);
        })
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
    
    //Goes to post owners profile page
    document.getElementById('owner').addEventListener('click', function(){
        window.location.href = "../html/account.html?view:" + doc.data().owner;
    })

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


function upvoteButtonHandler() {
    //Needs to check if user has liked video before
    // Get the users data.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Checks if user is verified.
            if (user.emailVerified === false) {
                alert("You have not verified your email.\nPlease verify by clicking on the link sent to your email.")
                return;
            } else {
                // Successful login.
                //get the user data
                database.collection("Users").doc(user.uid).get()
                .then(userData => {
                    const likedVideos = userData.data().likedVideos;

                    //Check if liked video is in their data
                    //If it's true, then remove it from the liked videos data array
                    //Decrease likes on the video
                    //Unborder the thumbs up button
                    if (likedVideos.includes(docID)) {
                        database.collection("Users").doc(user.uid).update({
                            likedVideos: firebase.firestore.FieldValue.arrayRemove(docID)
                        }).then(result => {

                            //unborder thumbs up button
                            upvoteBorderToggle(false);
                            
                            //Get current likes, and make an adjusted value
                            let updatedLikes;
                            database.collection("Challenges").doc(docID).get()
                            .then(challengeData => {
                                updatedLikes = challengeData.data().upvotes;

                                updatedLikes > 0 ? updatedLikes-- : updatedLikes = 0; 

                                //update the likes
                                database.collection("Challenges").doc(docID).update({
                                    upvotes: updatedLikes
                                })
                                .then(result => {
                                    document.getElementById("likes").innerHTML = updatedLikes;
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            })

                        })
                        
                    //The liked video is not in their data
                    //Add it to their liked videos array
                    } else {
                        database.collection("Users").doc(user.uid).update({
                            likedVideos: firebase.firestore.FieldValue.arrayUnion(docID)
                        }).then(result => {
                            
                            //Update border of upvote button
                            upvoteBorderToggle(true);

                            //Update likes
                            let updatedLikes;
                            database.collection("Challenges").doc(docID).get()
                            .then(challengeData => {
                                updatedLikes = challengeData.data().upvotes;
                                updatedLikes++;

                                database.collection("Challenges").doc(docID).update({
                                    upvotes: updatedLikes
                                })
                                .then(result => {
                                    document.getElementById("likes").innerHTML = updatedLikes;
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            })
                        })

                    }

                    
                })

                //
            }
        }
    })
}



/**
 * Used to add or remove a border to the thumbs up icon,
 * indicating whether user has liked or hasn't liked the video yet.
 * 
 * If the video is liked, add the border, otherwise, don't. 
 * Can alter to not be a border but something more visually exciting later.
 * @param {boolean} isVideoLiked 
 */
function upvoteBorderToggle (isVideoLiked) {
    const thumbsUpButton = document.getElementById("thumbsUp");

    if (isVideoLiked) {
        thumbsUpButton.style.border = "4px solid blue";
    } else {
        thumbsUpButton.style.border = "none";
    }
}



//Hook the event handler to the upvote button
document.getElementById("thumbsUp").onclick = upvoteButtonHandler;