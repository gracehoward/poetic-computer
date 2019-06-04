p5.disableFriendlyErrors = true;

let text;

let capture;
let keywords = "";

let tracker;

let yolo;
let objects = [];

let w = 750;
let h = 550;

function setup() {
  createCanvas(w, h);
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
    
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
  
  yolo = ml5.YOLO(capture, detect);
}

function draw() {
  blendMode(DIFFERENCE);
  // background(0, 0, 255);
  tint(255, 150);
  image(capture, 0, 0, w, h);
  filter(GRAY);  
  fill(0, 255, 0, 50);
  rect(0, 0, w, h);
  
  let positions = tracker.getCurrentPosition();

  for (var i = 0; i < positions.length; i++) {
    noStroke();
    fill(0, 255, 0);
    ellipse(positions[i][0], positions[i][1], 4, 4);
  }

  for (let i = 0; i < objects.length; i++) {
    noFill();
    strokeWeight(3);
    stroke(0, 255, 0);
    rect(objects[i].x* 3/4 * w, objects[i].y* 3/4* h, objects[i].w*width, objects[i].h*height);
  }

}

function detect() {
  yolo.detect(function(err, results){
    objects = results;
    detect();
  });
}



