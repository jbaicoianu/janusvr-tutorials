// Initialize defaults
var defaultGoombaSpeed = 2;
var defaultStartPosition = Vector(-14,0,10);
var defaultStartDir = Vector(1, 0, 0);
var defaultFlagpolePosition = Vector(95, 0, 10);
var goombas = [],
    coins = [];
var game = new MarioGame();


function MarioGame() {
  this.lives = 0;
  this.started = false;
  this.inittime = new Date().getTime();
}
MarioGame.prototype.create = function() {
  //this.playercollider = room.createObject('Object', { id: 'sphere', collider_id: 'sphere', js_id: 'player_collider', visible: false, scale: V(.75, 2, .75), pos: V(0,-9999,0) });
  this.resetbutton = new ResetButton(V(-10,0.1,10), 'resetbutton');
  
  // Initialize our goomba list
  goombas = [
    new Goomba('goomba0', false, 'pipe1'),
    new Goomba('goomba1', 'pipe1', 'pipe2'),
    new Goomba('goomba2', 'pipe2', 'pipe3'),
    new Goomba('goomba3', 'pipe2', 'pipe3'),
    new Goomba('goomba4', 'pipe3', 'pipe4'),
    new Goomba('goomba5', 'pipe3', 'pipe4'),
    new Goomba('goomba6', 'pipe3', 'pipe4'),
    new Goomba('goomba7', 'pipe3', 'pipe4'),
    new Goomba('goomba8', 'pipe3', 'pipe4'),
    new Goomba('goomba9', 'pipe3', 'pipe4'),
    new Goomba('goomba10', 'pipe4', 'pipe5'),
    new Goomba('goomba11', 'pipe4', 'pipe5')
  ];
  coins = [
    new Coin('coin1'),
    new Coin('coin2'),
    new Coin('coin3'),
    new Coin('coin4'),
    new Coin('coin5'),
    new Coin('coin6'),
  ];

  this.flagpole = new Flagpole(defaultFlagpolePosition, 'flagpole');

  this.resetGame();
}
MarioGame.prototype.start = function() {
  this.started = true;
  this.resetLevel();
  room.seekSound('music', 0);
  room.playSound('music');
}
MarioGame.prototype.update = function(dt) {
  //this.playercollider.pos = player.pos
  if (!this.started) {
    var now = new Date().getTime();
    var elapsed = now - this.inittime;

    if (elapsed > 5) {
      this.start();
    }

    return;
  }
  var seconds = dt / 1000;
  for (var i = 0; i < goombas.length; i++) {
    goombas[i].update(seconds);
  }
  for (var i = 0; i < coins.length; i++) {
    coins[i].update(seconds);
  }
}
MarioGame.prototype.win = function() {
  this.alive = false;
  room.stopSound('music');
  room.playSound('win');
  //this.resetLevel() // FIXME - should be on timer
}
MarioGame.prototype.die = function() {
  this.alive = false;
  this.lives--;
  room.stopSound('music');
  if (this.lives <= 0) {
    room.playSound('gameover');
    this.resetGame(); // FIXME - should be on timer
  } else {
    room.playSound('die');
    //this.resetLevel(); // FIXME - should be on timer
    this.resetPlayer(); // FIXME - should be on timer
  }
}
MarioGame.prototype.resetLevel = function() {
console.log('I died!');
  for (var i = 0; i < goombas.length; i++) {
    goombas[i].reset();
  }
  for (var i = 0; i < coins.length; i++) {
    coins[i].reset();
  }
}
MarioGame.prototype.resetPlayer = function() {
  this.alive = false;
  this.started = false;
  player.pos = defaultStartPosition;
  //player.dir = defaultStartDir;
}
MarioGame.prototype.resetGame = function() {
  this.lives = 3;
  this.resetPlayer();
  this.resetLevel();
}

// Define the Goomba class which holds all the information about each Goomba
function Goomba(js_id, start, end, speed) {
  this.js_id = js_id;
  this.object = room.objects[js_id];
  this.startpos = room.objects[js_id].pos;
  this.start = start;
  this.end = end;
  this.direction = 1;
  this.object.oncollision = function(ev) {
    player.pos.x = -5;
  }
  this.speed = speed || defaultGoombaSpeed;
  this.alive = true;
}

// Calling goomba.changeDirection() will flip the goomba to face the other way
Goomba.prototype.changeDirection = function(direction) {
  this.direction = (typeof direction == 'undefined' ? !this.direction : direction);
  if (this.direction == 0) {
    this.object.xdir = Vector(0,0,-1);
    this.object.ydir = Vector(0,1,0);
    this.object.zdir = Vector(1,0,0);
  } else if (this.direction == 1) {
    this.object.xdir = Vector(0,0,1);
    this.object.ydir = Vector(0,1,0);
    this.object.zdir = Vector(-1,0,0);
  }
}

// Calling goomba.move(dt) will move the goomba in his current direction, at whatever speed he is set to move
Goomba.prototype.update = function(dt) {
  if (this.alive) {
    if (this.direction == 0) {
      //this.object.pos.x += this.speed * dt
this.object.vel.x = this.speed;
    } else if (this.direction == 1) {
      //this.object.pos.x -= this.speed * dt
this.object.vel.x = -this.speed;
    }
  }
}
Goomba.prototype.reset = function() {
  this.object.pos = this.startpos;
  this.changeDirection(1);
  this.alive = true;
}
Goomba.prototype.die = function() {
  this.object.pos.y = -1000;
  this.alive = false;
  room.playSound('stomp');
}

function Coin(js_id) {
  this.js_id = js_id;
  this.object = room.objects[js_id];
  this.collected = false;
  var angle = 0;
}
Coin.prototype.collect = function() {
  room.playSound('coin');
  this.object.pos.y = -1000;
  this.collected = true;
}
Coin.prototype.update = function(dt) {
  if (!this.collected) {
    var a = this.angle += Math.PI/2 * (dt / 1000);
    
    //this.object.xdir = normalized(Vector(Math.cos(a), 0, -Math.sin(a)));
    //this.object.zdir = normalized(Vector(Math.sin(a), 0, Math.cos(a)));
    var now = new Date().getTime();
    this.object.pos.y = Math.cos(now / 250) / 4 + 1.5;
  }
}
Coin.prototype.reset = function() {
  this.collected = false;
}

function Flagpole(pos, js_id) {
  this.js_id = js_id;
  this.pole = room.createObject('Object', { id: 'cylinder', pos: pos, scale: V(.1, 6, .1), col: V(.7, .7, .7), collision_id: 'cylinder', collider_id: 'cylinder', js_id: js_id });
  this.flag = room.createObject('Object', { id: 'cone', pos: translate(pos, V(0,5.5,0)), scale: V(.75, 2, .1), col: V(0, 0, 1), js_id: 'flag', xdir: V(0, 1, 0), ydir: V(0, 0, 1), zdir: V(1, 0, 0)});
}
function ResetButton(pos, js_id) {
  this.js_id = js_id;

  this.pedestal = room.createObject('Object', { 
    id: 'cube', 
    pos: pos, 
    scale: V(1, 0.2, 1), 
    col: V(.7, .7, .7), 
    collision_id: 'cube', 
    collider_id: 'cube', 
    collider_static: true,
    js_id: js_id + '_pedestal' 
  });
  this.button = room.createObject('Object', {
    id: 'cube', 
    pos: translate(pos, V(0,0.1,0)),
    scale: V(1, .1, 4), 
    col: V(0, 1, 0), 
    collision_id: 'cube', 
    collider_id: 'cube', 
    js_id: js_id
  });
  //this.pedestal.appendChild(this.button);
}
ResetButton.prototype.activate = function() {
  game.start();
}

room.onLoad = function() {
  game.create();
}
room.onKeyDown = function(ev) {
  // FIXME - hacky and error prone.  Maybe player should expose an onJump callback?
  if (ev.keyCode == ' ' && Math.abs(player.vel.y) <= 0.1) {
    room.seekSound('jump', 0);
    room.playSound('jump');
  }
}

room.onColliderEnter = function(val1, val2) {
  if (!game.started) return;
  // FIXME - we should just add the colliders to a list, and each class should have its own handler

  if (val1.js_id == 'player_collider' && val2.js_id == game.resetbutton.js_id) {
    //game.resetbutton.activate();
    return;
  }
  if (val1.js_id == 'player_collider' && val2.js_id == game.flagpole.js_id) {
    game.win();
    return;
  }
  for (var i = 0; i < goombas.length; i++) {
    var goomba = goombas[i]; // Store a local reference for ease of use
    if (val1.js_id == goomba.js_id) {
/*
      if (val2.js_id == goomba.start || val2.js_id == goomba.end) {
        goomba.changeDirection();
      } else if (val2.js_id == 'player_collider') {
*/
      if (val2.js_id == 'player_collider') {
        if (player.vel.y < -0.1) {
          goomba.die();
          player.vel.y = 2;
        } else {
          game.die();
        }
      } else {
        goomba.changeDirection();
      }
    }
  }
  for (var i = 0; i < coins.length; i++) {
    var coin = coins[i];
    if (val1.js_id == coin.js_id && val2.js_id == 'player_collider') {
      coin.collect();
    }
  }
}
room.onColliderExit = function(val1, val2) {
  if (val1.js_id == 'player_collider' && val2.js_id == game.resetbutton.js_id) {
    game.resetbutton.activate();
    return;
  }
  if (!game.started) return;
}

room.update = function(dt) {
  game.update(dt);
}
