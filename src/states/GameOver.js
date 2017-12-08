import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
    //true if we clicked new game
    this.newGameClicked = false;
    //true if we clicked credits
    this.creditsClicked = false;
  }

  preload () {
    //load game over image
  }

  create () {
    var imageGameOver = game.add.image(game.world.centerX, game.world.centerY, 'gameOver')
    let newGameButton = game.add.button(game.world.centerX, 250, 'button', this.newGameOnClick, this, 2, 1, 0);
    let creditsButton = game.add.button(game.world.centerX, 370, 'button', this.creditsOnClick, this, 2, 1, 0);
    imageGameOver.anchor.setTo(0.5)
    newGameButton.anchor.setTo(0.5)
    creditsButton.anchor.setTo(0.5)
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