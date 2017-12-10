import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'
import Door from '../sprites/Door'
import Key from '../sprites/Key'
import Ladder from '../sprites/Ladder'

export default class extends Phaser.State {

  constructor() {
    super()
    this.key_counter = 0;
    this.CHASING_TIME = 4000;
    this.GAME_OVER_TIME = 2000;
    window.playerDetected = false;
  }

  init() { }
  preload() { }

  create() {
    this
      .game
      .physics
      .startSystem(Phaser.Physics.ARCADE);

    //LOADING BACKGROUND
    this.bg = this
      .game
      .add
      .tileSprite(0, 0, 900, 600, 'background');
    this.bg.fixedToCamera = true;

    this.map = this.game.add.tilemap('level', 16, 16);
    this.map.addTilesetImage('tiles');
    this.game.physics.arcade.gravity.y = 800;
    this.layer = this.map.createLayer(0);
    this.add_collisions();
    this.layer.resizeWorld();

    //PLAYER
    this.player = new Player({ game: this.game, x: 50, y: 50, asset: 'dude', layer: this.layer })
    this.game.add.existing(this.player);

    //LADDER
    this.ladder = new Ladder({ game: this.game, x: 1230, y: 300, asset: '', height: 800, layer: this.layer })
    this.game.add.existing(this.ladder);

    //ENEMIES
    this.enemies = this.game.add.group();
    this.addNewEnemy(500, 100);
    this.addNewEnemy(800, 300);
    this.addNewEnemy(600, 300);

    //DOORS AND KEYS
    this.doors = this.game.add.group();
    this.keys = this.game.add.group();
    this.keyIdCounter = 0;

    this.addKeyDoorPair(630, 300, this.genNewKey(850, 100));
    this.addKeyDoorPair(825, 550, this.genNewKey(25, 300));

    //GAME CAMERA, CURSORS
    this.game.camera.follow(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.killButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.sneakyButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.killButtonFlag = true;

    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    //TIME
    this.game.time.events.add(Phaser.Timer.SECOND * 50, this.game_over, this);
  }

  addNewEnemy(posX, posY) {

    this.enemies.add(new Enemy({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'enemy',
      layer: this.layer,
      player: this.player
    }));

  }

  update() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.enemies, this.layer);
    this.game.physics.arcade.collide(this.player, this.enemies, this.simpleCollision);
    this.game.physics.arcade.collide(this.doors, this.layer);
    this.game.physics.arcade.collide(this.keys, this.layer);
    this.game.physics.arcade.collide(this.enemies, this.doors, this.switchDirection);
    this.game.physics.arcade.collide(this.ladder, this.layer);
    this.game.physics.arcade.collide(this.player, this.doors, Door.unlockDoor);
    this.game.physics.arcade.overlap(this.player, this.keys, this.key_collector, null, this);

    this.enemies.setAll('body.immovable', true);
    this.player.body.velocity.x = 0;
    this.movementPlayer();
    this.lightSprite.reset(this.game.camera.x, this.game.camera.y);
    this.updateShadowTexture();



    this.enemies.forEach(enemy => {
      if (enemy.detectPlayer()) {

        window.playerDetected = true;
        this.seen = true;
        this.timeUnseen = Date.now();
      }
    });


    if (!this.seen) {
      this.timeSeen = Date.now();
    }

    if (this.checkTimeUndetected()) {
      window.playerDetected = false;
    }

    if (this.checkTimeDetected()) {
      this.game.state.start('GameOver');
    }
    this.seen = false;
  }

  switchDirection(enemy, door){
    console.log('collide');
    if(enemy.facing == 'left')
      enemy.body.x += 2;
    else
      enemy.body.y -= 2;
    enemy.switchDirection();
  }

  checkTimeUndetected() {
    console.log(Date.now() - this.timeUnseen)
    return (Date.now() - this.timeUnseen) > this.CHASING_TIME;
  }

  checkTimeDetected() {
    
    return (Date.now() - this.timeSeen) > this.GAME_OVER_TIME;
  }

  updateShadowTexture() {

    this.shadowTexture.context.fillStyle = 'rgb(2, 2, 2)';
    //this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    var radius = 100 + this.game.rnd.integerInRange(1, 5),
      heroX = this.player.x - this.game.camera.x,
      heroY = this.player.y - this.game.camera.y;

    var gradient = this.shadowTexture.context.createRadialGradient(
      heroX, heroY, 100 * 0.3,
      heroX, heroY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = gradient;
    this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI * 2, false);
    this.shadowTexture.context.fill();

    this.shadowTexture.dirty = true;
    this.player.updateXCoordinate();
    this.player.updateYCoordinate();

  }

  key_collector(player, key) {
    key.kill();
    player.inventory.push(key);
  }

  addKeyDoorPair(doorPosX, doorPosY, corrKey) {

    this.doors.add(new Door({ game: this.game, x: doorPosX, y: doorPosY, asset: 'door', key: corrKey }));
    this.keys.add(corrKey);
  }

  genNewKey(posX, posY) {
    return new Key({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'key'
    }, this.keyIdCounter++);
  }

  movementPlayer() {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.stop();
    }
    if (this.game.physics.arcade.overlap(this.ladder, this.player)) {
      this.player.body.velocity.y = -13.5;

      if (this.cursors.up.isDown) {
        this.player.moveUp();
      }
      if (this.cursors.down.isDown) {
        this.player.moveDown();
      }
    }

    if (this.sneakyButton.isDown) {
      this.player.sneking = 1;
    } else if (this.sneakyButton.isUp) {
      this.player.sneking = 0;
    }
    if (this.jumpButton.isDown) {
      this.player.jump();
    }

    if (this.killButton.isDown) {

      if (this.killButtonFlag) {

        this.enemies.forEach(enemy => {
          if (Math.abs(this.player.x - enemy.x) < 50) {
            if (this.lookingAtEnemyFromBehind(this.player, enemy)) {
              enemy.killEnemy();
              this.enemies.remove(enemy);
            }
          }
        })
        this.killButtonFlag = false;
      }
    }

    if (this.killButton.isUp) {
      this.killButtonFlag = true;
    }
  }

  lookingAtEnemyFromBehind(player, enemy) {

    if (player.facing == 'left' && enemy.facing == 'left') {
      return (player.body.x > enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    } else if (player.facing == 'right' && enemy.facing == 'right') {
      return (player.body.x < enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    } 
    else if(player.facing == 'idle'){
      if(enemy.facing == 'left'){
        return (player.body.x > enemy.body.x) && this.areOnTheSameLevel(player, enemy);
      }
      else{
        return (player.body.x < enemy.body.x) && this.areOnTheSameLevel(player, enemy);
      }
    }
    // else {
    //   return this.areOnTheSameLevel(player, enemy);
    // }
  }

  areOnTheSameLevel(player, enemy) {
    return (player.body.y == enemy.body.y)
  }

  simpleCollision(player, enemy) {
    enemy.body.velocity.x = 0;
  }

  add_collisions() {
    this.map.setCollisionBetween(30, 279);
    this.map.setCollisionBetween(310, 349);
    this.map.setCollisionBetween(380, 419);
    this.map.setCollisionBetween(450, 484);
    this.map.setCollisionBetween(520, 559);
    this.map.setCollisionBetween(606, 629);
    this.map.setCollisionBetween(676, 699);
    this.map.setCollisionBetween(736, 769);
    this.map.setCollisionBetween(806, 839);
    this.map.setCollisionBetween(876, 909);
    this.map.setCollisionBetween(946, 974);
    this.map.setCollisionBetween(1016, 1049);
    this.map.setCollisionBetween(1086, 1119);
    this.map.setCollisionBetween(1750, 1767);
    this.map.setCollisionBetween(1734, 1749);
    this.map.setCollisionBetween(1804, 1819);
    this.map.setCollisionBetween(1874, 1889);
    this.map.setCollisionBetween(1944, 1951);
    this.map.setCollisionBetween(2018, 2029);
    this.map.setCollisionBetween(1166, 1189);
    this.map.setCollisionBetween(1236, 1259);
    this.map.setCollisionBetween(1306, 1329);
    this.map.setCollisionBetween(1376, 1399);
    this.map.setCollisionBetween(1446, 1469);
    this.map.setCollisionBetween(1516, 1539);
  }

  game_over() {
    this.game.state.start('GameOver');
  }

  render() {
    this.game.debug.text("Time left: " + game.time.events.duration, 32, 32);
  }
}
