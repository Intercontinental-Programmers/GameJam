
import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {

    var background;
    var mission1_button;
    var mission2_button;
    var mission3_button;
    var mission4_button;
    var mission5_button;
    game.load.spritesheet('mission1_button', 'assets/buttons/mission1.png', 153, 167);
    game.load.spritesheet('mission2_button', 'assets/buttons/mission2.png', 153, 167);
    game.load.spritesheet('mission3_button', 'assets/buttons/mission3.png', 153, 167);
    game.load.spritesheet('mission4-button', 'assets/buttons/mission4.png', 153, 167);
    game.load.spritesheet('mission5-button', 'assets/buttons/mission5.png', 153, 167);
    game.load.image('background','assets/images/stagemenu-background-3-2-ratio.jpg');

  }


  create() {

    game.stage.backgroundColor = '#FFFFFF';

    this.background = game.add.tileSprite(0, 0, 900, 600, 'background');

    this.mission1_button = game.add.button(game.world.centerX - 100, 180, 'mission1_button', this.actionOnClick, this, 2, 1, 0);

    this.mission1_button.onInputOver.add(this.over, this);
    this.mission1_button.onInputOut.add(this.out, this);

  }

  over() {
      console.log('button over');
  }

  out() {
      console.log('button out');
  }

  actionOnClick () {

      this.background.visible = !this.background.visible;

  }

}
