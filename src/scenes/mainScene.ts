import { PlayerState } from "../logic/playerState";
import { PLAYER, CONST, BULLET, PLAYER_HUD, GUNNER, EVENT } from "../const/const";
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
  private bloodSpots: Set<Phaser.GameObjects.GameObject>;

  // Particles
  private bloodParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;

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
    this.load.image("circle", "circle.png");
    this.load.image("1x1white", "1x1white.png");
    this.load.image(BULLET.blood.spritePack, BULLET.blood.spriteName);

    this.load.image("tiles", "mario.png");
    this.load.tilemapTiledJSON("level1", "maps/level1.json");

    // TODO: Clean up and rename as those are stored in the same texture now.
    this.load.multiatlas("gunner", "gunner.json");
    this.load.multiatlas("player", "vampire.json");
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

    this.updateList = new Set();

    this.tilemap = this.make.tilemap({ key: "level1" });
    this.tileset = this.tilemap.addTilesetImage("mario", "tiles");

    this.backgroundLayer = this.tilemap.createStaticLayer("Background", this.tileset, 0, 0);

    this.worldLayer = this.tilemap.createDynamicLayer("World", this.tileset, 0, 0);
    this.worldLayer.setScale(1);
    this.worldLayer.setCollisionByProperty({ collides: true });

    // Player creation.
    this.playerState = new PlayerState(PLAYER.startingBlood);
    const playerSpawn: any = this.tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");
    this.player = new Player(this, playerSpawn.x, playerSpawn.y, this.playerState, directionFromSpawn(playerSpawn));
    this.physics.add.collider(this.player, this.worldLayer);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

    // HUD creation (depends on the player state).
    this.playerHealthBar = new HealthBar(
      this, PLAYER_HUD.healthBarOffsetX, PLAYER_HUD.healthBarOffsetY, this.playerState);

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

    this.worldLayer.forEachTile(tile => {
      // Make tiles controlling NPC actions invisible.
      if (!this.game.config.physics.arcade.debug) {
        if ("npc_action" in tile.properties) {
          tile.setVisible(false);
        }
      }
    });

    this.playerState.on(EVENT.playerDied, () => {
      const cam = this.cameras.main;
      cam.shake(500, 0.05);
      cam.fade(1000, 0, 0, 0);

      this.player.freeze();
      cam.once("camerafadeoutcomplete", () => {
        this.scene.restart();
      });
    });
  }

  update(time: number, delta: number): void {
    // Handles player controls.
    if (this.playerState.alive) {
      this.player.update();
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

            this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject,
                                                                wall: Phaser.GameObjects.GameObject) => {
              bullet.destroy();
            });

            this.physics.add.overlap(bullet, this.player, (b: Phaser.GameObjects.GameObject,
                                                           player: Phaser.GameObjects.GameObject) => {
              bullet.destroy();
              this.playerState.blood -= 1;
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
      if (spotCenter.distance(this.player.body.center) < 30) {
        this.playerState.regenerate();
      }
    }

    {
      let playerCenter = this.player.body.center;
      let tile = this.worldLayer.getTileAtWorldXY(playerCenter.x, playerCenter.y);

      let exit = getTileProperty(tile, "exit");
      if (exit) {
        this.scene.start("EndGameScene");
      }

      let blood = getTileProperty(tile, "blood");
      if (blood) {
        setTileProperty(tile, "blood", false);
        this.playerState.blood += 1;
        tile.setVisible(false);
      }
    }
  }

  private killGunner(gunner: Gunner) {
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
      this.playerState.blood -= 1;

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
