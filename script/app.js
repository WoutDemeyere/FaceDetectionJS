const video = document.querySelector('.video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models'),
  faceapi.nets.ageGenderNet.loadFromUri('models')
]).then(startVideo);

function startVideo() {

  var constraints = {

    "deviceId": {
      "exact": "6f20cb85aee4e0e5bc0434c16156cbd025b04fb6a58229089095e0eea9d84443"
    }
  };

  navigator.getUserMedia({
      video: {},
    },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {

  console.log("Video is ready")
  const canvas = faceapi.createCanvasFromMedia(video);

  document.body.append(canvas);

  const displaySize = {
    width: video.width,
    height: video.height
  };

  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    //console.log("Doing something")

    const predictions = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();


    const resizedDetections = faceapi.resizeResults(predictions, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


    resizedDetections.forEach(result => {
      const {
        age,
        gender,
        genderProbability
      } = result;
      new faceapi.draw.DrawTextField(
        [
          `${age.toFixed(2)} years`,
          `${gender} (${genderProbability.toFixed(2)})`
        ],
        result.detection.box.bottomRight
      ).draw(canvas);

      //console.log(result)
    });

    console.log(resizedDetections)

  }, 100);
});