import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({game, x, y, asset}, id) {
        super(game, x, y, asset);
        this.id = id;
        this.game.physics.arcade.enable(this);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);
          }
}