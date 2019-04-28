import { PlayerState } from "../logic/playerState";
import { PLAYER, CONST, BULLET, PLAYER_HUD } from "../const/const";
import { HealthBar } from "../hud/playerInfo";
import { Player } from "../objects/player";
import { Bullet, BulletType } from "../objects/bullet";
import { Gunner } from "../objects/gunner";
import { Direction } from "../logic/direction";

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
  private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private enemiesGroup: Phaser.Physics.Arcade.Group;

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
    this.load.image("player", "vampire.png");
    this.load.image("ground", "ground.png");
    this.load.image("1x1white", "1x1white.png");
    this.load.image(BULLET.blood.spritePack, BULLET.blood.spriteName);

    this.load.image("tiles", "mario.png");
    this.load.tilemapTiledJSON("level1", "maps/level1.json");

    this.load.multiatlas("gunner", "gunner.json");
  }

  _addToUpdateList(object: Phaser.GameObjects.GameObject) {
    object.on(Phaser.GameObjects.Events.DESTROY, obj => this.updateList.delete(obj));
    this.updateList.add(object);
  }

  create(): void {
    // Add more colors to the dull black world.
    this.cameras.main.setBackgroundColor(CONST.backgroundColor);

    this.updateList = new Set();

    this.tilemap = this.make.tilemap({ key: "level1" });
    this.tileset = this.tilemap.addTilesetImage("mario", "tiles");

    this.backgroundLayer = this.tilemap.createStaticLayer("Background", this.tileset, 0, 0);

    this.worldLayer = this.tilemap.createStaticLayer("World", this.tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });

    // Player creation.
    this.playerState = new PlayerState(PLAYER.startingBlood);
    const playerSpawn: any = this.tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");
    this.player = new Player(this, playerSpawn.x, playerSpawn.y, this.playerState);
    this.physics.add.collider(this.player, this.worldLayer);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

    // HUD creation (depends on the player state).
    this.playerHealthBar = new HealthBar(
      this, PLAYER_HUD.healthBarOffsetX, PLAYER_HUD.healthBarOffsetY, this.playerState);

    this.gunners = new Set();

    // Enemies creation.
    this.enemiesGroup = this.physics.add.group();
    const gunnerSpawns: any = this.tilemap.filterObjects("Objects", obj => obj.name === "GunnerSpawn");
    for (var spawn of gunnerSpawns) {
      let gunner = new Gunner(this, spawn.x, spawn.y);
      this.enemiesGroup.add(gunner);
      this.physics.add.collider(gunner, this.worldLayer);
      this.gunners.add(gunner);
      this._addToUpdateList(gunner);
    }

    this.bloodParticles = this.add.particles("1x1white");

    this.worldLayer.forEachTile(tile => {
      // Make tiles controlling NPC actions invisible.
      if (!this.game.config.physics.arcade.debug) {
        if ("npc_action" in tile.properties) {
          tile.setVisible(false);
        }
      }
    });
  }

  update(time: number, delta: number): void {
    // Handles player controls.
    this.player.update();

    for (var obj of this.updateList) {
      obj.update();
    }

    for (var gunner of this.gunners) {
      let gunnerCenter = gunner.body.center;
      let playerCenter = this.player.body.center;

      var tile = this.worldLayer.getTileAtWorldXY(gunnerCenter.x, gunnerCenter.y);
      if (tile && ("npc_action" in tile.properties)) {
        var action = tile.properties["npc_action"];
        if (action == "left") {
          gunner.direction = Direction.Left;
        } else if (action == "right") {
          gunner.direction = Direction.Right;
        }
      }

      let distanceToPlayer = gunnerCenter.distance(playerCenter);
      if (distanceToPlayer < 300 && Math.abs(playerCenter.y - gunnerCenter.y) < 30) {
        var direction: Direction;
        if (gunnerCenter.x > playerCenter.x) {
          direction = Direction.Left;
        } else {
          direction = Direction.Right;
        }

        if (direction == gunner.direction && gunner.tryShoot()) {
          let bullet = new Bullet(this, gunnerCenter.x, gunnerCenter.y, BulletType.Gun, direction);

          this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
            bullet.destroy();
          });

          this.physics.add.overlap(bullet, this.player, (b: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) => {
            bullet.destroy();
            this.playerState.damage(1);
          });
        }
      }
    }
  }

  onButtonDown(event): void {
    if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.Z) {
      let playerBody: Phaser.Physics.Arcade.Body = this.player.body;
      let bullet = new Bullet(this, playerBody.center.x, playerBody.center.y, BulletType.Blood, this.player.direction);
      // Emitting a bullet hits you.
      this.playerState.damage(1);

      this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
      });

      this.physics.add.overlap(bullet, this.enemiesGroup, (b: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) => {
        bullet.destroy();

        if (enemy instanceof Gunner) {
          let gunner = enemy as Gunner;
          this.gunners.delete(gunner);
          this.enemiesGroup.remove(gunner);
          this.updateList.delete(gunner);
          gunner.body.stop();

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

          this.time.delayedCall(5000, ()=>{
            console.log("gunner die !!!");
            emitter.stop();
            enemy.destroy();
          }, [], this);
        }
      });
    }
  }
}
