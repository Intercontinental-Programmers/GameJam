import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset);
        this
            .anchor
            .setTo(0.5);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);

        this.timeToStep = this.game.time.now;
        //coordinates to check if polyView of Enemy contains Player
        //left-down, right - down, left - up, right - up
        //(x,y)
        this.coordinates = [[this.x - 18.5, this.y + 25], [this.x + 18.5, this.y + 25], [this.x - 18.5, this.y - 25], [this.x + 18.5 , this.y + 25]];
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
        this.body.velocity.x = 0;
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
        }
        else {
            this
                .animations
                .play('left_sneak');
            this.facing = 'left';
        }
    }

    moveRight() {

        this.body.velocity.x = this.speed;
        if (!this.sneking){
            this
                .animations
                .play('right');

            this.facing = 'right';
        }
        else {
            this
                .animations
                .play('right_sneak');

            this.facing = 'right';
        }
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
            this.body.velocity.y = -350;
            this.jumpTimer = this.game.time.now;
        }
    }

    update() {
        if (!this.sneking)
            this.speed = 150;
        else if (this.sneking)
            this.speed = 50;
    }

    updateXCoordinate(){
        this.coordinates[0][0] = this.x - 18.5;
        this.coordinates[1][0] = this.x + 18.5;
        this.coordinates[2][0] = this.x - 18.5;
        this.coordinates[3][0] = this.x + 18.5;
    }
    updateYCoordinate(){
        this.coordinates[0][1] = this.y + 25;
        this.coordinates[1][1] = this.y + 25;
        this.coordinates[2][1] = this.y - 25;
        this.coordinates[3][1] = this.y - 25;
    }
}
