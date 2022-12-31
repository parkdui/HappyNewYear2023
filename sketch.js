let bgm1;
// let step1, step2, step3, step4, step5;
// let step = [ step1, step2, step3, step4, step5 ];
let step = [];

let cnv1;
let saveBtn;
  let saveNm = [ "Happy New Year", "Thank You", "My Pleasure" ];
let eraseBtn;
let slider;

var drawing = [];
var currentPath = [];
var isDrawing = false;

let letters = [ 2, 0, 3 ];
let snowflakes = [];

function preload(){
  soundFormats('mp3');
  bgm1 = loadSound('assets/blackRabbit.mp3');
  step.push(loadSound('assets/step1.mp3'));
  step.push(loadSound('assets/step2.mp3'));
  step.push(loadSound('assets/step3.mp3'));
  step.push(loadSound('assets/step4.mp3'));
  step.push(loadSound('assets/step5.mp3'));
}

function setup() {
  cnv1 = createCanvas( windowWidth, windowHeight );
  cnv1.style( 'z-index', -10 );
  cnv1.position(0,0);
  cnv1.mousePressed(startPath);
  // var saveButton = select('#saveButton');
  cnv1.mouseReleased(endPath);
  
  bgm1.loop();
  
  let p = createP('BGM Volume');
  p.style('font-size', '16px');
  p.style( 'color', '#ffffff');
  p.parent('btnContainer');
  // p.position( 'relative' );

  slider = createSlider(0, 1, 0.5, 0);
  // slider.position( width*0.03, height*0.92);
  slider.style('width', '100px');
  slider.addClass("bgmVol");
  slider.parent('btnContainer');
  
  saveBtn = createButton( 'Save' );
  // saveBtn.position( width*0.2, height*0.92 );
  // saveBtn.style('color', "blue");
  saveBtn.addClass("saveBtn");
  saveBtn.mousePressed(saveDrawing);
  saveBtn.parent('btnContainer');
  
  eraseBtn = createButton( 'Erase' );
  // eraseBtn.position( width*0.2, height*0.92 );
  // eraseBtn.style('color', "blue");
  eraseBtn.addClass("eraseBtn");
  eraseBtn.mousePressed(eraseDrawing);
  eraseBtn.parent('btnContainer');
}

function startPath() {
  isDrawing = true;
  currentPath =[];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function saveDrawing() {
  saveCanvas( saveNm[int(random(saveNm.length))], 'png');
}

function eraseDrawing() {
  drawing.length =0;
}

function draw() {
  let bgx = map( mouseX, 0, width, 0, 50);
  let bgy = map( mouseY, 0, height, 150, 200);
    background( bgx, bgy );
  
  if( isDrawing ){
    var point = {
      x: mouseX,
      y: mouseY
    }
    currentPath.push(point);
  }
  stroke(255);
  strokeWeight(20);
  noFill();
  for( var i=0; i<drawing.length; i++){
    var path = drawing[i];
    beginShape();
    for( var j=0; j<path.length; j++){
      vertex(path[j].x, path[j].y)
    }
    endShape();
  }
  
  let vol = slider.value();
  bgm1.setVolume(vol);
    
   let t = frameCount / 60; // 시간 업데이트

  // 매 프라임마다 무작위 개수의 눈송이 생성
  for (let i = 0; i < random(2); i++) {
    snowflakes.push(new snowflake()); // 눈송이 객체 추가
  }
  // for 반복문을 사용하여 눈송이 반복
  for (let flake of snowflakes) {
    flake.update(t); // 눈송이 위치 업데이트
    flake.display(); // 눈송이 그리기
  }
  push();
    translate( mouseX, mouseY );
    noStroke();
    fill( 255, 100 );
    beginShape();
    ellipse(0,0, 40, 40);
    rotate( radians(170) );
    rect( -10, 26, 16, 40, 10 );
    rotate( radians(50) );
    rect( -10, 26, 16, 40, 10 );
    endShape();
  pop();
  
}

//step sound
function mousePressed() {
  let stepSound = random(step);
  stepSound.play();
}

function snowflake() {
  // 좌표값 초기화
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, 10);

  // 방사형 눈송이의 반지름
  // 눈송이를 화면에 고루 퍼뜨리기 위해 선택
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // 원형을 따라다니는 x 위치
    let w = 0.1; // 각속도
    let accX = map( mouseX, 0, width, -3, 3 );
    
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle) +accX;

    // 크기가 다른 눈송이가 미묘하게 다른 y 속도로 떨어집니다.
    let accY = map( mouseY, 0, height, 0.5, 0.1);
    // this.posY += pow(this.size, 0.5);
    this.posY += pow(this.size, accY);

    // 화면 하단을 지나친 눈송이는 삭제
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };
  this.display = function() {
    noStroke();
    fill(255);
    textSize( this.size );
    text( letters[int(random(0,2))], this.posX, this.posY );
  };
}

function windowResized(){
  resizeCanvas( windowWidth, windowHeight );
}