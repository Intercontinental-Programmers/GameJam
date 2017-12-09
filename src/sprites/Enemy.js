import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset),
    this.anchor.setTo(0.5),
    this.game.physics.arcade.enable(this),
    //this.enableBody = true,
    this.timeToStep = this.game.time.now;

    //speed of movement 
    this.speed = 70;
    //modes
    this.attackMode = 0;
    this.wanderMode = 1;
    this.watchMode = 0; // staying in one place

    // direction to move
    this.moveLeft = 1;
    this.moveRight = 0;
  }

  wander () {
    if(this.moveLeft === 1){
      console.log("Ruszam sie w lewo");
      this.body.velocity.x = -this.speed;
      this.moveLeft = 0;
      this.moveRight = 1;
    }
    else if(this.moveRight === 1){
      console.log("Ruszam sie w prawo");
      this.body.velocity.x = this.speed;
      this.moveRight = 0;
      this.moveLeft = 1;
    }
  }

  update () {
    //delta of time
    this.diff_time = this.game.time.now - this.timeToStep;
    //console.log(this.diff_time);
    if(this.wanderMode === 1 && this.diff_time > 2000){
      //this.body.velocity.setTo(0, 0);
      this.timeToStep = this.game.time.now;
      console.log('poruszam sie w ' + this.moveLeft + "L" + "   " + this.moveRight + "R");
      this.wander();
    }
      
  }

  stop() {
    this
        .animations
        .stop();

    if (this.facing == 'left') {
        this.frame = 0;
    } else {
        this.frame = 5;
    }

    this.facing = 'idle';
  }

}
