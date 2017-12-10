import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, layer }) {
        super(game, x, y, asset);
        this
            .anchor
            .setTo(0.5);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);
        this.lastDirection = "right";

        this.timeToStep = this.game.time.now;
        this.lastNoises = [0];
        this.layer = layer;
        //coordinates to check if polyView of Enemy contains Player
        //(x,y)
        this.coordinates = [[this.x - 18.25, this.y], [this.x + 18.25, this.y], [this.x - 18.25, this.y + 22], [this.x + 18.25, this.y + 22], [this.x - 18.25, this.y - 22], [this.x + 18.25, this.y + 22]];
        this.animations
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
        this
            .animations
            .add('right_sneak', [
                14, 15, 16, 17
            ], 10, true);
        this
            .animations
            .add('left_sneak', [
                9, 10, 11, 12
            ], 10, true);
        this
            .animations
            .add('right_upper', [
                18, 19, 20, 21, 22, 23
            ], 10, true);
        this
            .animations
            .add('left_upper', [
                29, 28, 27, 26, 25, 24
            ], 10, true);
        this.body.velocity.x = 0;
        this.onLadder = 0;
        this.jumpTimer = this.game.time.now;
        this.sneking = 0;
        this.inventory = [];
    }

    moveLeft() {

        this.body.velocity.x = -this.speed;
        if (!this.sneking) {
            this
                .animations
                .play('left');
            this.facing = 'left';
            this.makeNoise(1.3);
        } else {
            this
                .animations
                .play('left_sneak');
            this.facing = 'left';
            this.makeNoise(0);
        }
    }

    moveRight() {

        this.body.velocity.x = this.speed;
        if (!this.sneking) {
            this
                .animations
                .play('right');

            this.facing = 'right';
            this.makeNoise(1.3);
        } else {
            this
                .animations
                .play('right_sneak');

            this.facing = 'right';
            this.makeNoise(0);
        }

    }

    moveUp() {
        this.body.velocity.y -= 55;
    }
    moveDown() {
        this.body.velocity.y += 105;
    }

    stop() {
        this
            .animations
            .stop();

        this.frame = 4;

        this.facing = 'idle';
    }

    jump() {

        if (this.body.onFloor()) {
            this.body.velocity.y = -250;
            this.makeNoise(2);
            this.jumpTimer = this.game.time.now;
        }
    }

    update() {
        if (!this.sneking)
            this.speed = 150;
        else if (this.sneking)
            this.speed = 50;
        if(this.facing != 'idle')
          this.lastDirection = this.facing;

        this.checkEdge();
        this.checkLadder();
    }

    checkLadder() {
        if (this.onLadder) {
            this.speed = 50;
        }
    }

    checkEdge() {

        // console.log("Layer: " + this.layer);

        if (this.layer.getTiles(this.x, this.y + 15, 20, 5, true).length > 0 && this.facing == "right") {
            if (this.layer.getTiles(this.x, this.y - 20, 20, 5, true).length == 0) {
                this.body.velocity.y = -100;
                // console.log("Right: " + this.layer.getTiles(this.x , this.y + 15, 10,5 , true) );
            }
        } else if (this.layer.getTiles(this.x - 20, this.y + 15, 20, 5, true).length > 0 && this.facing == "left") {
            if (this.layer.getTiles(this.x - 20, this.y - 20, 220, 5, true).length == 0) {
                this.body.velocity.y = -100;
                // console.log("Left: " + this.layer.getTiles(this.x , this.y + 15, (-20), 5, true) );
            }
        }
    }


    makeNoise(value){
        this.lastNoises.push(value);
        // console.log(this.lastNoises);
    }

    setOnLadder(status) {
        this.onLadder = status;
    }
    getOnLadder() {
        return this.onLadder;
    }

    updateXCoordinate() {
        this.coordinates[0][0] = this.x - 18.25;
        this.coordinates[1][0] = this.x + 18.25;
        this.coordinates[2][0] = this.x - 18.25;
        this.coordinates[3][0] = this.x + 18.25;
        this.coordinates[4][0] = this.x - 18.25;
        this.coordinates[5][0] = this.x + 18.25;
    }
    updateYCoordinate() {
        this.coordinates[0][1] = this.y;
        this.coordinates[1][1] = this.y;
        this.coordinates[2][1] = this.y + 22;
        this.coordinates[3][1] = this.y + 22;
        this.coordinates[4][1] = this.y - 22;
        this.coordinates[5][1] = this.y - 22;
    }
}
