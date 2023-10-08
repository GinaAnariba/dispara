//Gina*****
var game = { //obejto:entidad con propiedades
    lives:5,
    score:0
  };
  var can = document.createElement("canvas");//lienzo "canvas" en el DOMxd
  var ctx = can.getContext('2d');
  var shoot_timer,game_loop;//estas variables para la mecanica del juego

  //propie de las balas
  var blet = {
    length:10, //largo de la bala
    //grueso de la bala
    thickness:5
  };
  //Aquí agrega el lienzo al cuerpo del documento HTML jajak
  document.body.appendChild(can);
  function resize(){
      can.width = window.innerWidth;
      can.height = window.innerHeight;
      clean();
  }
  // ajusta el tamaño del lienzo y lo limpia
  function clean(){
    ctx.fillStyle = "rgba(243, 240, 221)"; //color de fondo
    ctx.fillRect(0,0,can.width,can.height);
    ctx.fill();
  }
  //rastrea las teclas presionadas y se agregan controladores de eventos para arriba, abajo, sinpresionarelmouse, y presionado
  var key = {};
  window.onkeyup = function(e){
    key[e.keyCode] = false;
  };
  window.onkeydown = function(e){
    key[e.keyCode] = true;
  };
  window.onmousedown = function(){ //presionado
    shoot_timer = setInterval(function(){
        player.shoot();
    },50);
  };
  window.onmouseup = function(){ //sin presionar el mouse xd
    clearTimeout(shoot_timer);
  };
  //calcula la distancia entre dos puntos en el espacio.
  function distance(p1,p2){
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
    //practicamente d = √((x2 - x1)² + (y2 - y1)²)
  }
  //Marvin*****************

  //matriz para almacenar objetos bala.
  //Se definen tres clases qson Bullet, enemy, y player, que representan balas, enemigos y al jugador. Cada una tiene métodos para actualizar y dibujar.
  var bullets = [];
  class Bullet{
    //Bullet: Esta clase representa las balas que el jugador dispara. Tiene tres propiedades: position, velocity y direction (dirección de la bala, que por defecto es -1, indicando que la bala se mueve hacia arriba). La clase Bullet tiene dos métodos: update() para actualizar la posición de la bala y draw() para dibujar la bala en el lienzo.
    constructor(position,velocity,direction){
      this.position = position;
      this.velocity = velocity;
      this.direction = direction || -1;
    }
    update(){
      this.position.x += this.direction * this.velocity.x;
      this.position.y += this.direction * this.velocity.y;
    }
    draw(){
      //bala color
      ctx.beginPath();
      ctx.fillStyle = "#00010A";
      ctx.fillRect(this.position.x,this.position.y,blet.thickness,blet.length);
      ctx.fill();
    }
  }
  
  class Enemy{
    //Esta clase representa a los enemigos que aparecen en la pantalla y se mueven hacia abajo. Tiene dos propiedades: position y velocity del enemigo. La clase Enemy también tiene tres métodos: update para actualizar la posición del enemigo, check para verificar si una bala ha alcanzado al enemigo y draw para dibujar al enemigo en el lienzo.
    constructor(position,velocity){
      this.position = position;
      this.velocity = velocity;
    }
    update(){
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
    check(){
      for(var i in bullets){
        return distance(bullets[i].position,this.position) < 25;
      }
    }
    draw(){
      ctx.beginPath();
      //color de los enemigos
      ctx.fillStyle = "#2336F5";
      ctx.arc(this.position.x,this.position.y,10,0,Math.PI*2);
      ctx.fill();
    }
  }
  
  class Player{

    //Esta clase representa al personaje controlado por el jugador. Al igual que Enemy, tiene propiedades position y velocity para su posición y velocidad. 
    //Tiene dos métodos: update para actualizar la posición del jugador en función de las teclas presionadas por el y shoot para hacer que el jugador dispare una bala cuando el jugador hace clic en el lienzo.
    constructor(position,velocity){
      this.position = position;
      this.velocity = velocity;
    }
    update(){
      if(key[37] || key[65]) this.position.x -= this.velocity.x;
      if(key[38] || key[87]) this.position.y -= this.velocity.y;
      if(key[39] || key[68]) this.position.x += this.velocity.x;
      if(key[40] || key[83]) this.position.y += this.velocity.y;
    }
    shoot(){
      var b = new Bullet({
        x:this.position.x-blet.thickness/2,
        y:this.position.y-15
      },{
        x:0,
        y:3
      });
      b.update();
      bullets.push(b);
    }
    draw(){
      ctx.beginPath();
      //color del jugador
      ctx.fillStyle = "rgb(245, 45, 35)";
      ctx.arc(this.position.x,this.position.y,10,0,Math.PI*2);
      ctx.fill();
    }
  }

  //matriz para almacenar objetos enemigo. Este se utiliza para almacenar objetos de la clase Enemy que representan a los enemigos en el juego. Los objetos enemigos se generan y se agregan a este array a medida que aparecen en la pantalla.
  //Se define la función setup para configurar el juego, creando al jugador y haciendo que dispare inicialmente
  var enemies = [];
  var player;
  function setup(){
    //Se crea un objeto de la clase Player para representar al jugador y se le asigna una posición inicial y una velocidad.
    //Se utiliza un temporizador para que el jugador dispare automáticamente varias balas al comienzo del juego.
    player = new Player({x:can.width/2,y:can.height-50},{x:3,y:1});
    var count = 5;
    var t = setInterval(function(){
      if(count--)
        player.shoot();
      else clearInterval(t);
    },100);
  }
  //gina************
  // verifica si un objeto está fuera de los límites del lienzo.
  function overflow(position){
    return position.x > can.width || position.x < 0 || position.y > can.height || position.y < 0;
  }
  //mostrar la puntuación y las vidas en la parte superior derecha.
  function write_data(){
    ctx.fillStyle = "#F74ADA"; //color del cuadro
    ctx.fillRect(can.width-200,0,200,100);
    ctx.fillStyle = "#000"; //color letra
    ctx.font = "25px Times New Roman"; //fuente de la letra
    ctx.fillText("Puntaje : "+game.score,can.width-100-ctx.measureText("Puntaje : "+game.score).width/2,35);
    ctx.font = "25px Times New Roman";
    ctx.fillText("vidas : "+game.lives,can.width-100-ctx.measureText("vidas : "+game.lives).width/2,85);
    ctx.beginPath();
    ctx.moveTo(can.width-200,50);
    ctx.lineTo(can.width,50);
    ctx.stroke();
  }
  //cuantas pelotitas van a caer al igual que el mensaje al perder
  var difficulty = 10; //controlar la velocidad de los enemigos que aparecen
//Marvin*******
  //draw para actualizar y dibujar el juego en cada fotograma.
  function draw(){
    clean();
    if(game.lives < 0) {
      clearInterval(game_loop);
      ctx.fillStyle = "#000";
      ctx.font = "50px Times New Roman Bold";
        ctx.fillText("PERDISTE",can.width/2-ctx.measureText("PERDISTE").width/2,can.height/2);
      return;
    }
    var i;
    // La dificultad disminuye cuando el jugador pierde vidas. Esto significa que a medida que el jugador avanza en el juego, los enemigos aparecerán más rápido, lo que aumenta la dificultad del juego a medida que progresa.
    //Estos pasos son importantes para la configuración y la mecánica del juego, lo que permite que el jugador controle al personaje, dispare balas y enfrente enemigos con diferentes niveles de dificultad a medida que avanza en el juego.

    if(Math.floor(Math.random()*10) == 9 && enemies.length < difficulty){
      var e = new Enemy({
        x:20 + Math.random()*(can.width - 40),
        y:10
      },{
        x:0,
        y:0.1 + Math.random()*0.1*difficulty
      });
      enemies.push(e);
    }
    player.update();
    player.draw();
    if(player.position.x > can.width) player.position.x %= player.position.x;
    if(player.position.x < 0) player.position.x = can.width + player.position.x;
    for(i in bullets){
      bullets[i].update();
      bullets[i].draw();
      if(overflow(bullets[i].position)){
        bullets.splice(i,1);
      }else{
        for(var j in enemies){
          if(distance(enemies[j].position,bullets[i].position) <= 10){
            game.score += 1;
            enemies.splice(j,1);
          }
        }
      }
    }
    for(i in enemies){
      ctx.fillStyle = "#ff0";
      enemies[i].update();
      enemies[i].draw();
      if(overflow(enemies[i].position) || distance(enemies[i].position,player.position) <= 20){
        game.lives -= 1;
        if(~~(Math.random()*5) == 1) difficulty = Math.max(1,difficulty-1);
        enemies.splice(i,1);
      }
    }
    write_data();
  }
  //Gina**********
  //Se llama a la función resize para ajustar el tamaño del lienzo al cargar la página.
  resize();
  window.onresize = resize;//Se agrega un controlador de evento onresize para redimensionar el lienzo cuando cambia el tamaño de la ventana
  setup();// inicializa el juego.
  game_loop = setInterval(draw,10);//Se inicia el bucle principal del juego (game_loop) llamando a la función draw() cada 10 milisegundos.