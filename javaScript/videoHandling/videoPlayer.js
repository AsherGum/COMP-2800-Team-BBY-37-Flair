/**
 * This file uses all its video handling source code from
 * the example code given in the videojs-record libary github
 * that is used to handle all video recording on our application.
 * 
 * Is responsible for handling the video recording
 * element on the upload pages.
 * 
 * @author Thijs Triemstra (https://github.com/thijstriemstra)
 * @see https://github.com/collab-project/videojs-record/blob/master/examples/audio-video.html
 */


//Video player options
var options = {
    controls: true,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
        record: {
            audio: true,
            video: true,
            maxLength: 20,
            debug: true
        }
    }
};

// apply some workarounds for opera browser
applyVideoWorkaround();

var player = videojs('myVideo', options, function () {
    // print version information at startup
    var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
    videojs.log(msg);
});

// error handling
player.on('deviceError', function () {
    console.log('device error:', player.deviceErrorCode);
});

player.on('error', function (element, error) {
    console.error(error);
});

// user clicked the record button and started recording
player.on('startRecord', function () {
    console.log('started recording!');
});

//Stores the recorded video blob.
let data;
// user completed recording and stream is available
player.on('finishRecord', function () {
    // the blob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.

    data = player.recordedData;
    let formData = new FormData();
    formData.append('file', data, data.name);

    console.log('finished recording: ', data);

});


/**
 * 
 * Creates the thumbnail image of the video. 
 * Currently just takes the image at 0s of the video.
 * Does so by creating a canvas element, drawing the 
 * video onto the canvas, and then saving the image 
 * as a URI file. Returns that URI file.
 * 
 * @return (URI) 
 *          the image of the video
 * 
 * Uses code provided in a stackoverflow thread:
 * @author brianchirls
 * @see https://stackoverflow.com/questions/13760805/how-to-take-a-snapshot-of-html5-javascript-based-video-player
 * 
 * 
 */
function createImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');
    const video = document.getElementById("myVideo_html5_api");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let dataURI = canvas.toDataURL('image/jpeg');

    return dataURI;
}