import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset),
      this
        .anchor
        .setTo(0.5),
      this
        .game
        .physics
        .arcade
        .enable(this),
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
    
    this.polyOfViewRight = new Phaser.Polygon([
      new Phaser.Point(this.x, this.y - 23),
      new Phaser.Point(this.x + 100, this.y - 48),
      new Phaser.Point(this.x + 100, this.y + 25)
    ]);

    this.polyOfViewLeft = new Phaser.Polygon([
      new Phaser.Point(this.x, this.y - 25),
      new Phaser.Point(this.x - 100, this.y - 48),
      new Phaser.Point(this.x - 100, this.y + 25)
    ]);

    this.polyOfViewRight2 = new Phaser.Polygon([
      new Phaser.Point(this.x - 9, this.y - 10),
      new Phaser.Point(this.x + 66.7, this.y - 24.35),
      new Phaser.Point(this.x + 66.7, this.y + 24.35)
    ]);

    this.polyOfViewLeft2 = new Phaser.Polygon([
      new Phaser.Point(this.x - 9, this.y - 10),
      new Phaser.Point(this.x - 66.7, this.y - 24.35),
      new Phaser.Point(this.x - 66.7, this.y + 24.35)
    ]);

  }

  wander() {
    if (this.moveLeft === 1) {
      this.body.velocity.x = -this.speed;
      this.moveLeft = 0;
      this.moveRight = 1;
      this
        .animations
        .play('left');

    } else if (this.moveRight === 1) {
      this.body.velocity.x = this.speed;
      this.moveRight = 0;
      this.moveLeft = 1;
      this
        .animations
        .play('right');
    }
  }

  drawView() {



    this.graphics.beginFill(0xFF33ff);
    if (this.moveLeft === 0) {
      this.graphics.drawPolygon(this.polyOfViewLeft.points);
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewLeft2.points);
    }
    else {
      this.graphics.beginFill(0xFF33ff);
      this.graphics.drawPolygon(this.polyOfViewRight.points);
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewRight2.points);
    }
    this.graphics.alpha = 0.2;
    this.graphics.endFill();
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


    this.polyOfViewRight = new Phaser.Polygon([
      new Phaser.Point(this.x + 10, this.y - 20),
      new Phaser.Point(this.x + 120, this.y - 45.8),
      new Phaser.Point(this.x + 120, this.y + 25.8)
    ]);

    this.polyOfViewRight2 = new Phaser.Polygon([
      new Phaser.Point(this.x + 10, this.y - 20),
      new Phaser.Point(this.x + 80.7, this.y - 36.85),
      new Phaser.Point(this.x + 80.7, this.y + 8.85)
    ]);

    this.polyOfViewLeft2 = new Phaser.Polygon([
      new Phaser.Point(this.x - 9, this.y - 20),
      new Phaser.Point(this.x - 80.7, this.y - 36.35),
      new Phaser.Point(this.x - 80.7, this.y + 8.90)
    ]);

    this.polyOfViewLeft = new Phaser.Polygon([
      new Phaser.Point(this.x - 9, this.y - 20),
      new Phaser.Point(this.x - 120, this.y - 45),
      new Phaser.Point(this.x - 120, this.y + 25)
    ]);
    this.graphics.clear();
    this.drawView();



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
