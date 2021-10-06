function startVideo() {

    var constraints = {

        // "deviceId": {
        //     "exact": "6f20cb85aee4e0e5bc0434c16156cbd025b04fb6a58229089095e0eea9d84443"
        // }
    };

    navigator.getUserMedia(
        //{
            //video: constraints,
        //}
        //,
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/jpeg');

        console.log(data)
        //var request = new XMLHttpRequest();
        //request.open("POST", 'SERVER_URL');
        //request.send(data);
    } else {
        clearphoto();
    }
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    var data = canvas.toDataURL('image/png');
  }

document.addEventListener("DOMContentLoaded", function () {
    startVideo();
})