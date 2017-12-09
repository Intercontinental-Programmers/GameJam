import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset),
      this.anchor.setTo(0.5),
      this.game.physics.arcade.enable(this),
      //this.enableBody = true,
      this.timeToStep = this.game.time.now;

    //this init graphic for polygon
    this.graphics = this.game.add.graphics(0, 0);

    //speed of movement
    this.speed = 70;
    //modes
    this.attackMode = 0;
    this.wanderMode = 1;
    this.watchMode = 0; // staying in one place

    // direction to move
    this.moveLeft = 1;
    this.moveRight = 0;

    this.timeToStep = this.game.time.now;
    this
      .animations
      .add('left', [
        0, 1, 2, 3
      ], 10, true);
    this
      .animations
      .add('turn', [4], 20, true);
    this
      .animations
      .add('right', [
        5, 6, 7, 8
      ], 10, true);
    this.body.velocity.x = 0;
    this.facing = 'idle';
    this.jumpTimer = this.game.time.now;
  }

  wander() {
    if (this.moveLeft === 1) {
      console.log("Ruszam sie w lewo");
      this.body.velocity.x = -this.speed;
      this.moveLeft = 0;
      this.moveRight = 1;
      this
        .animations
        .play('left');
    }
    else if (this.moveRight === 1) {
      console.log("Ruszam sie w prawo");
      this.body.velocity.x = this.speed;
      this.moveRight = 0;
      this.moveLeft = 1;
      this
        .animations
        .play('right');
    }
  }

  update() {
    //delta of time
    this.diff_time = this.game.time.now - this.timeToStep;
    //console.log(this.diff_time);
    if (this.wanderMode === 1 && this.diff_time > 2000) {
      //this.body.velocity.setTo(0, 0);
      this.timeToStep = this.game.time.now;
      this.wander();
    }

  }
}
