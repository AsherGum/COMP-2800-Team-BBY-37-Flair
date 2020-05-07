
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

//Stores the video blob. Probably not a  safe method, not sure how else to do this.
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
    

//Creates the thumbnail image for the video. 
//Currently just takes the image at 0s of the video
function createImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    const video = document.getElementById("myVideo_html5_api");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let dataURI = canvas.toDataURL('image/jpeg');

    return dataURI;
}




