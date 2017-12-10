import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
    //true if we clicked new game
    this.newGameClicked = false;
    //true if we clicked credits
    this.creditsClicked = false;
  }

  preload () {
  }

  create () {
    let text = this.add.text(this.world.centerX, this.world.centerY - 120, 'Game Over', { font: '100px Sheriff', fill: '#fff', align: 'center' })
    text.anchor.setTo(0.5, 0.5)
    let newGameButton = this.game.add.button(this.game.width * 0.5, this.game.height * 0.7, 'button', this.newGameClicked, this, 2, 1, 0)
    let creditsButton = game.add.button(game.world.centerX, 370, 'button', this.creditsOnClick, this, 2, 1, 0);
  }

  render () {
   
    if (this.newGameClicked) {
      this.state.start('Game')
    }
    if (this.creditsClicked) {
      this.state.start('Credits');
    }
  }

 
  //changes new_game into true
  newGameOnClick(){
    this.newGameClicked = true
  }

  //changes credits into true
  creditsOnClick(){
    this.creditsClicked = true
  }

}