import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {

    var background;

    game.load.spritesheet('mission1_button', 'assets/buttons/mission1.png', 153, 167);
    game.load.spritesheet('mission2_button', 'assets/buttons/mission2.png', 153, 167);
    game.load.spritesheet('mission3_button', 'assets/buttons/mission3.png', 153, 167);
    game.load.spritesheet('mission4_button', 'assets/buttons/mission4.png', 153, 167);
    game.load.spritesheet('mission5_button', 'assets/buttons/mission5.png', 153, 167);
    game.load.spritesheet('mission1_locked_button', 'assets/buttons/mission1 _locked.png', 153, 167);
    game.load.spritesheet('mission2_locked_button', 'assets/buttons/mission2 _locked.png', 153, 167);
    game.load.spritesheet('mission3_locked_button', 'assets/buttons/mission3_locked.png', 153, 167);
    game.load.spritesheet('mission4_locked_button', 'assets/buttons/mission4_locked.png', 153, 167);
    game.load.spritesheet('mission5_locked_button', 'assets/buttons/mission5_locked.png', 153, 167);
    game.load.spritesheet('mission-locked_button', 'assets/buttons/mission-locked.png', 153, 167);
    game.load.spritesheet('mission-unlocked_button', 'assets/buttons/mission-unlocked.png', 153, 167);
    game.load.spritesheet('mission-completed_button', 'assets/buttons/mission-completed.png', 153, 167);
    game.load.image('background','assets/images/stagemenu-background-3-2-ratio.jpg');

  }


  create() {

    game.stage.backgroundColor = '#FFFFFF';

    this.background = game.add.tileSprite(0, 0, 900, 600, 'background');

    this.mission1_button = game.add.button(game.world.centerX - 100, 180, 'mission1_button', this.startGame, this, 2, 1, 0);
    this.mission2_button = game.add.button(game.world.centerX - 20, 250, 'mission2_locked_button',this.actionOnClick, this, 2, 1, 0);
    this.mission3_button = game.add.button(game.world.centerX - 120, 320, 'mission3_locked_button', this.actionOnClick, this, 2, 1, 0);
    this.mission4_button = game.add.button(game.world.centerX - 250, 350, 'mission4_locked_button', this.actionOnClick, this, 2, 1, 0);
    this.mission5_button = game.add.button(game.world.centerX - 400, 370, 'mission5_locked_button', this.actionOnClick, this, 2, 1, 0);


    this.missionButton_state = new Map();
    this.missionButton_state.set(this.mission1_button, {state: "unlocked", image: 'mission1_button'});
    this.missionButton_state.set(this.mission2_button, {state: "locked", image: 'mission2_locked_button'});
    this.missionButton_state.set(this.mission3_button, {state: "locked", image: 'mission3_locked_button'});
    this.missionButton_state.set(this.mission4_button, {state: "locked", image: 'mission4_locked_button'});
    this.missionButton_state.set(this.mission5_button, {state: "locked", image: 'mission5_locked_button'});
    this.mission1_button.onInputOver.add(this.over, this);
    this.mission1_button.onInputOut.add(this.out, this)
    this.mission2_button.onInputOut.add(this.out, this);
    this.mission2_button.onInputOver.add(this.over, this);
    this.mission3_button.onInputOut.add(this.out, this);
    this.mission3_button.onInputOver.add(this.over, this);
    this.mission4_button.onInputOut.add(this.out, this);
    this.mission4_button.onInputOver.add(this.over, this);
    this.mission5_button.onInputOut.add(this.out, this);
    this.mission5_button.onInputOver.add(this.over, this);


  }

  over(button) {
    if(this.missionButton_state.get(button).state == "locked")
    {
        button.loadTexture('mission-locked_button');
    }
    else if (this.missionButton_state.get(button).state == "unlocked")
    {
        button.loadTexture('mission-unlocked_button');
    }
  }

  out(button) {
      button.loadTexture(this.missionButton_state.get(button).image);
  }

  actionOnClick (button) {

  }

  startGame(){
    this.state.start('Tutorial')
  }

}
