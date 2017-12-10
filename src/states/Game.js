import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'
import Door from '../sprites/Door'
import Key from '../sprites/Key'
import Ladder from '../sprites/Ladder'
import Segment from './Segment'
import Rock from '../sprites/Rock'
import Hideable from '../sprites/Hideable'

export default class extends Phaser.State {

  constructor() {
    super()
    this.key_counter = 0;
    this.CHASING_TIME = 2000;
    this.GAME_OVER_TIME = 2000;
    this.NOISE_BAR_MAX = 160;
    window.playerDetected = false;
  }

  init() { }
  preload() { }

  create() {

    this
      .game
      .physics
      .startSystem(Phaser.Physics.ARCADE);

    //LOADING BACKGROUND
    this.bg = this
      .game
      .add
      .tileSprite(0, 0, 900, 600, 'background');
    this.bg.fixedToCamera = true;

    this.map = this.game.add.tilemap('level', 16, 16);
    this.map.addTilesetImage('tiles');
    this.game.physics.arcade.gravity.y = 800;
    // this.hideLayer = this.map.createBlankLayer('hidden', 900, 600, 50, 50);
    this.layer = this.map.createLayer(0);
    this.add_collisions();
    this.layer.resizeWorld();
    // this.hideLayer.resizeWorld();

    //PLAYER
    this.player = new Player({ game: this.game, x: 50, y: 50, asset: 'dude', layer: this.layer })
    this.game.add.existing(this.player);

    //HIDEABLE
    this.hideable = new Hideable({game: this.game, x: 50, y: 50, asset: 'hideable', layer: this.hideLayer });
    this.game.add.existing(this.hideable);

    //LADDER
    this.ladder = new Ladder({ game: this.game, x: 1230, y: 300, asset: '', height: 800, layer: this.layer })
    this.game.add.existing(this.ladder);

    //ENEMIES
    this.enemies = this.game.add.group();
    this.addNewEnemy(500, 100);
    this.addNewEnemy(800, 300);
    this.addNewEnemy(600, 300);

    //DOORS AND KEYS
    this.doors = this.game.add.group();
    this.keys = this.game.add.group();
    this.keyIdCounter = 0;

    //ROCKS
    this.rocks = this.game.add.group();

    this.addKeyDoorPair(630, 300, this.genNewKey(850, 100));
    this.addKeyDoorPair(825, 550, this.genNewKey(25, 300));

    //GAME CAMERA, CURSORS
    this.game.camera.follow(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.rockButton = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
    this.killButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.sneakyButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.killButtonFlag = true;

    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    //TIME
    this.game.time.events.add(Phaser.Timer.SECOND * 50, this.game_over, this);

    var lines, map, layer, cursors, sprite, line, tileHits = [], plotting = false;
    this.ray = new Phaser.Line();

    this.graphics = game.add.graphics(0, 0);
  }

  addNewEnemy(posX, posY) {

    this.enemies.add(new Enemy({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'enemy',
      layer: this.layer,
      player: this.player
    }));

  }

  shootRays() {
    var intersections = [];
    var segments = this.createSegmentsFromTiles(this.layer.getTiles(this.player.x - 400, this.player.y - 400, 800, 800, true, true));
    var uniqueAngles = [];
    var j;
    var points = (function (segments) {
      var a = [];
      segments.forEach(function (segment) {
        a.push(segment.start, segment.end);
      });
      return a;
    })(segments);
    var uniquePoints = (function (points) {
      var set = {};
      return points.filter(function (point) {
        var key = point.x + ',' + point.y;
        if (key in set) {
          return false;
        } else {
          set[key] = true;
          return true;
        }
      });
    })(points);

    for (j = 0; j < uniquePoints.length; j++) {
      var uniquePoint = uniquePoints[j];
      var angle = Math.atan2(uniquePoint.y - this.player.y, uniquePoint.x - this.player.x);
      uniquePoint.angle = angle;
      uniqueAngles.push(angle - 5, angle, angle + 5);
    }

    for (j = 0; j < uniqueAngles.length; j++) {
      var angle = uniqueAngles[j];
      var dx = Math.cos(angle);
      var dy = Math.sin(angle);
      this.ray.start.set(this.player.x, this.player.y);
      this.ray.end.set(this.player.x + dx, this.player.y + dy);
      var intersection = this.getClosestIntersection(this.ray, segments);
      if (!!intersection && intersection.x > 0 && intersection.x < game.world.width && intersection.y > 0 && intersection.y < game.world.height) {
        intersection.angle = angle;
        intersections.push(intersection);
      }
    }

    return intersections;
  }
  drawLines(intersections) {
    intersections.forEach(function (intersection, index) {
      if (!!intersection) {
        lines[index].start.set(this.player.x, this.player.y);
        lines[index].end.set(intersection.x, intersection.y);
      }
    });

  }

  drawVisibilityPoly(intersections) {
    this.graphics.clear();
    intersections = intersections.sort(function (a, b) {
      return a.angle - b.angle;
    });
    var points = [];
    intersections.forEach(function (intersection) {
      points.push(intersection.x, intersection.y);
    });
    var poly = new Phaser.Polygon(points);

    this.drawNoiseBar();
    
    this.graphics.beginFill(0x000000);
    this.graphics.alpha = 0.5;
    this.graphics.drawPolygon(poly);
  }
  getClosestIntersection(ray, segments) {
    //determine which side to come from
    var intersection = null;
    var closestIntersection;
    var raySegment = this.createSegmentFromRay(ray);
    var angles = [];
    segments.forEach(function (tileSegment) {

      if (raySegment.direction.x / raySegment.magnitude === tileSegment.direction.x / tileSegment.magnitude && raySegment.direction.y / raySegment.magnitude === tileSegment.direction.y / tileSegment.magnitude) {
        return null;
      }

      //Solve for T1 and T2

      var T2 = (raySegment.direction.x * (tileSegment.start.y - raySegment.start.y) + raySegment.direction.y * (raySegment.start.x - tileSegment.start.x)) / (tileSegment.direction.x * raySegment.direction.y - tileSegment.direction.y * raySegment.direction.x);
      var T1 = (tileSegment.start.x + tileSegment.direction.x * T2 - raySegment.start.x) / raySegment.direction.x;

      if (T1 < 0) {
        return null;
      }
      if (T2 < 0 || T2 > 1) {
        return null;
      }

      intersection = {
        x: raySegment.start.x + raySegment.direction.x * T1,
        y: raySegment.start.y + raySegment.direction.y * T1,
        tile: tileSegment.tile
      };

      intersection.direction = {
        x: intersection.x - raySegment.start.x,
        y: intersection.y - raySegment.start.y,
      };

      intersection.magnitude = Math.sqrt(Math.pow(intersection.direction.x, 2) + Math.pow(intersection.direction.y, 2));

      if (!closestIntersection) {
        closestIntersection = intersection;
      } else if (closestIntersection.magnitude > intersection.magnitude) {
        closestIntersection = intersection;
      }
    }, this);
    return closestIntersection;
  }

  createSegmentsFromTiles(tiles) {
    var segments = [], segment;
    tiles.forEach(function (tile) {
      if (!!tile.faceBottom) {
        segment = new Segment();
        segment.start.x = tile.left;
        segment.end.x = tile.right;
        segment.start.y = tile.bottom;
        segment.end.y = tile.bottom;
        segment.tile = tile;
        if (!(segment in segments)) {
          segments.push(this.calculateSegmentProperties(segment));
        }
      }
      if (!!tile.faceTop) {
        segment = new Segment();
        segment.start.x = tile.left;
        segment.end.x = tile.right;
        segment.start.y = tile.top;
        segment.end.y = tile.top;
        segment.tile = tile;
        if (!(segment in segments)) {
          segments.push(this.calculateSegmentProperties(segment));
        }
      }
      if (!!tile.faceLeft) {
        segment = new Segment();
        segment.start.x = tile.left;
        segment.end.x = tile.left;
        segment.start.y = tile.top;
        segment.end.y = tile.bottom;
        segment.tile = tile;
        if (!(segment in segments)) {
          segments.push(this.calculateSegmentProperties(segment));
        }
      }
      if (!!tile.faceRight) {
        segment = new Segment();
        segment.start.x = tile.right;
        segment.end.x = tile.right;
        segment.start.y = tile.top;
        segment.end.y = tile.bottom;
        segment.tile = tile;
        if (!(segment in segments)) {
          segments.push(this.calculateSegmentProperties(segment));
        }
      }
      return segments;
    }, this);

    return segments;
  }
  calculateSegmentProperties(segment) {
    segment.direction.x = segment.end.x - segment.start.x;
    segment.direction.y = segment.end.y - segment.start.y;
    segment.magnitude = Math.sqrt(Math.pow(segment.direction.x, 2) + Math.pow(segment.direction.y, 2));
    return segment;
  }
  createSegmentFromRay(ray) {
    var segment = new Segment();
    segment.start = ray.start;
    segment.end = ray.end;
    segment.direction.x = segment.end.x - segment.start.x;
    segment.direction.y = segment.end.y - segment.start.y;
    segment.magnitude = Math.sqrt(Math.pow(segment.direction.x, 2) + Math.pow(segment.direction.y, 2));
    return segment;
  }

  update() {
    console.log(this.player.isVisible);
    this.game.physics.arcade.collide(this.hideable, this.layer);
    if(this.game.physics.arcade.overlap(this.hideable, this.player)){
        this.player.setInvisible(1);
    }else{
      this.player.setInvisible(0);
    }
    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.enemies, this.layer);
    this.game.physics.arcade.collide(this.player, this.rocks);
    this.game.physics.arcade.collide(this.layer, this.rocks, this.layerRockCollision);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.simpleCollision);
    this.game.physics.arcade.collide(this.enemies, this.rocks, this.enemyRockCollision);
    this.game.physics.arcade.collide(this.doors, this.layer);
    this.game.physics.arcade.collide(this.keys, this.layer);
    this.game.physics.arcade.collide(this.enemies, this.doors, this.switchDirection);
    this.game.physics.arcade.collide(this.ladder, this.layer);
    this.game.physics.arcade.collide(this.player, this.doors, Door.unlockDoor);
    this.game.physics.arcade.overlap(this.player, this.keys, this.key_collector, null, this);

    this.enemies.setAll('body.immovable', true);
    this.player.body.velocity.x = 0;
    this.movementPlayer();

    this.enemies.forEach(enemy => {
      if ((enemy.detectPlayer() || enemy.noiseLevel >= 100000) && this.player.isVisible == 1) {

        window.playerDetected = true;
        this.seen = true;
        this.timeUnseen = Date.now();
      }
      enemy.addNoise(this.player);
    });
    if (this.player.lastNoises.length >= 1) {
      this.player.lastNoises.shift();
    }
    if (this.player.lastNoises.length == 0) {
      this.player.lastNoises.push(0);
    }

    if (!this.seen) {
      this.timeSeen = Date.now();
    }

    if (this.checkTimeUndetected()) {
      window.playerDetected = false;
    }

    if (this.checkTimeDetected()) {
      this.game.state.start('GameOver');
    }
    this.seen = false;

    //this.drawNoiseBar();
    var intersections = this.shootRays();
    this.drawVisibilityPoly(intersections);
    this.drawShadow();0
    
  }

  drawShadow() {
    this.lightSprite.reset(this.game.camera.x, this.game.camera.y);
    this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
    this.shadowTexture.context.fillRect(-20, -20, this.game.width + 20, this.game.height + 20);

    var radius = 150 + this.game.rnd.integerInRange(1, 5),
      heroX = this.player.x - this.game.camera.x,
      heroY = this.player.y - this.game.camera.y;

    var gradient = this.shadowTexture.context.createRadialGradient(
      heroX, heroY, 100 * 0.3,
      heroX, heroY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = gradient;
    this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI * 2, false);
    this.shadowTexture.context.fill();

    this.shadowTexture.dirty = true;
    this.player.updateXCoordinate();
    this.player.updateYCoordinate();
  }

  drawNoiseBar(){
    this.graphics.beginFill(0xC7C7C7);
    this.graphics.drawRect(this.game.camera.x +32 , this.game.camera.y + 50,160, 30);
    this.graphics.alpha = 1;
    this.graphics.endFill();

    this.enemies.sort('noiseLevel', Phaser.Group.SORT_DESCENDING);

    const angriest = this.enemies.getAt(0);

    let fact = angriest.noiseLevel / 100000;

    if(window.playerDetected){
        this.graphics.beginFill(0xED2828);
        this.graphics.drawRect(this.game.camera.x + 32, this.game.camera.y + 50, this.NOISE_BAR_MAX, 30);
    }
    else{
      if(fact > 1)
        fact = 1;
      console.log("noise bar")
      this.graphics.beginFill(0x74D953);
      this.graphics.drawRect(this.game.camera.x + 32, this.game.camera.y + 50, this.NOISE_BAR_MAX * fact, 30);
    }


    this.graphics.alpha = 1;
    this.graphics.endFill();
  }


  switchDirection(enemy, door) {
    if (enemy.facing == 'left')
      enemy.body.x += 2;
    else
      enemy.body.y -= 2;
    enemy.switchDirection();
  }

  checkTimeUndetected() {
    return (Date.now() - this.timeUnseen) > this.CHASING_TIME;
  }

  checkTimeDetected() {

    return (Date.now() - this.timeSeen) > this.GAME_OVER_TIME;
  }

  key_collector(player, key) {
    key.kill();
    player.inventory.push(key);
  }

  addKeyDoorPair(doorPosX, doorPosY, corrKey) {

    this.doors.add(new Door({ game: this.game, x: doorPosX, y: doorPosY, asset: 'door', key: corrKey }));
    this.keys.add(corrKey);
  }

  genNewKey(posX, posY) {
    return new Key({
      game: this.game,
      x: posX,
      y: posY,
      asset: 'key'
    }, this.keyIdCounter++);
  }

  movementPlayer() {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.stop();
    }
    if (this.game.physics.arcade.overlap(this.ladder, this.player)) {
      this.player.body.velocity.y = -13.5;

      if (this.cursors.up.isDown) {
        this.player.moveUp();
      }
      if (this.cursors.down.isDown) {
        this.player.moveDown();
      }
    }

    if (this.sneakyButton.isDown) {
      this.player.sneking = 1;
    } else if (this.sneakyButton.isUp) {
      this.player.sneking = 0;
    }
    if (this.jumpButton.isDown) {
      this.player.jump();
    }
    if (this.rockButton.isDown) {
      this.thrown = true;
    }
    if(this.rockButton.isUp && this.thrown == true)
      {
        this.duration = this.rockButton.duration;
        this.createRock(this.duration);
        this.thrown = false;
      }

    if (this.killButton.isDown) {

      if (this.killButtonFlag) {

        this.enemies.forEach(enemy => {
          if (Math.abs(this.player.x - enemy.x) < 50) {
            if (this.lookingAtEnemyFromBehind(this.player, enemy)) {
              enemy.killEnemy();

              this.enemies.remove(enemy);
            }
          }
        })
        this.killButtonFlag = false;
      }
    }

    if (this.killButton.isUp) {
      this.killButtonFlag = true;
    }
  }

  lookingAtEnemyFromBehind(player, enemy) {

    if (player.facing == 'left' && enemy.facing == 'left') {
      return (player.body.x > enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    } else if (player.facing == 'right' && enemy.facing == 'right') {
      return (player.body.x < enemy.body.x) && this.areOnTheSameLevel(player, enemy);
    }
    else if (player.facing == 'idle') {
      if (enemy.facing == 'left') {
        return (player.body.x > enemy.body.x) && this.areOnTheSameLevel(player, enemy);
      }
      else {
        return (player.body.x < enemy.body.x) && this.areOnTheSameLevel(player, enemy);
      }
    }
    // else {
    //   return this.areOnTheSameLevel(player, enemy);
    // }
  }

  areOnTheSameLevel(player, enemy) {
    return (player.body.y == enemy.body.y)
  }

  // playerIsCaught(player, enemy){
  //   return (player.body.x < enemy.body.x && enemy.facing == 'left') || (player.body.x > enemy.body.x && enemy.facing == 'right')
  // }

  simpleCollision(player, enemy) {
    if((player.body.x < enemy.body.x && enemy.facing == 'left'&& player.isVisible == 1)|| ((player.body.x > enemy.body.x && enemy.facing == 'right')&& player.isVisible == 1  )){
      console.log(game);
      game.state.start('GameOver');
    }
    enemy.body.velocity.x = 0;
  }




  add_collisions() {
    this.map.setCollisionBetween(30, 279);
    this.map.setCollisionBetween(310, 349);
    this.map.setCollisionBetween(380, 419);
    this.map.setCollisionBetween(450, 484);
    this.map.setCollisionBetween(520, 559);
    this.map.setCollisionBetween(606, 629);
    this.map.setCollisionBetween(676, 699);
    this.map.setCollisionBetween(736, 769);
    this.map.setCollisionBetween(806, 839);
    this.map.setCollisionBetween(876, 909);
    this.map.setCollisionBetween(946, 974);
    this.map.setCollisionBetween(1016, 1049);
    this.map.setCollisionBetween(1086, 1119);
    this.map.setCollisionBetween(1750, 1767);
    this.map.setCollisionBetween(1734, 1749);
    this.map.setCollisionBetween(1804, 1819);
    this.map.setCollisionBetween(1874, 1889);
    this.map.setCollisionBetween(1944, 1951);
    this.map.setCollisionBetween(2018, 2029);
    this.map.setCollisionBetween(1166, 1189);
    this.map.setCollisionBetween(1236, 1259);
    this.map.setCollisionBetween(1306, 1329);
    this.map.setCollisionBetween(1376, 1399);
    this.map.setCollisionBetween(1446, 1469);
    this.map.setCollisionBetween(1516, 1539);
  }

  createRock(duration) {
    if(duration > 600)
      duration = 600;
    this.rock = new Rock({ game: this.game, x: this.player.x, y: this.player.y - 25, asset: 'rock',enemies: this.enemies });
    this.rocks.add(this.rock);
    this.game.add.existing(this.rocks);
    if(this.player.lastDirection == "left")
      this.rock.body.velocity.x = -duration;
    else
      this.rock.body.velocity.x = duration;
    this.rock.body.velocity.y = -duration/3*2;
  }

  enemyRockCollision(enemy, rock)
  {
    enemy.myOgłuszenie();
    rock.kill();
  }

  layerRockCollision(rock, layer)
  {

    console.log(rock.body.x);
    for(var i = 0; i < rock.enemies.length; i++)
      rock.enemies.children[i].setTarget(rock.body.x, rock.body.y);

    rock.kill();
  }


  game_over() {
    this.game.state.start('GameOver');
  }

  render() {
    this.game.debug.text("Time left: " + game.time.events.duration, 32, 32);
  }
}
