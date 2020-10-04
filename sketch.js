/*
Flappy Bird
1. Bird -  done
2. Obstacles - Top & Bottom - done
3. Bird Mechanism - on press of space, bird move up - otherwise gravity applied - Done
4. If bird touches obstacle, then die - 
5. game restart when press restart icon
*/

var bird;
var obstacleGroup;
var gameState;
var restart;
var score;
// gap between box n pillar
var gap;

var bg, flap1, flap2;
var gameOverI, restartI;
var gameOver, restart;

function preload(){
  flap1 = loadImage("flap1.png");
  flap2 = loadImage("flap2.png");
  bg = loadImage("bg3.png");
  gameOverI = loadImage("gameOver.png");
  restartI = loadImage("restart.png");
}

function setup() {
  createCanvas(800,400);

  gameState = "start";
  score = 0;
  gap = 5;

  obstacleGroup = new Group();

  bird = createSprite(300, 200, 30, 30);
  bird.addImage("flap1", flap1);
  bird.addImage("flap2", flap2);
  bird.scale = 0.3;
  bird.visible = false;

  gameOver = createSprite(400,180);
  gameOver.addImage(gameOverI);
  gameOver.visible = false;
  
  restart = createSprite(400,260);
  restart.addImage(restartI);
  restart.scale = 0.2;
  restart.visible = false;
}

function draw() {           //recurring 
  background(bg);
  
  if (gameState == "start"){
    push();
    textSize(30);
    stroke("black");
    strokeWeight(10);
    fill("white");
    text("Press SPACE to start",250,200);
    pop();
    bird.visible = false;
    gameOver.visible = false;
    restart.visible = false;
  } 

  if (gameState == "start" && keyDown("space")){
    gameState = "play";  
    bird.visible = true;
  }
  
  if(gameState == "play"){
    score+= Math.round(getFrameRate()/60);
    
    if(keyWentDown("space")){
      bird.velocityY = -7;
      bird.changeImage("flap2", flap2);
    }
    
    if(keyWentUp("space")){
      bird.changeImage("flap1", flap1);
    }

    //gravity
    bird.velocityY += 0.5; 
    spawnObstacles();
    
    // bird touch the pillars - Game Over
    //bird dropped to ground - Game Over
    if(bird.isTouching(obstacleGroup) || bird.y>400){ 
      gameState = "end";
    }
  }
  else if(gameState == "end"){
    bird.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
  
    gameOver.visible = true;
    restart.visible = true;
    
    if( mousePressedOver(restart)){
      gameState = "start";
      obstacleGroup.destroyEach();
      bird.y = 200;
      score = 0;
    }

  }

  drawSprites();
  
  //score layout
  push();
  textSize(20);
  fill("white");  
  text("SCORE : " + score,600,50);
  pop();
  
}

function spawnObstacles(){
  if( frameCount%60 == 0 ){
    
    var ob_up = createSprite(width, 75, 50, random(50,150));
    var ob_down = createSprite(width, 325, 50, 150);
    
    var box_up = createSprite(width,0,70,30);
    var box_down = createSprite(width,0,70,30);

    var r = Math.round(random(1,4));
    switch(r){
      case 1: ob_up.shapeColor = rgb(95, 212, 6);
              ob_down.shapeColor = rgb(95, 212, 6);
              box_up.shapeColor = rgb(83, 156, 28);
              box_down.shapeColor = rgb(83, 156, 28);
              break;
      case 2: ob_up.shapeColor = rgb(66, 135, 245);
              ob_down.shapeColor = rgb(66, 135, 245);
              box_up.shapeColor = rgb(25, 51, 166);
              box_down.shapeColor = rgb(25, 51, 166);
              break;
      case 3: ob_up.shapeColor = rgb(227, 109, 205);
              ob_down.shapeColor = rgb(227, 109, 205);
              box_up.shapeColor = rgb(156, 17, 89);
              box_down.shapeColor = rgb(156, 17, 89);
              break;
      case 4: ob_up.shapeColor = rgb(227, 152, 54);
              ob_down.shapeColor = rgb(227, 152, 54);
              box_up.shapeColor = rgb(191, 31, 19);
              box_down.shapeColor = rgb(191, 31, 19);
              break;
    }
    
    
    ob_up.y = ob_up.height/2;
    box_up.y = ob_up.height + gap + box_up.height/2;

    ob_down.height = height - (ob_up.height + 150 + gap*2 + 1.5*box_up.height);
    ob_down.y = height - ob_down.height/2;
    
    box_down.y = height - (ob_down.height + gap + box_down.height/2);
    
    obstacleGroup.add(ob_down);
    obstacleGroup.add(ob_up);
    obstacleGroup.add(box_down);
    obstacleGroup.add(box_up);
    obstacleGroup.setVelocityXEach(-5);
    obstacleGroup.setLifetimeEach(800/3);
    obstacleGroup.setDepthEach(gameOver.depth);
    gameOver.depth += 1;
    restart.depth = gameOver.depth + 1;
  }
  
}
