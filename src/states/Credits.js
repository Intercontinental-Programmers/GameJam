import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init() {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.buttonCliked = false;
  }

  preload() {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  create() {
    var image = game.add.image(this.world.centerX, this.world.centerY - 100, 'logo')
    let text = this.add.text(this.world.centerX, this.world.centerY, 'Maciej Dziadyk\nJakubDudycz\nMaciej Hajduk\nJan Librowski\nMateusz Walczak', { font: '10px Arial', fill: '#000000', align: 'center' })
    text.anchor.setTo(0.5, 0.5)
    let button = game.add.button(game.world.centerX, this.world.centerY + 150, 'button', this.actionOnClick, this, 2, 1, 0);
    button.anchor.setTo(0.5)
  }

  render() {
    if (this.buttonCliked) {
      this.state.start('Splash')
    }
  }

  fontsLoaded() {
    this.fontsReady = true
  }


  actionOnClick() {
    this.buttonCliked = true;
  }
}