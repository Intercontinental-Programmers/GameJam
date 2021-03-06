import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'
import Door from '../sprites/Door'
import Key from '../sprites/Key'

export default class extends Phaser.State {

  constructor() {
    super()
    this.key_counter = 0;
  }

  init() { }
  preload() { }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //LOADING BACKGROUND
    this.bg = this.game.add.tileSprite(0, 0, 900, 600, 'background');
    this.bg.fixedToCamera = true;

    //LOADING MAP
    this.game.physics.arcade.gravity.y = 800;
    this.tilemap = this.game.add.tilemap('level');
    this.tilemap.addTilesetImage('tiles-1');
    this.tilemap.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 51]);
    this.tilemap.myLayers = [];
    for (var i = 2; i > 0; i--) {
      this.layer = this.tilemap.createLayer('layer' + i);
      this.layer.resizeWorld();
      this.tilemap.myLayers[i - 1] = this.layer;
    }


    //PLAYER
    this.player = new Player({
      game: this.game,
      x: 50,
      y: 50,
      asset: 'dude',
      layer: this.layer
    })
    this.game.add.existing(this.player);

    //ENEMIES
    this.enemies = this.game.add.group();
    this.addNewEnemy(this.game.width * 0.1, 300);
    this.addNewEnemy(this.game.width * 0.3, 300);

    //DOORS AND KEYS
    this.doors = this.game.add.group();
    this.keys = this.game.add.group();
    this.keyIdCounter = 0;

    this.addKeyDoorPair(this.game.width * 0.4, 300, this.genNewKey(this.game.width * 0.2, 300));
    this.addKeyDoorPair(this.game.width * 0.62, 200, this.genNewKey(this.game.width * 0.55, 300));

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
  }

  addNewEnemy(posX, posY) {

    this.enemies.add(new Enemy({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'enemy',
      layer: this.layer
    }));
  }

  update() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.enemies, this.layer);
    this.game.physics.arcade.collide(this.player, this.enemies, this.simpleCollision);
    this.game.physics.arcade.collide(this.doors, this.layer);
    this.game.physics.arcade.collide(this.keys, this.layer);
    this.game.physics.arcade.collide(this.player, this.doors, Door.unlockDoor);
    this.game.physics.arcade.overlap(this.player, this.keys, this.key_collector, null, this);

    this.enemies.setAll('body.immovable', true);

    this.player.body.velocity.x = 0;
    this.movementPlayer();

    this.lightSprite.reset(this.game.camera.x, this.game.camera.y);
    this.updateShadowTexture();

  }

  updateShadowTexture() {

    this.shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    var radius = 100 + this.game.rnd.integerInRange(1, 5),
      heroX = this.player.x - this.game.camera.x,
      heroY = this.player.y - this.game.camera.y;

    var gradient = this.shadowTexture.context.createRadialGradient(
      heroX, heroY, 100 * 0.75,
      heroX, heroY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = gradient;
    this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI * 2, false);
    this.shadowTexture.context.fill();

    this.shadowTexture.dirty = true;
  }

  key_collector(player, key) {
    key.kill();
    player.inventory.push(key);
  }

  addKeyDoorPair(doorPosX, doorPosY, corrKey) {

    this.doors.add(new Door({
      game: this.game,
      x: doorPosX,
      y: doorPosY,
      asset: 'dude',
      key: corrKey
    }));

    this.keys.add(corrKey);

  }

  genNewKey(posX, posY) {
    return new Key({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'droid'
    }, this.keyIdCounter++);
  }

  genRandomSpawnPoint() {
    return this.game.rnd.integerInRange(16, this.game.width - 16);
  }

  movementPlayer() {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    }
    else if (this.cursors.right.isDown) {
      this.player.moveRight();
    }
    else {
      this.player.stop();
    }

    if (this.sneakyButton.isDown) {
      this.player.sneking = 1;
    }
    else if (this.sneakyButton.isUp) {
      this.player.sneking = 0;
    }
    if (this.jumpButton.isDown) {
      this.player.jump();
    }

    if (this.killButton.isDown) {

      if (this.killButtonFlag) {


        this.enemies.forEach(enemy => {
          //probably requires refactor
          if (Math.abs(this.player.x - enemy.x) < 50) {

            if (this.lookingAtEnemy(this.player, enemy)) {
              console.log('zabiles typa');
              enemy.killEnemy();
              this.enemies.remove(enemy);
            }
            else {
              console.log('nie zabiles typa');
            }
          }
          else {
            console.log('nie zabiles typa')
          }
        })

        this.killButtonFlag = false;
      }
    }

    if (this.killButton.isUp) {
      this.killButtonFlag = true;
    }
  }

  //probably requires refactor
  lookingAtEnemy(player, enemy) {

    if (player.facing == 'left') {
      return (player.body.x > enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    }
    else if (player.facing == 'right') {
      return (player.body.x < enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    }
    else {
      return this.areOnTheSameLevel(player, enemy);
    }
  }

  areOnTheSameLevel(player, enemy) {
    return (player.body.y == enemy.body.y)
  }

  simpleCollision(player, enemy) {
    enemy.body.velocity.x = 0;
  }

  render() {
  }
}
