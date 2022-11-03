var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Sharpeiplayer1, Sharpei_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  console.log("jump");
  jumpSound = loadSound("jump.wav");
  console.log("collided");
  collidedSound = loadSound("collided.wav");
  console.log("fondo")
  backgroundImg = loadImage("backgroundImg.png");
  console.log("sol");
  sunAnimation = loadImage("sun.png");;
  console.log("Sharpeiplayer1");
  Sharpeiplayer1 = loadAnimation("Sharpeiplayer1.png");
  console.log("Sharpeicollided");
  Sharpei_collided = loadAnimation("Sharpeicollided.png");
  console.log("ground");
  groundImage = loadImage("ground.png");
  console.log("nube");
  cloudImage = loadImage("cloud.png");
  console.log("obs1");
  obstacle1 = loadImage("obstacle1.png");
  console.log("obs2");
  obstacle2 = loadImage("obstacle2.png");
  console.log("obs3")
  obstacle3 = loadImage("obstacle3.png");
  console.log("obs4")
  obstacle4 = loadImage("obstacle4.png");
  console.log("gameOver");
  gameOverImg = loadImage("gameOver.png");
  //console.log("restart")
  //restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1;
  
  Sharpeiplayer1 = createSprite(50,height-70,20,50);
  
  
  Sharpeiplayer1.addAnimation("Sharpeiplayer1", Sharpeiplayer1);
  Sharpei_collided.addAnimation("Sharpei_collided", trex_collided);
  Sharpeiplayer1.setCollider('circle',0,0,350);
  Sharpeiplayer1.scale = 0.08;
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Puntuación: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      Sharpeiplayer1.velocityY = -10;
       touches = [];
    }
    
    Sharpeiplayer1.velocityY = Sharpeiplayer1.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(Sharpei_collided)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establecer la velocidad de cada objeto del juego como 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambiar la animación del trexn
    trex.changeAnimation("collided",Sharpei_collided);
    
    //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 300;
    
    //ajustar la profundidad
    cloud.depth = Sharpeiplayer1.depth;
    Sharpeiplayer1.depth = Sharpeiplayer1.depth+1;
    
    //agregar cada nube al grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generar obstáculos al azar
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = Sharpeiplayer1.depth;
    Sharpeiplayer1.depth +=1;
    //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  Sharpeiplayer1.changeAnimation("running",Sharpeiplayer1);
  
  score = 0;
  
}
