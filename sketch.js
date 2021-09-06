//Criar variáveis
var trex, trexCorrendo, trexColisao;
var solo, imagemSolo;
var soloInvisivel;
var imagemNuvem;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var grupoNuvens, grupoObstaculos;
var gameover,imagemOver;
var restart,imagemRestart;
var pulo, check, oversound;
var jogodotrex = "123"

var JOGAR = 1;
var ENCERRAR = 0;
var modoJogo = JOGAR;

//Placar Pontuacção
pontuacao = 0;

// Função para carregar as imagens
function preload(){
  trexCorrendo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexColisao = loadAnimation("trex_collided.png")
  
  imagemSolo = loadImage("ground2.png");
  imagemNuvem = loadImage("cloud2.png");
  
  imagemOver = loadImage("gameOver.png")
  imagemRestart = loadImage("restart.png")
  
  //Imagens dos obstáculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  pulo = loadSound("jump.mp3")
  check = loadSound("checkPoint.mp3")
  oversound = loadSound("die.mp3")
  
  
}

function setup(){
  
  var jogodotrex = "123"
  
  //Criar ambiente inicial de jogo
  createCanvas(600,200);
  
  //Criar sprite do T-Rex
  trex = createSprite(50,150,20,50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("trexColidiu", trexColisao)
  
  //Adicionar escala e posição ao Trex
  trex.scale = 0.5;
  trex.x = 50;
  trex.debug = false;
  trex.setCollider("circle",0,0,40);
  
  //Criar Sprite do Solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemSolo);
  solo.x = solo.width / 2;
  
  //Criar Sprite do Solo Invisível
  soloInvisivel = createSprite(200,195,400,20);
  soloInvisivel.visible = false;
  
  restart = createSprite(285,135,30,30)
  restart.addImage("reset",imagemRestart)
  restart.scale = 0.5
  
  gameover = createSprite(285, 90, 225,20)
  gameover.addImage("imgover",imagemOver)
  gameover.scale = 0.7
  
  grupoNuvens = new Group();
  grupoObstaculos = new Group();
  
}

function draw(){
  //Definir pano de fundo e limpar a tela
  background("white");
  
  if(modoJogo === JOGAR){
    // Atualizar pontução
    pontuacao = pontuacao + Math.round(frameRate()/60);
    //Gerar as nuvens
    gerarNuvens();
  
    //Gerar obstáculos do solo
    gerarObstaculos();
    
    // Atribuir velocidade x ao solo
    solo.velocityX =  -(5 + 3*pontuacao/1000);
    
    //Saltar quando tecla espaço é pressionada
    if(keyDown("space") && trex.y >160) {
      trex.velocityY = -10;
     }
    
    trex.velocityY = trex.velocityY + 0.5
    
    gameover.visible = false;
    restart.visible = false;
    
    //Saltar quando tecla espaço é pressionada
    if(keyDown("space") && trex.y >160) {
    trex.velocityY = -10;
    pulo.play();
  }
    if(pontuacao % 500 === 0 && pontuacao > 0){
       check.play();
    }
    
    if(grupoObstaculos.isTouching(trex)){
      
      modoJogo = ENCERRAR;
      oversound.play();
      
    }
      
    }
      
     
  else if(modoJogo === ENCERRAR){
        
    solo.velocityX =  0;
    
    trex.velocityX =  0;
    trex.velocityY =  0;
    
    grupoObstaculos.setVelocityXEach(0);
    grupoObstaculos.setLifetimeEach(-1);
    
    grupoNuvens.setVelocityXEach(0);
    grupoNuvens.setLifetimeEach(-1);
    
    
    
    trex.changeAnimation("trexColidiu");
    
    gameover.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
       reset();
       
       
       
    }
    
           
    }
  
  
  
  //Marcar pontuação do Jogo
  text("Pontuação: " + pontuacao, 400, 50);
  // Atualizar pontução
  
  
  //Redefinir posição do solo para o centro quando x<0
  if(solo.x < 0){
    solo.x = solo.width / 2;
  }
  
  
  
  
  
  // Dizer ao trex que ele deve colidir com o chão e ficar
  trex.collide(soloInvisivel);
  
  
  //Desenhar Sprites
  drawSprites();
  
  //Mostrar Posição X e Y do mouse
  text("("+mouseX+";"+mouseY+")",mouseX-10,mouseY-10);
}

function gerarNuvens(){
  //Escrever aqui o código para gerar as nuvens
  if(frameCount % 60 === 0){
    var nuvem = createSprite(600,100,40,10);
    nuvem.velocityX = -3;
    
    //Adicionar imagem da nuvem nos sprites
    nuvem.addImage(imagemNuvem);
    nuvem.scale = Math.round(random(3,6))/10;
    
    //Tornar posição Y da nuvem aleatória
    nuvem.y = Math.round(random(10,100));
    
    //Garantir que profundidade da nuvem seja maior que a do T-Rex
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    
    //Atrubuir tempo de duração da variável
    //Vida = Distância x velocidade
    nuvem.lifetime = 200;
    
    grupoNuvens.add(nuvem);
  
    
  } 
}

function gerarObstaculos(){
  if(frameCount % 60 === 0){
    var obstaculo = createSprite(600,165,10,40);
    obstaculo.velocityX = -(5 + 3*pontuacao/1000);
    
    //Criar Obstáculos aleatórios
    var rand = Math.round(random(1,6));
    
    switch(rand){
        case 1: obstaculo.addImage(obstaculo1);
                break;
        case 2: obstaculo.addImage(obstaculo2);
                break;
        case 3: obstaculo.addImage(obstaculo3);
                break;
        case 4: obstaculo.addImage(obstaculo4);
                break;
        case 5: obstaculo.addImage(obstaculo5);
                break;
        case 6: obstaculo.addImage(obstaculo6);
                break;
                default: break;
    }
    
    // Alterar escala e vida útil
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
  
    grupoObstaculos.add(obstaculo);
    
  }
  
}

function reset(){
  
  modoJogo = JOGAR;
  pontuacao = 0;
  
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  
  trex.x = 50;
  trex.y = 150;
  
  trex.changeAnimation("correndo");
  
}