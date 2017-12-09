import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({game, x, y, asset}) {
        super(game, x, y, asset);
        this
            .anchor
            .setTo(0.5);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);

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

        this.equipment = [];

    }

    moveLeft() {

        this.body.velocity.x = -150;

        if (this.facing != 'left') {
            this
                .animations
                .play('left');
            this.facing = 'left';
        }
    }
    moveRight() {

        this.body.velocity.x = 150;

        if (this.facing != 'right') {
            this
                .animations
                .play('right');
            this.facing = 'right';
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


    jump() {

        if(this.body.onFloor()){
            this.body.velocity.y = -250;
            this.jumpTimer = this.game.time.now;
        }

    }

    useObject() {
      usableObjects = this.game.actualMap.getUsableObjects();
      forEach(object in usableObjects)
      {
        if(checkOverlap(this, object))
          object.use();
      }
    }

    addToEquipment(object)
    {
      this.equipment.push(object);
    }

    update() {}
}
