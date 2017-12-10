import Phaser from 'phaser';


export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset,layer, player, sharedState}) {
    super(game, x, y, asset),
      this
        .anchor
        .setTo(0.5),
      this
        .game
        .physics
        .arcade
        .enable(this),
      //this.enableBody = true,
      this.layer = layer;
      this.timeToStep = this.game.time.now;

    //this init graphic for polygon
    this.graphics = this.game.add.graphics(0, 0);
    this.player = player;
    //speed of movement
    this.SPEED = 40;
    //0 - wander, 1 - chase, 2 - myOgłuszenie
    this.state = 0;
    this.timeForMyOgłuszenie = this.game.time.now + 4000;

    this.sharedState = sharedState;

    this.targetX = 0;
    this.targetY = 0;
    this.triggered = 0;
    this.triggeredTime = this.game.time.now;


    this.timeToStep = this.game.time.now;
    this.lastSwitchDirection = this.game.time.now;
    this
      .animations
      .add('left', [
        0, 1, 2, 3
      ], 10, true);
    this
      .animations
      .add('turn', [4], 20, true);
    this
      .animations
      .add('right', [
        5, 6, 7, 8
      ], 10, true);



    this.body.velocity.x = 0;
    this.facing = this.genFirstDirection();
    this.jumpTimer = this.game.time.now;
    this.noiseLevel = 0;
    this.polyOfViewRight = new Phaser.Polygon([
      new Phaser.Point(this.x, this.y - 23),
      new Phaser.Point(this.x + 100, this.y - 48),
      new Phaser.Point(this.x + 100, this.y + 25)
    ]);

    this.polyOfViewLeft = new Phaser.Polygon([
      new Phaser.Point(this.x, this.y - 25),
      new Phaser.Point(this.x - 100, this.y - 48),
      new Phaser.Point(this.x - 100, this.y + 25)
    ]);

    this.polyOfViewRight2 = new Phaser.Polygon([
      new Phaser.Point(this.x - 9, this.y - 10),
      new Phaser.Point(this.x + 66.7, this.y - 24.35),
      new Phaser.Point(this.x + 66.7, this.y + 24.35)
    ]);

    this.polyOfViewLeft2 = new Phaser.Polygon([
      new Phaser.Point(this.x - 9, this.y - 10),
      new Phaser.Point(this.x - 66.7, this.y - 24.35),
      new Phaser.Point(this.x - 66.7, this.y + 24.35)
    ]);


    this.currentTime = Date.now();
    this.time = this.genRandTime();
  }

  wander() {

    //if elapsed time < generated time
    if(this.checkTime() ){
      if(this.facing == 'left'){
        this.body.velocity.x  = -this.SPEED;
        this.animations.play('left');
      }
      else{
        this.body.velocity.x  = this.SPEED;
        this.animations.play('right');
      }
    }
    //else we reset the timer and switch direction
    else{
      this.switchDirection();
    }
  }

  myOgłuszenie() {
    this.state = 2;
    this.body.moves = false;
    this.timeForMyOgłuszenie = this.game.time.now + 4000;
  }

  runLeft(){
    this.facing = 'left';
    this.body.velocity.x  = -(this.SPEED + 30);
    this.animations.play('left');
  }

  runRight(){
    this.facing = 'right';
    this.body.velocity.x  = (this.SPEED + 30);
    this.animations.play('right');
  }

  chasePlayer() {
    console.log('czejsuje')
    if(this.isOnTheSameLevel() && this.player.isVisible == 1){

      if(this.player.body.x < this.body.x){
        this.facing = 'left';
        this.runLeft();

      }
      else{
        this.facing = 'right';
        this.runRight();
      }
    }
  }

  isOnTheSameLevel(){
      return Math.abs(this.player.body.y - this.player.body.y) < 50;
  }

  checkTime(){
      return (Date.now() - this.currentTime) < this.walkTime;
  }

  switchDirection(){
    this.currentTime = Date.now();
    this.walkTime = this.genRandTime();

    this.facing = this.facing == 'left' ? 'right' : 'left';
  }

  genRandTime(){
    return this.game.rnd.integerInRange(1000, 3500);
  }

  genFirstDirection(){
    let state = this.game.rnd.integerInRange(0, 2);

    if(state){
      return 'left';
    }
    else{
      return 'right';
    }
  }


  addNoise(player){
//console.log(player.lastNoises[0]);
    //calculate dist
    let distMax = 1000;
      if( Math.abs(this.body.x - player.body.x) < 1000 && Math.abs(this.body.y - player.body.y)< 50){
      let noise = (distMax - Math.abs(this.body.x - player.body.x));
      noise *= player.lastNoises[0];
      // console.log("Distans: " +(distMax-Math.abs(this.body.x - player.body.x)) + "  12312     Generowany hałas: " + noise);
      //alert("das");

      if(!window.playerDetected){
        this.noiseLevel += noise;
      }
    }
  }

  update() {
    if(!this.triggered){
      if(!window.playerDetected){
        this.wander();
      }
      else if (window.playerDetected){
        this.chasePlayer();
      }
      else if (this.state == 2)
      {
        this.stun();
      }

      if(this.state == 2 && this.timeForMyOgłuszenie < this.game.time.now)
      {
        this.body.moves = true;
        this.state = 0;
      }

      this.checkEdge();

      if(this.noiseLevel > 200){
        this.noiseLevel -= 200;
      }
      if(this.noiseLevel >= 100000){
        // console.log(`enemy ${this}: Wkurwilem się! aghhhh!`);
        // alert(`enemy ${this}: Level of noise: ${this.noiseLevel}           Dist: ${Math.abs(this.body.x - this.player.body.x)}!`);
        window.playerDetected = true;
        //this.noiseLevel = 0;
      }
      this.polyOfViewRight = new Phaser.Polygon([
        new Phaser.Point(this.x + 10, this.y - 20),
        new Phaser.Point(this.x + 120, this.y - 45.8),
        new Phaser.Point(this.x + 120, this.y + 25.8)
      ]);

      this.polyOfViewRight2 = new Phaser.Polygon([
        new Phaser.Point(this.x + 10, this.y - 20),
        new Phaser.Point(this.x + 80.7, this.y - 36.85),
        new Phaser.Point(this.x + 80.7, this.y + 8.85)
      ]);

      this.polyOfViewLeft2 = new Phaser.Polygon([
        new Phaser.Point(this.x - 9, this.y - 20),
        new Phaser.Point(this.x - 80.7, this.y - 36.35),
        new Phaser.Point(this.x - 80.7, this.y + 8.90)
      ]);

      this.polyOfViewLeft = new Phaser.Polygon([
        new Phaser.Point(this.x - 9, this.y - 20),
        new Phaser.Point(this.x - 120, this.y - 45),
        new Phaser.Point(this.x - 120, this.y + 25)
      ]);
      this.graphics.clear();
      this.drawView();
    } else{
      this.polyOfViewRight = new Phaser.Polygon([
        new Phaser.Point(this.x + 10, this.y - 20),
        new Phaser.Point(this.x + 120, this.y - 45.8),
        new Phaser.Point(this.x + 120, this.y + 25.8)
      ]);

      this.polyOfViewRight2 = new Phaser.Polygon([
        new Phaser.Point(this.x + 10, this.y - 20),
        new Phaser.Point(this.x + 80.7, this.y - 36.85),
        new Phaser.Point(this.x + 80.7, this.y + 8.85)
      ]);

      this.polyOfViewLeft2 = new Phaser.Polygon([
        new Phaser.Point(this.x - 9, this.y - 20),
        new Phaser.Point(this.x - 80.7, this.y - 36.35),
        new Phaser.Point(this.x - 80.7, this.y + 8.90)
      ]);

      this.polyOfViewLeft = new Phaser.Polygon([
        new Phaser.Point(this.x - 9, this.y - 20),
        new Phaser.Point(this.x - 120, this.y - 45),
        new Phaser.Point(this.x - 120, this.y + 25)
      ]);
      this.graphics.clear();
      this.drawView();
      this.goToTriger();
    }
  }

  goToTriger(){

    if(!window.playerDetected){
      
      if(this.triggeredTime > this.game.time.now){
        if(this.body.x > this.targetX){
          this.facing = 'left';
          this.runLeft();
  
        }
        else{
          this.facing = 'right';
          this.runRight();
        }
      }else{
        this.triggered = 0;
      }
    }
  }

  drawView(){
    this.graphics.beginFill(0xFFFFff);
    if (this.facing == 'left') {
      this.graphics.drawPolygon(this.polyOfViewLeft.points);
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewLeft2.points);
    }
    else {
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewRight.points);
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewRight2.points);
    }
    this.graphics.alpha = 0.2;
    this.graphics.endFill();
  }

  stop() {
    this
        .animations
        .stop();

    if (this.facing == 'left') {
        this.frame = 0;
    } else {
        this.frame = 5;
    }

    this.facing = 'idle';
  }

  detectPlayer(){
    if(this.facing == 'left'){
      for(var i = 0; i < 6; i++){
        if(this.polyOfViewLeft2.contains(this.player.coordinates[i][0], this.player.coordinates[i][1])){
          //change attitude of enemy
          return true;;
        }
        else if(this.polyOfViewLeft.contains(this.player.coordinates[i][0], this.player.coordinates[i][1])){
          return !this.player.sneking;
        }
      }
    }
    else{
      for(var i = 0; i < 6; i++){
        if(this.polyOfViewRight2.contains(this.player.coordinates[i][0], this.player.coordinates[i][1]) ){
          //change enemy attitude
          return true;
        }
        else if(this.polyOfViewRight.contains(this.player.coordinates[i][0], this.player.coordinates[i][1])){
          return !this.player.sneking;
        }

      }
    }
  }

  killEnemy(){
    this.graphics.beginFill(0xFF33ff);
    if (this.moveLeft === 0) {
      this.graphics.drawPolygon(this.polyOfViewLeft.points);
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewLeft2.points);
    }
    else {
      this.graphics.beginFill(0xFF33ff);
      this.graphics.drawPolygon(this.polyOfViewRight.points);
      this.graphics.beginFill(0xFFFFff);
      this.graphics.drawPolygon(this.polyOfViewRight2.points);
    }
    this.graphics.alpha = 0;
    this.graphics.endFill();
    this.kill();
    this.player.makeNoise(2);

  }

  setTarget(rockX, rockY){
    this.targetX = rockX;
    this.targetY = rockY;
    this.triggered = 1;
    this.triggeredTime = this.game.time.now + 2000;
  }

  checkEdge(){


    if(this.layer.getTiles(this.x -15, this.y +25, 30, 10,true).length == 1 && this.game.time.now- this.lastSwitchDirection >200)
      {
        this.switchDirection();
        this.lastSwitchDirection = this.game.time.now;
      }
  }


}
