function onDetectionDataChanged(json) {
    var a = 1
}

function onDetectionStateChanged(json) {
    var a = 1
}

// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 600; // We will scale the photo width to this
var height = 400; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');


    var constraints = {

        // "deviceId": {
        //   "exact": "6f20cb85aee4e0e5bc0434c16156cbd025b04fb6a58229089095e0eea9d84443"
        // }
    };

    navigator.mediaDevices.getUserMedia({
            video: constraints,
            audio: false
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', 340);
            video.setAttribute('height', 300);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    startbutton.addEventListener('click', function (ev) {
        takepicture();
        ev.preventDefault();
    }, false);

    clearphoto();
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function onFaceDetection(json) {
    json = JSON.parse(json)

    for (var i = 0; i < json.length; i++) {
        console.log(json[i])
        cont.innerHTML += `<p class="faces">Face ${i}, Age: ${json[i]}</p>`; 
    }

    console.log("Age " + json)

    var cont = document.querySelector(".c-face-container");

    cont.innerHTML = '';

    
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var ctx = canvas.getContext("2d")

        var data = canvas.toDataURL('image/jpeg');
        //var data = ctx.getImageData(0, 0, width, height).data;
        // var request = new XMLHttpRequest();
        // console.log(data)
        // request.open("GET", '127.0.0.1/temi/api/analyze');
        // request.send(data);

        console.log(data)

        Android.detectFaces(data);

        //var url = 'http://192.168.2.15:8080/temi/api/analyze';

        // fetch(url, {
        //   method: "POST",
        //   body: JSON.stringify({"img": data})
        // }).then(res => {
        //   console.log("Request complete! response:", res.json());
        // });
    } else {
        clearphoto();
    }
}



document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM CONTENT LOAdeooooood")
    startup();

    document.querySelector(".btn").addEventListener("click", function() {
        takepicture();
    });
})