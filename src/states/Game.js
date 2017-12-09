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
    this.bg = game.add.tileSprite(0, 0, 900, 600, 'background');
    this.bg.fixedToCamera = true;

    //LOADING MAP
    this.map = game.add.tilemap('level1');
    this.map.addTilesetImage('tiles-1');
    this.map.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 51]);
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.game.physics.arcade.gravity.y = 520;

    //PLAYER
    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'dude'
    })

    this.game.add.existing(this.player);

    //ENEMY
    this.enemy = new Enemy({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'dude'
    })
    this.game.add.existing(this.enemy);

    //KEY
    this.key = new Key({
      game: this.game,
      x: this.world.centerX - 200,
      y: this.world.centerY - 50,
      asset: 'droid'
    }, 1);
    this.game.add.existing(this.key);

    //DOOR
    this.door = new Door({
      game: this.game,
      x: this.world.centerX + -400,
      y: this.world.centerY,
      asset: 'dude',
      key: this.key
    })
    this.game.add.existing(this.door);

    //GAME CAMERA, CURSORS
    this.game.camera.follow(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  update() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.enemy, this.layer);
    this.game.physics.arcade.collide(this.door, this.layer);
    this.game.physics.arcade.collide(this.key, this.layer);
    this.game.physics.arcade.collide(this.player, this.door, this.door.unlockDoor);
    this.game.physics.arcade.overlap(this.player, this.key, this.key_collector, null, this);

    this.player.body.velocity.x = 0;
    this.movementPlayer();
  }

  key_collector(player, key) {
    key.kill();
    player.inventory.push(key);
  }

  render() {
  }

  movementPlayer() {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    }
    else if (this.cursors.right.isDown) {
      this.player.moveRight();
    }
    else if (this.facing != 'idle') {
      this.player.stop();
    }


    if (this.jumpButton.isDown) {
      this.player.jump();
    }
  }
}
