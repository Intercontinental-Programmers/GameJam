import Phaser from 'phaser'
import OpenedDoor from './OpenedDoor'

export default class extends Phaser.Sprite {
    constructor({game, x, y, asset, key}) {
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
        this.body.collideWorldBounds = true; 
    }

    //kills particular door -> deletes collision
    //needed review from John
    unlockDoor(key, player){
        this.locked = flase;
    }


}