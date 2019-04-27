import { PlayerState } from "../logic/playerState";
import { PLAYER_INFO, CONST, PLAYER_PHYSICS, BULLET } from "../const/const";
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
  private playerUnit: Player;
  private ground: Phaser.Physics.Arcade.Sprite;
  private cursors: CursorKeys;
  private canvas: HTMLCanvasElement;
  private wallsGroup: Phaser.Physics.Arcade.StaticGroup;
  private enemiesGroup: Phaser.Physics.Arcade.Group;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private updateList: Phaser.GameObjects.UpdateList;

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
    this.load.image(BULLET.BLOOD.spritePack, BULLET.BLOOD.spriteName);

    this.load.image("tiles", "mario.png");
    this.load.tilemapTiledJSON("level1", "maps/level1.json");

    //this.load.atlas("gunner", "./assets/gunner.png", "./assets/gunner.json");
    this.load.multiatlas("gunner", "gunner.json");

    this.canvas = this.sys.game.canvas;
  }

  private getWidth(): number {
    return this.canvas.width;
  }

  private getHeight(): number {
    return this.canvas.height;
  }

  create(): void {
    // Add more colors to the dull black world.
    this.cameras.main.setBackgroundColor(CONST.backgroundColor);

    this.tilemap = this.make.tilemap({ key: "level1" });
    this.tileset = this.tilemap.addTilesetImage("mario", "tiles");

    this.worldLayer = this.tilemap.createStaticLayer("World", this.tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });

    this.playerState = new PlayerState(PLAYER_INFO.startingBlood);
    this.playerHealthBar = new HealthBar(this, {
      x: 30,
      y: 30,
    }, this.playerState);
    this.playerHealthBar.setScrollFactor(0);

    const playerSpawn: any = this.tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");
    this.playerUnit = new Player(this, {x: playerSpawn.x, y: playerSpawn.y}, this.playerState);

    this.physics.add.collider(this.playerUnit, this.worldLayer);

    this.updateList = new Phaser.GameObjects.UpdateList(this);
    this.enemiesGroup = this.physics.add.group();

    const gunnerSpawns: any = this.tilemap.filterObjects("Objects", obj => obj.name === "GunnerSpawn");
    for (var spawn of gunnerSpawns) {
      let gunner = new Gunner(this, spawn.x, spawn.y);
      this.updateList.add(gunner);
      this.enemiesGroup.add(gunner);
      this.physics.add.collider(gunner, this.worldLayer);
    }

    function test(player: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) {
      let playerBody: Phaser.Physics.Arcade.Body = player.body;
    }
  }

  update(time: number, delta: number): void {
    this.playerUnit.body.setVelocityX(0);
    if (this.cursors.right.isDown) {
      this.playerUnit.body.setVelocityX(PLAYER_PHYSICS.wSpeed);
      this.playerUnit.setDirection(Direction.Right);
    }
    if (this.cursors.left.isDown) {
      this.playerUnit.body.setVelocityX(-PLAYER_PHYSICS.wSpeed);
      this.playerUnit.setDirection(Direction.Left);
    }
    if (this.cursors.up.isDown) {
      if (this.playerUnit.body.onFloor()) {
        this.playerUnit.body.setVelocityY(-PLAYER_PHYSICS.hSpeed);
      }
    }

    if (false) {
      this.playerUnit.highlight(this.playerUnit.body.onFloor());
    }
    this.cameras.main.startFollow(this.playerUnit);

    this.updateList.preUpdate();
  }

  onButtonDown(event): void {
    if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.Z) {
      let playerBody: Phaser.Physics.Arcade.Body = this.playerUnit.body;
      let bullet = new Bullet(this, playerBody.center.x, playerBody.center.y, BulletType.Blood, this.playerUnit.getDirection());

      this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
      });

      this.physics.add.collider(bullet, this.enemiesGroup, (b: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
        enemy.destroy();
      });
    }
  }
}
