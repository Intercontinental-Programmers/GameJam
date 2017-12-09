import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, height }) {
        super(game, x, y, asset);
        this
            .anchor
            .setTo(0.5);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);

        this.body.immovable = true;
        this.body.height = height;
        this.body.collideWorldBounds = true;
    }
}