//Global variable to hold tags added to this challenge
let inputTags = [];


/**
 * Upload Functionality for uploading a
 * RESPONSE VIDEO TO A CHALLENGE
 * 
 * Uploads to the database. Video data and image data goes
 * into Firestore storage, while a database entry is created
 * for reference
 * @param {blob} videoData 
 * @param {string} imageURI 
 */
function videoUpload(videoData, imageURI, userTags) {
    const date = new Date();
    const userTitle = document.getElementById("inputTitle").value;
    const userDescription = document.getElementById("inputDescription").value;
    const userCategory = document.getElementById("inputCategory").value;

    const image = imageURI;
    let docRefID;

    //Quick check for empty strings; Need better validation
    if (userTitle.length === 0 || 
        userDescription.length === 0 || 
        userCategory == null)  {
            //need more elegance than alert in the future
            console.log(userTitle);
            console.log(userDescription);
            console.log(userCategory.value);
            alert("Please complete Title, Category, and Description");
            return;
    }

    //check for user state
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.emailVerified === false) {
                alert("You have not verified your email.\nPlease verify by clicking on the link sent to your email.");
                return;
            }

            //Will need to add some sort of data checking/sanitization here
            const userVideo = videoData;
           
            database.collection("Challenges").add({
                challenge: userTitle,
                owner: user.uid,
                ownerEmail: user.email,
                challengeCategory: userCategory,
                tags: userTags,
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
                inappropriateFlags: 0,
                views: 0,
                attempts: 0,
                

            //Uploading the VIDEO here
            }).then(function (docRef) {
                console.log(`Uploaded with docRef: ${docRef.id}`);
                docRefID = docRef.id;
                let storageRef = firebase.storage().ref();
                let uploadTask = storageRef.child("userVideos/" + docRefID + "/challengeVideo").put(userVideo);

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
                        // Add image URL location.
                        database.collection("Challenges").doc(docRef.id).update({
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
                                    // Add image URL location.
                                    database.collection("Challenges").doc(docRefID).update({
                                        imageURL: downloadURL,
                                    }).then(function () {
                                        console.log("image URL successfully updated!");




                                        // NEED TO REDIRECT USER TO ANOTHER PAGE
                                        window.location.href = "../index.html";
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

/**
 * The handler that is called when add tag button is clicked
 * or enter button is clicked. Checks if there is a blank string
 * and checks if there are already 5 tags attached. 
 */
function addTag() {
    let tagValue = document.getElementById("inputTag").value;
    if (tagValue.length === 0) {
        return;
    }
    if (inputTags.length === 5) {
        return;
    }
    inputTags.push(tagValue);
    createTagButton(tagValue);
}


/**
 * The tag is created as a button that users can click on
 * to remove. Tags are added to the "tags" global array.
 * 
 * @param {string} tagValue 
 */
function createTagButton(tagValue) {
    const tagInsertion = document.getElementById("tags_container");
    const tagButton = document.createElement("button");
    tagButton.innerHTML = tagValue;
    tagButton.type = "button";
    tagButton.classList.add("btn");
    tagButton.classList.add("btn-outline-secondary");
    

    //On click should hide tag and remove it from tags array
    tagButton.onclick = function() {
        this.style.display = "none";
        //Check to see if it's just a 1 element array
        if (inputTags.length === 1) {
            inputTags.pop();
            return;
        }
        //Copy the tags minus the deleted one into a new array
        //Assign the tags array to the new array
        let newTagsArray = [];
        tags.forEach((tag) => {
            if (tag != tagValue) {
                newTagsArray.push(tag);
            }
        });
        inputTags = newTagsArray;
    }

    tagInsertion.appendChild(tagButton);

}

//Clicking the "Add Tag" Button
document.getElementById("add_tag").addEventListener('click', function() {
    addTag();
    document.getElementById("inputTag").value = "";
});

//Typing ENTER instead of clicking the "Add Tag" button
document.getElementById("inputTag").addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTag();
        document.getElementById("inputTag").value = "";
    }
});


/**
 * Button handling for just the challenge video response upload page
 */
document.getElementById('video_upload_button').addEventListener('click', function() {
    let imageURI = createImage();
    videoUpload(data, imageURI, inputTags)
});
