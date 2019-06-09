p5.disableFriendlyErrors = true;

// Webcam feed
let capture;

// Face tracking
let tracker;
let results;

// Object classification
let classifier;

// Width and height
let w = 750;
let h = 550;

// Framerate
let fr = 10;

function preload() {
  const classifier = ml5.imageClassifier('MobileNet', capture);
}

function setup() {
  capture = createCapture({
      audio: false,
      video: {
        width: w,
        height: h
      }
  });
  capture.elt.setAttribute('playsinline', '');
  capture.hide();
  capture.size(w, h);
  canvas = createCanvas(w, h);
  
  frameRate(fr);
    
  
  // Initialize the face tracking model
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
  
   // Initialize the image classification model
  classifier = ml5.imageClassifier('MobileNet', capture, modelReady);

}

function draw() {
  blendMode(DIFFERENCE);
  tint(255, 150);
  image(capture, 0, 0);
  filter(GRAY);  
  fill(0, 255, 0, 50);
  rect(0, 0, w, h);
  
  let positions = tracker.getCurrentPosition();

  for (var i = 0; i < positions.length; i++) {
    noStroke();
    fill(0, 255, 0);
    ellipse(positions[i][0], positions[i][1], 4, 4);
  }
}

function modelReady() {
  console.log('Model Ready');
}

function classifyVideo() {
  classifier.predict(gotResult);
}

function gotResult(err, results) {
  select('#result').html(results[0].className);
  select('#result2').html(results[1].className);
  select('#probability').html(nf(results[0].probability * random(10, 100), 0, 2));
  document.getElementById('hidden').style.display = 'inline';
  document.getElementById('intro').style.display = 'none';
}


