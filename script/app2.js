function onDetectionDataChanged(json) {
    var a = 1
}

function onDetectionStateChanged(json) {
    var a = 1
}

// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 400; // We will scale the photo width to this
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
        //     "exact": "6f20cb85aee4e0e5bc0434c16156cbd025b04fb6a58229089095e0eea9d84443"
        // }
    };

    navigator.mediaDevices.getUserMedia({
            video: constraints,
            audio: true
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

            video.setAttribute('width', 400);
            video.setAttribute('height', 400);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
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
    console.log("ON FACE DETECTION")

    console.log(json)


    //json = JSON.parse(json)


    var cont = document.querySelector(".c-face-container");

    cont.innerHTML = '';

    if (json.length >= 1) {
        for (var i = 0; i < json.length; i++) {
            console.log(json[i])
            cont.innerHTML += `<p class="faces">Face ${i}, Age: ${json[i]}</p>`;
        }
    } else {
        cont.innerHTML += `<p class="faces">Face ${1}, Age: ${json[0]}</p>`;
    }



}

var result;

async function uploadFile(data) {

    // var API_URL = "http://49.12.227.132:5101";
    var API_URL = "http://0.0.0.0:8000/temi/api";
    // var API_URL = "http://192.168.2.160:8000/temi/api";

    try {
        //console.log(blob)

        // const land = await fetch(API_URL + '/api/v1/detect-gender-and-age', {

        payload = {img: data}

        console.log(payload)

        const land = await fetch(API_URL + '/analyse', {
            method: 'POST',
            body: JSON.stringify(payload)

        }).then(r => r.json())

        console.log(land)

        document.querySelector(".c-result-container").innerHTML = "";

        if (!land.length == 0) {
            for (var i =0; i < land.length; i++) {
                console.log(`Face: ${i}: Age: ${face[i].age}, Gender: ${face[i].gender},  Emotion: ${face[i].dominant_emotion}`)
                document.querySelector(".c-result-container").innerHTML += `<p>Face: ${i}: Age: ${face[i].age}, Gender: ${face[i].gender},  Emotion: ${face[i].dominant_emotion}</p>`;
            }
        } else {
            document.querySelector(".c-result-container").innerHTML = "No faces detected"
        }

        var ctx = canvas.getContext('2d');

        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, width, height);
        };

        image.src = land.image;



    } catch (e) {
        console.error(e)
    }
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        //const ctx = canvas.getContext('2d')
        //canvas.toBlob(uploadFile)


        var data = canvas.toDataURL('image/jpeg');

        uploadFile(data)


        // const fd = new FormData()
        // fd.append('image', blob)

        // const land = await fetch(API_URL + '/api/v1/detect-gender-and-age', {
        //     method: 'POST',
        //     body: fd
        // }).then(r => r.json())

        // console.log(data);
        //var data = ctx.getImageData(0, 0, width, height).data;
        // var request = new XMLHttpRequest();
        // console.log(data)
        // request.open("GET", '127.0.0.1/temi/api/analyze');
        // request.send(data);

        //console.log(data)

        //Android.detectFaces(data);

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
    console.log("DOM CONTENT LOEBERDIEDOE")
    startup();

    document.querySelector(".btn").addEventListener("click", function () {
        takepicture();
    });
})