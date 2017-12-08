export default class extends Phaser.State{
    init(){
        this.stage.backgroundColor = '#321'
    }

    preload(){
    
        this.logo = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.3, 'logo')
        this.btnPlay = this.game.add.button(this.logo.x, this.logo.y + 150, 'btnPlay', this.startGame, this, 2, 1, 0)

        this.logo.anchor.setTo(0.5)
        this.btnPlay.anchor.setTo(0.5)

    }

    startGame(){
        this.state.start('Game')
    }

    create(){
    }
}