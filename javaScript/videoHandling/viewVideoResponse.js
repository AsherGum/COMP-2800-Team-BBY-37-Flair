//Variables used to parse the Website URL
const responseIDArray = parseSearchURL();
const responseID = responseIDArray[0];
const parentID = parseURLParentID(2);
const title = parseURLParentID(3);

//Updates the links on the buttons
document.getElementById("submit_link").href = "./uploadResponse.html?challenge:" + parentID;
document.getElementById("view_attempts").href = "./viewChallengeResponses.html?challenge:" + parentID + "?" + title;
document.getElementById("challenge_title").innerHTML = title;

//The user docID of the response video
let postOwner;

//The username of the response video
let ownerTag;

//Turn on the loading circle on page load
loading("loading_insertion", true);

/**
 * Loads Challenge response videos from the database by finding the document
 * with response id that is taken from parsing the URL.
 * 
 * Uses code from:
 * Firebase documentation on how to read info from database:
 * @author Firebase documentation
 * @see https://firebase.google.com/docs/database/web/read-and-write?authuser=0
 */
let docRef = database.collection("userVideos").doc(responseID);
// Get the document.
docRef.get().then(function (doc) {
    const dataDoc = doc;
    let newViewCount = doc.data().views;
    newViewCount++;
    let userData;
    //Goes to post owners profile page
    document.getElementById('owner').addEventListener('click', function () {
        window.location.href = "../html/account.html?view:" + doc.data().user;
    })

    //update the view challenge attempts link
    let docUser = database.collection("Users").doc(dataDoc.data().user);
    docUser.get().then(function (user) {
        ownerTag = user.data().UserName;
        postOwner = doc.data().owner;
        userData = user.data();

        // populate the dom with the elements on the main page.
    }).then(function () {
        getVideoData(dataDoc);

        //Check if user has liked the video or not, then
        //toggle the button if true 
        if (userData.likedVideos.includes(responseID)) {
            upvoteBorderToggle(true);
        } else {
            upvoteBorderToggle(false);
        }

        //Increment the views count of the video
        database.collection("userVideos").doc(responseID).update({
                views: newViewCount
            })
            .then(function () {
                //Turn off the loading circle
                loading("loading_insertion", false);
            })
            .catch(error => {
                console.log(error);
            })
    });
});


/**
 * Called when inputting video information into html elements.
 * 
 * @param {FirebaseObject} doc 
 */
function getVideoData(doc) {
    // Set page title to post title.
    document.title = doc.data().challenge;
    document.getElementById('title').innerHTML = doc.data().title;
    document.getElementById('video_player').src = doc.data().videoURL;
    document.getElementById('likes').innerHTML = doc.data().upvotes;
    document.getElementById('views').innerHTML = doc.data().views;
    document.getElementById('owner').innerHTML = '@' + ownerTag;
    document.getElementById('description').innerHTML = doc.data().description;

}

/**
 * Handles the onclick event when the user
 * clicks the follow button. Adds the author of
 * the challenge video to the users "following" datafield
 * and also adds the user to the author's "follwers" datafield.
 * 
 * Uses code from:
 * Firebase Documentation for updating data documents:
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/database/web/read-and-write?authuser=0
 */
$("#follow").click(function () {
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
                database.collection("Users").doc(user.uid).update({
                    Following: firebase.firestore.FieldValue.arrayUnion(postOwner)
                });

                // Add current user to second users followers list
                database.collection("Users").doc(postOwner).update({
                    Followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
                });
            }
            //reload page data
            function load_js() {
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                script.src = '../javascript/videoHandling/viewVideo.js';
                head.appendChild(script);
            }
            load_js();
        }
    })
});

$("")


/**
 * Gets the challenge video ID from the passed URL values
 * 
 */
function parseURLParentID(number) {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("?");
    let searchQueries = queries[number];
    return searchQueries;
}

/**
 * Called when the upvote button is pushed.
 * Checks if the user has liked the video before.
 * This is tracked in the users data, in a likedVideos array.
 * 
 * If the video docID is inside the array, then the user has liked
 * the video, and they are "unliking" the video. Decrement 
 * upvote field in video data and remove video docID from the likedVideos array.
 * 
 * If the video docID is not inside the array, then the user
 * has not liked the video, and they are 'liking" the video. Increment
 * upvote field in video data and add video docID to the likedVideos array.
 * 
 * Uses code from:
 * Firebase documentation on handling user authentication state:
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/manage-users?authuser=0
 * 
 * Firebase documentation on getting data documents from database
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/database/web/read-and-write?authuser=0
 * 
 * 
 */
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
                        if (likedVideos.includes(responseID)) {
                            database.collection("Users").doc(user.uid).update({
                                likedVideos: firebase.firestore.FieldValue.arrayRemove(responseID)
                            }).then(result => {

                                //unborder thumbs up button
                                upvoteBorderToggle(false);

                                //Get current likes, and make an adjusted value
                                let updatedLikes;
                                database.collection("userVideos").doc(responseID).get()
                                    .then(challengeData => {
                                        updatedLikes = challengeData.data().upvotes;

                                        updatedLikes > 0 ? updatedLikes-- : updatedLikes = 0;

                                        //update the likes
                                        database.collection("userVideos").doc(responseID).update({
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
                                likedVideos: firebase.firestore.FieldValue.arrayUnion(responseID)
                            }).then(result => {

                                //Update border of upvote button
                                upvoteBorderToggle(true);

                                //Update likes
                                let updatedLikes;
                                database.collection("userVideos").doc(responseID).get()
                                    .then(challengeData => {
                                        updatedLikes = challengeData.data().upvotes;
                                        updatedLikes++;

                                        database.collection("userVideos").doc(responseID).update({
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
function upvoteBorderToggle(isVideoLiked) {
    const thumbsUpButton = document.getElementById("thumbsUp");

    if (isVideoLiked) {
        thumbsUpButton.style.border = "4px solid blue";
    } else {
        thumbsUpButton.style.border = "none";
    }
}



//Hook the event handler to the upvote button
document.getElementById("thumbsUp").onclick = upvoteButtonHandler;