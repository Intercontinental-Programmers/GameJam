import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, key }) {
        super(game, x, y, asset);
        this.locked = true;
        this.key = key;
        this
            .anchor
            .setTo(0.5);
        this
            .game
            .physics
            .enable(this, Phaser.Physics.ARCADE);

        this.enableBody = true;
        this.body.immovable = true;
        this.body.collideWorldBounds = true;
    }

    static unlockDoor(player, door) {
        for (var counter in player.inventory) {
            if (player.inventory[counter] == door.key)
                door.kill();
        }
    }


}