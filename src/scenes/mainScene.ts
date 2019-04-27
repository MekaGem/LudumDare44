import { PlayerState } from "../logic/playerState";
import { PLAYER_INFO, CONST, PLAYER_PHYSICS } from "../const/const";
import { HealthBar } from "../hud/playerInfo";
import { Player } from "../objects/player";
import { Bullet } from "../objects/bullet";
import { Gunner } from "../objects/gunner";

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
  private tilemap: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;

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
    this.load.image("blood_drop", "blood_drop.png");

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
    this.cameras.main.setBackgroundColor(CONST.BACKGROUND_COLOR);

    this.tilemap = this.make.tilemap({ key: "level1" });
    this.tileset = this.tilemap.addTilesetImage("mario", "tiles");

    this.worldLayer = this.tilemap.createStaticLayer("World", this.tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });

    this.playerState = new PlayerState(PLAYER_INFO.STARTING_BLOOD);
    this.playerHealthBar = new HealthBar(this, {
      x: 30,
      y: 30,
    }, this.playerState);
    this.playerHealthBar.setScrollFactor(0);

    const playerSpawn: any = this.tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");
    this.playerUnit = new Player(this, {x: playerSpawn.x, y: playerSpawn.y}, this.playerState);

    this.physics.add.collider(this.playerUnit, this.worldLayer);

    const gunnerSpawns: any = this.tilemap.filterObjects("Objects", obj => obj.name === "GunnerSpawn");
    for (var spawn of gunnerSpawns) {
      let gunner = new Gunner(this, spawn.x, spawn.y);
      this.physics.add.collider(gunner, this.worldLayer);
    }

    function test(player: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) {
      let playerBody: Phaser.Physics.Arcade.Body = player.body;
    }
  }

  update(time: number): void {
    this.playerUnit.body.setVelocityX(0);
    if (this.cursors.right.isDown) {
      this.playerUnit.body.setVelocityX(PLAYER_PHYSICS.wSpeed);
      this.playerUnit.setDirection(1);
    }
    if (this.cursors.left.isDown) {
      this.playerUnit.body.setVelocityX(-PLAYER_PHYSICS.wSpeed);
      this.playerUnit.setDirection(-1);
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
  }

  onButtonDown(event): void {
    if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.Z) {
      let playerBody: Phaser.Physics.Arcade.Body = this.playerUnit.body;
      let bullet = new Bullet(this, {x: playerBody.center.x, y: playerBody.center.y});

      bullet.body.setVelocityX(this.playerUnit.getDirection() * 600);

      this.physics.add.collider(bullet, this.worldLayer, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
      });
    }
  }
}
