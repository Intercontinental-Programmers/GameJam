import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({game, x, y, asset, layer}) {
        super(game, x, y, asset);
        this
            .anchor
            .setTo(0.5);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);

        this.timeToStep = this.game.time.now;
        this.layer = layer;
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
        this
            .animations
            .add('left_upper', [
                18, 19, 20, 21
            ], 10, true);
        this
            .animations
            .add('right_upper', [
                25, 24, 23, 22
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
        } else {
            this
                .animations
                .play('left_sneak');
            this.facing = 'left';
        }
    }

    moveRight() {

        this.body.velocity.x = this.speed;
        if (!this.sneking) {
            this
                .animations
                .play('right');

            this.facing = 'right';
        } else {
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
        
        this.checkEdge();
    
    }
    
    checkEdge() {

        // console.log("Layer: " + this.layer);

        if (this.layer.getTiles(this.x , this.y + 15, 20, 5, true).length > 0 && this.facing == "right") {
            this.body.velocity.y = -100;
            console.log("Right: " + this.layer.getTiles(this.x , this.y + 15, 10,5 , true) );
        } else if(this.layer.getTiles(this.x-20 , this.y + 15, 20, 5, true).length > 0 && this.facing == "left"){
            this.body.velocity.y = -100;
            console.log("Left: " + this.layer.getTiles(this.x , this.y + 15, (-20), 5, true) );
        }
    }
}
