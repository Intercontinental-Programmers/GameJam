/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Enemy from '../sprites/Enemy'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.enemy = new Enemy({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'enemy'
    })

    this.game.add.existing(this.enemy)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.enemy, 32, 32)
    }
  }
}
