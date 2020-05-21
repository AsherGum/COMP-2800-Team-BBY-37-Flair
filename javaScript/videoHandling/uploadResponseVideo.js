


/**
 * Upload Functionality for uploading a
 * RESPONSE VIDEO TO A CHALLENGE
 * 
 * 
 * Uploads to the database. Video data and image data goes
 * into Firestore storage, while a database entry is created
 * for reference
 * @param {blob} videoData 
 * @param {string} imageURI 
 */
function videoUpload(videoData, imageURI, challengeDocID) {
    const date = new Date();
    const userDescription = document.getElementById("inputDescription").value.trim();
    const userTitle = document.getElementById("inputTitle").value.trim();
    const image = imageURI;
    let docRefID;
    let userInfo;
    let challengeAttempts;
    let userEmail;

    const maxTitleLength = 150;
    const maxDescLength = 300;

    //check for user state
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.emailVerified === false) {
                alert("You have not verified your email.\nPlease verify by clicking on the link sent to your email.");
                return;
            }

            //Will need to add some sort of data checking here
            const userVideo = videoData;
            userInfo = user.uid;
            userEmail = user.email;
            

            if (userTitle.length === 0 || 
                userTitle.length > maxTitleLength ||
                userDescription.length > maxDescLength ||
                userDescription.length === 0 ||
                videoData == undefined)  {
                    //need more elegance than alert in the future
                    alert("Please complete Title, and Description");
                    return;
            }
           
            database.collection("userVideos").add({
                challenge: challengeDocID,
                title: userTitle,
                user: user.uid,
                userEmail: user.email,
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                videoURL: "",
                upvotes: 0,
                description: userDescription,
                likedBy: "",
                comments: "",
                inAppropriateFlags: 0,
                views: 0,

            //Uploading the VIDEO here
            }).then(function (docRef) {
                console.log(`Uploaded with docRef: ${docRef.id}`);
                docRefID = docRef.id;
                let storageRef = firebase.storage().ref();
                let uploadTask = storageRef.child('userVideos/' + docRefID + "/challengeVideo").put(userVideo);

                //Source: https://firebase.google.com/docs/storage/web/upload-files
                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes.
                // 2. Error observer, called on failure.
                // 3. Completion observer, called on successful completion.
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume.
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded.
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // Handle unsuccessful uploads.
                    console.log("upload failed");
                }, function () {
                    // Handle successful uploads on complete.
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        console.log('File available at', downloadURL);
                        userVideoURL = downloadURL;
                        // Add image URL location.
                        database.collection("userVideos").doc(docRef.id).update({
                            videoURL: downloadURL,
                        }).then(function () {
                            console.log("video URL successfully updated!");

                            //STARTING IMAGE UPLOAD HERE
                            console.log('starting image upload?');
                            let storageRef = firebase.storage().ref();
                            let uploadTask = storageRef.child('userVideosThumbnails/' + docRefID + "/thumbnail").putString(image, 'data_url');

                            // Register three observers:
                            // 1. 'state_changed' observer, called any time the state changes.
                            // 2. Error observer, called on failure.
                            // 3. Completion observer, called on successful completion.
                            uploadTask.on('state_changed', function (snapshot) {
                                // Observe state change events such as progress, pause, and resume.
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded.
                                switch (snapshot.state) {
                                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                                        console.log('Upload is paused');
                                        break;
                                    case firebase.storage.TaskState.RUNNING: // or 'running'
                                        console.log('Upload is running');
                                        break;
                                }
                            }, function (error) {
                                // Handle unsuccessful uploads.
                                console.log("upload failed");
                            }, function () {
                                // Handle successful uploads on complete.
                                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                    console.log('File available at', downloadURL);
                                    let userImageURL = downloadURL;
                                    // Add image URL location.
                                    database.collection("userVideos").doc(docRefID).update({
                                        imageURL: downloadURL,

                                        //Add this challenge video reference to the
                                        //challenge video collection document
                                    }).then(function () {
                                        database.collection('Challenges').doc(challengeDocID).collection('Responses').doc(userInfo).set({
                                            userVideo: docRefID,
                                            user: userInfo,
                                            userEmail: userEmail,
                                            videoURL: userVideoURL,
                                            imageURL: userImageURL

                                        //Increment the attempts value for the challenge
                                        //Get the attempts value and increment it
                                        }).then(function() {
                                            console.log("wrote to challenge document succesfully");
                                            database.collection('Challenges').doc(challengeDocID).get()
                                            .then(function(doc) {
                                                challengeAttempts = doc.data().attempts;
                                                challengeAttempts++;
                                            })
                                            //assign the attempts value
                                            .then(function() {
                                                database.collection('Challenges').doc(challengeDocID).update({
                                                    attempts: challengeAttempts
                                                })
                                                .then(function() {
                                                     window.location.href = "./viewVideoResponse.html?view:" + docRefID;
                                                })
                                            })

                                            
                                        })
                                    });
                                });
                            })

                        }).catch(function(error) {
                            console.log(error);
                        });
                    });
                })
            })
        } else {
            alert("Please log-in before uploading a video!");
            console.log("User wasn't logged in");
        }
     })
}



//event listener for title input to check if it's empty
document.getElementById('inputTitle').addEventListener('focusout', function() {
    checkEmptyInput("inputTitle");
});

//event listener for title input to check the length
document.getElementById('inputTitle').addEventListener('keyup', function() {
    getInputLength("inputTitle", "title-count");
});

//event listener for description input to check if it's empty
document.getElementById('inputDescription').addEventListener('focusout', function() {
    checkEmptyInput("inputDescription");
});

//event listener for description input to check the length
document.getElementById('inputDescription').addEventListener('keyup', function() {
    getInputLength("inputDescription", "desc-count");
});


/**
 * Button handling for just the challenge video response upload page
 */
document.getElementById('video_upload_button').addEventListener('click', function() {
    /*
    parseSearchURL called from general.js
    input URL should be similar to: 
    /html/uploadChallenge.html?challenge:docID
    */
    const challengeDocIDArray = parseSearchURL();
    const challengeDocIDString = challengeDocIDArray[0];


    let imageURI = createImage();

    let confirmation = window.confirm("Are you sure you want to upload your video?");
    if (confirmation) {
        attemptedUpload = true;
        videoUpload(data, imageURI, challengeDocIDString);
    } else {
        return;
    }
    
});

/**
 * button handling for the reset button
 */

document.getElementById("reset_button").addEventListener('click', function() {
    let confirm = window.confirm("Are you sure you want to reset your data?");

    if (confirm) {
        clearInputField("inputTitle");
        clearInputField("inputDescription");
        
    } else {
        return;
    }
})

/**
 * Called on page load to populate challenge
 * title as well as update the href on the back to challenge button
 */
function getChallengeInfo() {
    const challengeDocIDArray = parseSearchURL();
    const challengeDocIDString = challengeDocIDArray[0];

    database.collection("Challenges").doc(challengeDocIDString).get()
    .then(doc => {
        const backButton = document.getElementById("back-challenge");
        const title = document.getElementById("challenge-title");

        backButton.href = "./viewVideo.html?view:" + challengeDocIDString;
        title.innerHTML = doc.data().challenge;
    })
}

window.onload = function() {
    getChallengeInfo();
}
