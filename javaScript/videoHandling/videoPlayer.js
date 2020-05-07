var options = {
    controls: true,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
        record: {
            audio: true,
            video: true,
            maxLength: 5,
            debug: true
        }
    }
};

// apply some workarounds for opera browser
applyVideoWorkaround();

var player = videojs('myVideo', options, function() {
    // print version information at startup
    var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
    videojs.log(msg);
});

// error handling
player.on('deviceError', function() {
    console.log('device error:', player.deviceErrorCode);
});

player.on('error', function(element, error) {
    console.error(error);
});

// user clicked the record button and started recording
player.on('startRecord', function() {
    console.log('started recording!');
});

let data;
// user completed recording and stream is available
player.on('finishRecord', function() {
    // the blob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    
    data = player.recordedData;
    let formData = new FormData();
    formData.append('file', data, data.name);

    console.log('finished recording: ', data);
        
});
    


function videoUpload(videoData) {
    const date = new Date();
    const userDescription = document.getElementById("inputDescription").value;

     firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.emailVerified === false) {
                alert("You have not verified your email.\nPlease verify by clicking on the link sent to your email.");
                return;
            }

            //Will need to add some sort of data checking here
            const userVideo = videoData;
           
            database.collection("userVideos").add({
                challenge: "testValue",
                user: user.uid,
                userEmail: user.email,
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                videoURL: "",
                upvotes: 0,
                description: userDescription


            }).then(function (docRef) {
                console.log(`Uploaded with docRef: ${docRef.id}`);
                let storageRef = firebase.storage().ref();
                let uploadTask = storageRef.child('userVideos/' + docRef.id + "/challengeVideo").put(userVideo);

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
                        database.collection("userVideos").doc(docRef.id).update({
                            videoURL: downloadURL,
                        }).then(function () {
                            console.log("URL successfully updated!");




                            // NEED TO REDIRECT USER TO ANOTHER PAGE
                            window.location.href = "../index.html";
                        });
                    });
                })
            });
        } else {
            alert("Please log-in before uploading a video!");
            console.log("User wasn't logged in");
        }
     })
}

document.getElementById('video_upload_button').addEventListener('click', function() {
    videoUpload(data);
});

