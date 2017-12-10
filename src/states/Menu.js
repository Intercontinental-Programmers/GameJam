export default class extends Phaser.State{
    init(){
       
    }

    preload(){
        
        var background;
        this.background = game.add.tileSprite(0, 0, 900, 600, 'background_menu');
        let text = this.add.text(this.game.width * 0.5, this.game.height * 0.3, 'Organization', { font: '100px Sheriff', fill: '#fff', align: 'center' })
        text.anchor.setTo(0.5, 0.5)
        this.btnPlay = this.game.add.button(this.game.width * 0.5, this.game.height * 0.7, 'btnPlay', this.startGame, this, 2, 1, 0)
        this.btnPlay.anchor.setTo(0.5)
        // this.btnCredits = this.game.add.button(this.game.width * 0.9, this.game.height * 0.9, 'btnCredits', this.showCredits, this, 2, 1, 0)
        // this.btnCredits.anchor.setTo(0.5)

    }

    startGame(){
        this.state.start('Game')
    }

    showCredits(){
        this.state.start('Credits')
    }

    create(){
    }
}