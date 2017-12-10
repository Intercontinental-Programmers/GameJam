import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
// import enemy from '../../assets/images/EnemyStick.jpg'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png'),
      this.load.image('tiles', 'assets/tiles.png'),
      this.load.tilemap('level', 'assets/level.csv', null, Phaser.Tilemap.CSV),
      this.load.spritesheet('dude', 'assets/dude.png', 37, 50),
      this.load.spritesheet('enemy', 'assets/enemy.png', 37, 50),
      this.load.spritesheet('droid', 'assets/droid.png', 32, 32),
      this.load.image('key', 'assets/star.png'),
      this.load.image('starBig', 'assets/star2.png'),
      this.load.image('door', 'assets/door.png'),
      this.load.image('background', 'assets/background2.png'),
      this.load.image('mushroom', 'assets/images/mushroom2.png'),
      this.load.image('btnPlay', 'assets/images/btn-play.png'),
      this.load.image('logo', 'assets/images/mushroom2.png'),
      this.load.image('button', './assets/images/blue_button.png'),
      this.load.image('logo', './asstes/images/logo.png'),
      this.load.image('gameOver', './assets/images/game_over.png')
      this.load.image('rock', './assets/images/rock2.png');
  }

  create() {
    this.state.start('Menu')
  }
}
