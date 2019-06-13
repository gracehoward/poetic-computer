p5.disableFriendlyErrors = true;

// Webcam feed
let capture;

// Face tracking
let tracker;

// Object classification
let classifier;
let results;

// Grammar
let grammar;

// Width and height
let w = 750;
let h = 550;

// Framerate
let fr = 10;

function preload() {
  GlossyDisplay = loadFont("../assets/fonts/GlossyDisplay-Regular-Italic.otf");
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
  let canvas = createCanvas(w, h);
  canvas.parent('sketch');

  frameRate(fr);

  textFont(GlossyDisplay);

  // Initialize the face tracking model
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  // Initialize the image classification model
  classifier = ml5.imageClassifier('MobileNet', capture, modelReady);

  // Initialize Grammar Rules
  grammar = new RiGrammar;
}

function draw() {
  blendMode(DIFFERENCE);
  tint(255, 150);
  image(capture, 0, 0);
  filter(GRAY);  
  fill(0, 245, 0, 50);
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
  document.getElementById('hidden').style.display = 'inline';
  document.getElementById('intro').style.display = 'none';

  select('#probability').html(nf(results[0].probability * random(10, 100), 0, 2));

  // Classify object classNames as grammar nouns
  grammar.addRule("<N>", results[0].className);
  grammar.addRule("<N>", results[1].className);
  grammar.addRule("<N>", results[2].className);

  generateGrammar();

}

function generateGrammar() {
  grammar.addRule("<VBG>", RiTa.randomWord("vbg")); // Verb
  grammar.addRule("<VBD>", RiTa.randomWord("vbd")); // Verb, past tense
  grammar.addRule("<PRP>", RiTa.randomWord("prp")); // Personal Pronoun
  grammar.addRule("<PRP$>", RiTa.randomWord("prp$")); // Possessive Pronoun
  grammar.addRule("<JJ>", RiTa.randomWord("jj")); // Adjective
  grammar.addRule("<RB>", RiTa.randomWord("rb")); // Adverb
  grammar.addRule("<UH>", RiTa.randomWord("uh")); // Exclamation

  grammar.addRule("<start>", "you are the <N><br />to my <N>", 1);
  grammar.addRule("<start>", "<N><br />is to <N>", 1);
  grammar.addRule("<start>", "<N><br />as <JJ> as a <N>", 1);
  grammar.addRule("<start>", "<N><br /><VBG> <N>", 1);
  grammar.addRule("<start>", "<UH>! <PRP$> <JJ> <N>", 1);
  grammar.addRule("<start>", "<PRP> <VBD><br /><PRP$> <N>", 1);
  grammar.addRule("<start>", "I <VBD> <PRP$> <N>", 1);
  grammar.addRule("<start>", "<PRP> <VBD> <PRP$> <N>", 1);
  grammar.addRule("<start>", "<VBG>", 1);
  grammar.addRule("<start>", "<VBG> <RB>", 1);

  // let generatedText = rg.expand();
  select('#stanza1').html(grammar.expand());
  select('#stanza2').html(grammar.expand());
  select('#stanza3').html(grammar.expand());
  select('#stanza4').html(grammar.expand());
}

function saveFrame() {
  save('poetic-computer.png');
}
