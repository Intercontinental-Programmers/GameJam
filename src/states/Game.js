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
    this.game.physics.arcade.gravity.y = 800;

    //PLAYER
    this.player = new Player({
      game: this.game,
      x: this.world.centerX - 40,
      y: this.world.centerY,
      asset: 'dude'
    })

    
    
    this.game.add.existing(this.player);

    //ENEMIES
    this.enemies = this.game.add.group();
    this.addNewEnemy(this.game.width * 0.1, 300);
    this.addNewEnemy(this.game.width * 0.3, 300);
    this.addNewEnemy(this.game.width * 0.45, 300);
    this.addNewEnemy(this.game.width * 0.7, 300);
    this.addNewEnemy(this.game.width * 0.9, 300);

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
    this.killButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.sneakyButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.killButtonFlag = true;
  }

  addNewEnemy(posX, posY){

    this.enemies.add(new Enemy({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'enemy'
    }));

    console.log('enemy created');
  }

  genRandomSpawnPoint(){
      return this.game.rnd.integerInRange(16, this.game.width - 16);
  }

  update() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.enemies, this.layer);
    this.game.physics.arcade.collide(this.player, this.enemies, this.simpleCollision);
    //this.game.physics.arcade.collide(this.enemy, this.layer);
    this.game.physics.arcade.collide(this.door, this.layer);
    this.game.physics.arcade.collide(this.key, this.layer);
    this.game.physics.arcade.collide(this.player, this.door, this.door.unlockDoor);
    this.game.physics.arcade.overlap(this.player, this.key, this.key_collector, null, this);

    this.enemies.setAll('body.immovable', true);
    // this.enemy.body.immovable = true;
  
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

    if(this.killButton.isDown){
      
      if(this.killButtonFlag){
        

        this.enemies.forEach(enemy => {
          //probably requires refactor
          if(Math.abs(this.player.x - enemy.x) < 50){
            
            if(this.lookingAtEnemy(this.player, enemy)){
               console.log('zabiles typa');
               enemy.killEnemy();
               this.enemies.remove(enemy);
            }
            else{
               console.log('nie zabiles typa');
            }
          }
          else{
              console.log('nie zabiles typa')
          }
        })
       
        this.killButtonFlag = false;
      }
    }

    if(this.killButton.isUp){
      this.killButtonFlag = true;
    }
  }

  //probably requires refactor
  lookingAtEnemy(player, enemy){
  
    if(player.facing == 'left'){
      return (player.body.x > enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    }
    else if(player.facing == 'right'){
      return (player.body.x < enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    }
    else{
      return this.areOnTheSameLevel(player, enemy);
    }
  }

  areOnTheSameLevel(player, enemy){
    return (player.body.y == enemy.body.y)
  }

  simpleCollision(player, enemy) {
      enemy.body.velocity.x = 0;
  }
}
