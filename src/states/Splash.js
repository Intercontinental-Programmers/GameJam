import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png'),
    this.load.image('tiles-1', 'assets/tiles-1.png'),
    this.load.spritesheet('dude', 'assets/dude.png', 37, 50),
    this.load.spritesheet('droid', 'assets/droid.png', 32, 32),
    this.load.image('starSmall', 'assets/star.png'),
    this.load.image('starBig', 'assets/star2.png'),
    this.load.image('background', 'assets/background2.png')
    this.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
  }

  create () {
    this.state.start('Game')
  }
}
