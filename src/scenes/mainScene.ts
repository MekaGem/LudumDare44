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
  private gunners: Gunner[];
  private updateList: Set<Phaser.GameObjects.GameObject>;

  private cursors: Phaser.Input.Keyboard.CursorKeys;

  // Holds data about the actual map.
  private tilemap: Phaser.Tilemaps.Tilemap;
  // ???
  private tileset: Phaser.Tilemaps.Tileset;
  // Display object derived from the tilemap.
  private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private enemiesGroup: Phaser.Physics.Arcade.Group;


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
    this.cameras.main.startFollow(this.player);
    this.physics.add.collider(this.player, this.worldLayer);

    // HUD creation (depends on the player state).
    this.playerHealthBar = new HealthBar(
      this, PLAYER_HUD.healthBarOffsetX, PLAYER_HUD.healthBarOffsetY, this.playerState);

    this.gunners = [];

    // Enemies creation.
    this.enemiesGroup = this.physics.add.group();
    const gunnerSpawns: any = this.tilemap.filterObjects("Objects", obj => obj.name === "GunnerSpawn");
    for (var spawn of gunnerSpawns) {
      let gunner = new Gunner(this, spawn.x, spawn.y);
      this.enemiesGroup.add(gunner);
      this.physics.add.collider(gunner, this.worldLayer);
      this.gunners.push(gunner);
      this._addToUpdateList(gunner);
    }
  }

  update(time: number, delta: number): void {
    var onGround = this.player.body.onFloor();
    var acceleration = onGround ? PLAYER.groundAcceleration : PLAYER.airAcceleration;

    if (this.cursors.right.isDown) {
      this.player.body.setAccelerationX(acceleration);
      this.player.direction = Direction.Right;
    } else if (this.cursors.left.isDown) {
      this.player.body.setAccelerationX(-acceleration);
      this.player.direction = Direction.Left;
    } else {
      this.player.body.setAccelerationX(0);
    }

    if (onGround && this.cursors.up.isDown) {
      this.player.body.setVelocityY(-PLAYER.hSpeed);
    }

    for (var obj of this.updateList) {
      obj.update();
    }

    for (var gunner of this.gunners) {
      let gunnerCenter = gunner.body.center;
      let playerCenter = this.player.body.center;

      let distanceToPlayer = gunnerCenter.distance(playerCenter);
      if (distanceToPlayer < 300 && Math.abs(playerCenter.y - gunnerCenter.y) < 30) {
        console.log("distanceToPlayer = " + distanceToPlayer);
        if (gunner.tryShoot()) {
          var direction: Direction;
          if (gunnerCenter.x > playerCenter.x) {
            direction = Direction.Left;
          } else {
            direction = Direction.Right;
          }
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

      this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
      });

      this.physics.add.overlap(bullet, this.enemiesGroup, (b: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
        enemy.destroy();

        const index = this.gunners.indexOf(enemy as Gunner, 0);
        if (index > -1) {
          this.gunners.splice(index, 1);
        }
      });
    }
  }
}
