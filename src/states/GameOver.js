export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#000'
    //true if we clicked new game
    this.newGameClicked = false;
    //true if we clicked credits
    this.creditsClicked = false;
  }

  preload() {
    var background;
    this.background = game.add.tileSprite(0, 0, 900, 600, 'background_menu');
  }

  create() {
    let text = this.add.text(this.game.width * 0.5, this.game.height * 0.3, 'Game Over', { font: '100px Sheriff', fill: '#fff', align: 'center' })
    text.anchor.setTo(0.5, 0.5)
    let newGameButton = this.game.add.button(this.game.width * 0.5, this.game.height * 0.6, 'btnPlay', this.newGameOnClicked, this, 2, 1, 0);
    let creditsButton = this.game.add.button(this.game.width * 0.5, this.game.height * 0.85, 'button', this.creditsOnClick, this, 2, 1, 0);

    newGameButton.scale.setTo(0.8, 0.8);
    creditsButton.scale.setTo(0.8, 0.8);
    newGameButton.anchor.setTo(0.5, 0.5)
    creditsButton.anchor.setTo(0.5, 0.5)
  }

  render() {

    if (this.newGameClicked) {
      console.log("lel");
      this.state.start('Game');
    }
    if (this.creditsClicked) {
      this.state.start('Credits');
    }
  }

  //changes new_game into true
  newGameOnClicked() {
    this.newGameClicked = true;
  }

  //changes credits into true
  creditsOnClick() {
    this.creditsClicked = true;
  }

}