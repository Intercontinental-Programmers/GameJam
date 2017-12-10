import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#000'
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
    let text = this.add.text(this.game.width * 0.5, this.game.height * 0.3, 'Organization', { font: '100px Sheriff', fill: '#fff', align: 'center' })
    text.anchor.setTo(0.5, 0.5)
    let text1 = this.add.text(this.game.width * 0.5, this.game.height * 0.5, 'Maciej Dziadyk\nJakubDudycz\nMaciej Hajduk\nJan Librowski\nMateusz Walczak', { font: '10px Arial', fill: '#fff', align: 'center' })
    text1.anchor.setTo(0.5, 0.5)
    let button = game.add.button(this.game.width * 0.5, this.game.height * 0.8, 'button', this.actionOnClick, this, 2, 1, 0);
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