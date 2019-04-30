import { PlayerState } from "../logic/playerState";
import { PLAYER, CONST, BULLET, PLAYER_HUD, GUNNER, EVENT, BONUS } from "../const/const";
import { HealthBar } from "../hud/playerInfo";
import { Player } from "../objects/player";
import { Bullet, BulletType } from "../objects/bullet";
import { Gunner, GunnerState } from "../objects/gunner";
import { Direction, getDirection, directionFromSpawn } from "../logic/direction";
import { getActionFromTile, getTileProperty, setTileProperty } from "../logic/actionTiles";

export class MainScene extends Phaser.Scene {
  // Logic.
  private playerState: PlayerState;

  // Graphics and physics.
  private playerHealthBar: HealthBar;
  private player: Player;
  private gunners: Set<Gunner>;
  private updateList: Set<Phaser.GameObjects.GameObject>;

  private cursors: Phaser.Input.Keyboard.CursorKeys;

  // Holds data about the actual map.
  private tilemap: Phaser.Tilemaps.Tilemap;
  // Stores tiles images.
  private tileset: Phaser.Tilemaps.Tileset;
  // Display object derived from the tilemap.
  private worldLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private enemiesGroup: Phaser.Physics.Arcade.Group;
  private spikeGroup: Phaser.Physics.Arcade.StaticGroup;
  private bloodSpots: Set<Phaser.GameObjects.GameObject>;

  // Particles
  private bloodParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;

  // Sounds.
  private gunshotSound: Phaser.Sound.HTML5AudioSound;
  private bloodshotSound: Phaser.Sound.HTML5AudioSound;
  private collectBonusSound: Phaser.Sound.HTML5AudioSound;
  private openDoorSound: Phaser.Sound.HTML5AudioSound;
  private playerDiesSound: Phaser.Sound.HTML5AudioSound;
  private gunnerDiesSound: Phaser.Sound.HTML5AudioSound;
  private drinkingBloodSound: Phaser.Sound.HTML5AudioSound;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown", this.onButtonDown, this);
  }

  preload(): void {
    this.load.setPath('./assets/');
    this.load.image("background", "background.png");
    this.load.image("ground", "ground.png");
    this.load.image("spike", "tiles/spike.png");
    this.load.image("discoball", "tiles/discoball.png");
    this.load.image("healthbar_empty", "healthbar_empty.png");
    this.load.image("healthbar_full", "healthbar_full.png");
    this.load.image("1x1white", "1x1white.png");
    this.load.image("exit", "exit.png");
    this.load.image(BULLET.blood.spritePack, BULLET.blood.spriteName);
    this.load.image(BULLET.gun.spritePack, BULLET.gun.spriteName);

    this.load.image("tiles", "bloodnight_all_tiles.png");
    this.load.tilemapTiledJSON("level", "maps/level.json");
    //this.load.tilemapTiledJSON("level1", "maps/level1.json");
    //this.load.multiatlas("bloodnight_tiles", "tiles/bloodnight.json");

    this.load.multiatlas("units", "atlas.json");

    // Load sounds.
    this.load.audio("gunshot", "sounds/gunshot.wav");
    this.load.audio("bloodshot", "sounds/bloodshot.wav");
    this.load.audio("collect_bonus", "sounds/collect_bonus.wav");
    this.load.audio("open_door", "sounds/open_door.wav");
    this.load.audio("player_dies", "sounds/player_dies.wav");
    this.load.audio("gunner_dies", "sounds/gunner_dies.wav");
    this.load.audio("drinking_blood", "sounds/drinking_blood.wav");
  }

  _addToUpdateList(object: Phaser.GameObjects.GameObject) {
    object.on(Phaser.GameObjects.Events.DESTROY, obj => this.updateList.delete(obj));
    this.updateList.add(object);
  }

  create(): void {
    var gameWidth = this.game.config.width as number;
    var gameHeight = this.game.config.height as number;

    // Add more colors to the dull black world. Sets background image.
    this.cameras.main.setBackgroundColor(CONST.backgroundColor);
    var background = this.add.image(gameWidth / 2, gameHeight / 2, "background");
    background.setDisplaySize(gameWidth, gameHeight);
    background.setScrollFactor(0);
    this.openDoorSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("open_door", {
      volume: 0.2,
    });
    this.gunshotSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("gunshot", {
      volume: 0.2,
    });
    this.bloodshotSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("bloodshot", {
      volume: 0.2,
    });
    this.collectBonusSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("collect_bonus", {
      volume: 0.2,
    });
    this.playerDiesSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("player_dies", {
      volume: 0.2,
    });
    this.gunnerDiesSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("gunner_dies", {
      volume: 0.2,
    });
    this.drinkingBloodSound = <Phaser.Sound.HTML5AudioSound> this.sound.add("drinking_blood", {
      volume: 0.2,
    });

    this.updateList = new Set();

    console.log("Loading tilemap");
    this.tilemap = this.make.tilemap({ key: "level" });
    this.tileset = this.tilemap.addTilesetImage("_bloodnight", "tiles");

    console.log("Loading background");
    this.backgroundLayer = this.tilemap.createStaticLayer("Background", this.tileset, 0, 0);

    this.worldLayer = this.tilemap.createDynamicLayer("World", this.tileset, 0, 0);
    this.worldLayer.setScale(1);
    this.worldLayer.setCollisionByProperty({ collides: true });

    // Player creation.
    this.playerState = new PlayerState(PLAYER.startingBlood);
    const playerSpawn: any = this.tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");
    this.player = new Player(this, playerSpawn.x, playerSpawn.y, this.playerState, directionFromSpawn(playerSpawn));
    this.physics.add.collider(this.player, this.worldLayer, playerWorldCollider);

    const exitSpawn: any = this.tilemap.findObject("Objects", obj => obj.name === "ExitSpawn");
    var exit = this.physics.add.sprite(exitSpawn.x, exitSpawn.y, "exit");
    exit.setDisplaySize(120, 120);
    this.physics.add.collider(exit, this.worldLayer);
    this.physics.add.overlap(exit, this.player,
                             (b: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) => {
        this.scene.start("EndGameScene", {"score": this.playerState.score});
    });

    let This = this;
    function playerWorldCollider(player: Phaser.GameObjects.GameObject, obj: Phaser.GameObjects.GameObject) {
      if (obj instanceof Phaser.Tilemaps.Tile) {
        let tile = obj as Phaser.Tilemaps.Tile;

        let door = getTileProperty(tile, "door");
        if (door != null && This.playerState.hasKey(door)) {
          setTileProperty(tile, "door", null);
          tile.setCollision(false);
          tile.setVisible(false);
          This.openDoorSound.play();
        }
      }
    }

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

    this.gunners = new Set();

    // Enemies creation.
    this.enemiesGroup = this.physics.add.group();
    const gunnerSpawns: any = this.tilemap.filterObjects("Objects", obj => obj.name === "GunnerSpawn");
    for (var spawn of gunnerSpawns) {
      let gunner = new Gunner(this, spawn.x, spawn.y, directionFromSpawn(spawn));
      this.enemiesGroup.add(gunner);
      this.physics.add.collider(gunner, this.worldLayer);
      this.gunners.add(gunner);
      this._addToUpdateList(gunner);
      gunner.state = GunnerState.Walking;
    }

    this.bloodParticles = this.add.particles("1x1white");
    this.bloodSpots = new Set();

    this.spikeGroup = this.physics.add.staticGroup();
    this.worldLayer.forEachTile(tile => {
      // Make tiles controlling NPC actions invisible.
      if (!this.game.config.physics.arcade.debug) {
        if ("npc_action" in tile.properties) {
          tile.setVisible(false);
        }
      }
      if ("spikes" in tile.properties) {
        var spike = this.physics.add.sprite(tile.getCenterX(), tile.getCenterY(), "spike");
        this.spikeGroup.add(spike);
        //this.spikeGroup.add(tile);
        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body
        // placement
        spike.rotation = tile.rotation;
        var height = 0;
        var width = 0;
        var offsetX = 0;
        var offsetY = 0;

        if (spike.angle === 0) {
          width = CONST.tileSize;
          height = 12;
          offsetX = 0;
          offsetY = CONST.tileSize - 12;
        } else if (spike.angle === -90) {
          width = 12;
          height = CONST.tileSize;
          offsetX = CONST.tileSize - 12;
          offsetY = 0;
        } else if (spike.angle === 90) {
          width = 12;
          height = CONST.tileSize;
          offsetX = 0;
          offsetY = 0;
        }

        spike.setDisplaySize(CONST.tileSize, CONST.tileSize);
        spike.setSize(width, height);
        spike.setOffset(offsetX, offsetY);
        this.physics.add.collider(spike, this.worldLayer);

        this.physics.add.overlap(spike, this.player,
                                 (b: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) => {
          this.playerState.blood = 0;
        });

        this.worldLayer.removeTileAt(tile.x, tile.y);
      }

      if ("bonus" in tile.properties) {
        var bonus = this.physics.add.sprite(tile.getCenterX(), tile.getCenterY(), "discoball");
        this.spikeGroup.add(bonus);
        //this.spikeGroup.add(tile);
        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body
        // placement
        var height = 0;
        var width = 0;
        //var offsetX = 0;
        //var offsetY = 0;

        width = CONST.tileSize;
        height = CONST.tileSize;
        //offsetX = 0;
        //offsetY = CONST.tileSize - 12;

        bonus.setDisplaySize(CONST.tileSize, CONST.tileSize);
        bonus.setSize(width, height);
        //spike.setOffset(offsetX, offsetY);
        this.physics.add.collider(bonus, this.worldLayer);

        this.physics.add.overlap(bonus, this.player,
                                 (b: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) => {
          this.playerState.score += 1;
          this.collectBonusSound.play();
          bonus.destroy();
        });

        this.worldLayer.removeTileAt(tile.x, tile.y);
      }
    });

    this.physics.add.overlap(this.spikeGroup, this.player,
                             (b: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) => {
      this.playerState.blood = 0;
      console.log("overlap");
    });

    this.playerState.on(EVENT.playerDied, () => {
      const cam = this.cameras.main;
      this.playerDiesSound.play();
      cam.shake(1000, 0.05);
      cam.fade(2500, 0, 0, 0);

      this.player.freeze();
      cam.once("camerafadeoutcomplete", () => {
        this.scene.restart();
      });
    });

    // HUD creation (depends on the player state).
    this.playerHealthBar = new HealthBar(
      this, PLAYER_HUD.healthBarOffsetX, PLAYER_HUD.healthBarOffsetY, this.playerState);
  }

  update(time: number, delta: number): void {
    // Handles player controls.
    if (this.playerState.alive) {
      this.player.update();
    }
    if (this.player.y > this.worldLayer.height) {
      this.playerState.blood = 0;
    }

    for (var obj of this.updateList) {
      obj.update();
    }

    for (var gunner of this.gunners) {
      if (gunner.state == GunnerState.Dying) {
        continue;
      }

      let gunnerCenter = gunner.body.center;
      let playerCenter = this.player.body.center;

      // Initiate shooting if this gunner can see the player.
      if (gunner.canSee(playerCenter) || (gunner.state == GunnerState.Shooting && gunner.canAim(playerCenter))) {
      //if (gunner.canAim(playerCenter)) {
        var direction = getDirection(gunnerCenter.x, playerCenter.x);
        gunner.direction = direction;
        gunner.state = GunnerState.Shooting;
        if (gunner.tryShoot()) {
          // Shoot with a slight delay.
          this.time.delayedCall(GUNNER.shootDelay, ()=>{
            let bullet = new Bullet(this, gunnerCenter.x, gunnerCenter.y, BulletType.Gun, direction);
            this.gunshotSound.play();

            this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject,
                                                                wall: Phaser.GameObjects.GameObject) => {
              bullet.destroy();
            });

            this.physics.add.overlap(bullet, this.player, (b: Phaser.GameObjects.GameObject,
                                                           player: Phaser.GameObjects.GameObject) => {
              bullet.destroy();
              this.playerState.blood -= GUNNER.attackDamage;
            });
          }, [], this);
        }
      } else {
        var tile = this.worldLayer.getTileAtWorldXY(gunnerCenter.x, gunnerCenter.y);
        var action = getActionFromTile(tile);
        if (action == "left") {
          gunner.direction = Direction.Left;
        } else if (action == "right") {
          gunner.direction = Direction.Right;
        }
        gunner.state = GunnerState.Walking;
      }
    }

    for (var spot of this.bloodSpots) {
      let spotCenter = (spot.body as Phaser.Physics.Arcade.Body).center;
      if (spotCenter.distance(this.player.body.center) < PLAYER.regenerateDistance) {
        //this.drinkingBloodSound.play();
        this.playerState.regenerate();
      }
    }

    {
      let playerCenter = this.player.body.center;
      let tile = this.worldLayer.getTileAtWorldXY(playerCenter.x, playerCenter.y);

      let exit = getTileProperty(tile, "exit");
      if (exit) {
        this.scene.start("EndGameScene", {"score": this.playerState.score});
      }

      let blood = getTileProperty(tile, "blood");
      if (blood) {
        setTileProperty(tile, "blood", false);
        this.playerState.blood += BONUS.bloodBonusAmount;
        tile.setVisible(false);
      }

      let key = getTileProperty(tile, "key");
      if (key != null) {
        setTileProperty(tile, "key", null);
        this.playerState.addKey(key);
        this.collectBonusSound.play()
        tile.setVisible(false);
      }
    }
  }

  private killGunner(gunner: Gunner) {
    this.gunnerDiesSound.play();
    this.bloodSpots.add(gunner);

    this.gunners.delete(gunner);
    this.enemiesGroup.remove(gunner);
    this.updateList.delete(gunner);
    gunner.state = GunnerState.Dying;

    let emitter = this.bloodParticles.createEmitter({
      x: gunner.body.center.x,
      y: gunner.body.center.y,
      lifespan: 200,
      speed: { min: 200, max: 400 },
      angle: { min: 180 + 45, max: 360 - 45 },
      gravityY: 1000,
      scale: { start: 2, end: 1.0 },
      quantity: 10,
      blendMode: 'NORMAL',
      tint: 0xff0000,
    });

    this.time.delayedCall(GUNNER.deathDuration, ()=>{
      if (this.game.config.physics.arcade.debug) {
        console.log("gunner die!!!");
      }
      emitter.stop();
      gunner.destroy();
      this.bloodSpots.delete(gunner);
    }, [], this);
  }

  onButtonDown(event): void {
    if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.Z) {
      let playerBody: Phaser.Physics.Arcade.Body = this.player.body;
      let bullet = new Bullet(this, playerBody.center.x, playerBody.center.y, BulletType.Blood, this.player.direction);
      // Emitting a bullet hits you.
      this.playerState.blood -= PLAYER.shotBloodCost;
      this.bloodshotSound.play();

      this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
      });

      this.physics.add.overlap(bullet, this.enemiesGroup, (b: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) => {
        bullet.destroy();

        if (enemy instanceof Gunner) {
          this.killGunner(enemy as Gunner);
        }
      });
    }

    if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.X) {
      this.player.attacking = true;

      let playerCenter = this.player.body.center;

      for (var gunner of this.gunners) {
        let thisGunner = gunner;
        let gunnerCenter = thisGunner.body.center;

        var direction = getDirection(playerCenter.x, gunnerCenter.x);
        if (this.player.direction == direction
            && Math.abs(playerCenter.y - gunnerCenter.y) < GUNNER.height / 2
            && Math.abs(playerCenter.x - gunnerCenter.x) < PLAYER.meleeAttackDistance
        ) {
          this.killGunner(thisGunner);
        }
      }

      this.time.delayedCall(PLAYER.meleeAttackDuration, ()=>{
        this.player.attacking = false;
      }, [], this);
    }
  }
}
