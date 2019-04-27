import { PlayerState } from "../logic/playerState";
import { PLAYER_INFO } from "../const/const";
import { HealthBar } from "../hud/playerInfo";
import { Player } from "../objects/player";
import { Bullet } from "../objects/bullet";

export class MainScene extends Phaser.Scene {
  // Logic.
  private playerState: PlayerState;

  // Graphics and physics.
  private playerHealthBar: HealthBar;
  private playerUnit: Player;
  private ground: Phaser.Physics.Arcade.Sprite;
  private cursors: CursorKeys;
  private canvas: HTMLCanvasElement;

  private LEVEL_WIDTH: number = 1200;
  private LEVEL_HEIGHT: number = 1200;
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
    this.cameras.main.setBackgroundColor("#ccccff");

    this.tilemap = this.make.tilemap({ key: "level1" });
    this.tileset = this.tilemap.addTilesetImage("mario", "tiles");

    this.worldLayer = this.tilemap.createStaticLayer("World", this.tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);

    this.playerState = new PlayerState(PLAYER_INFO.STARTING_BLOOD);
    this.playerHealthBar = new HealthBar(this, {
      x: 30,
      y: 30,
    }, this.playerState);
    this.playerHealthBar.setScrollFactor(0);

    const spawnPoint: any = this.tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");
    this.playerUnit = new Player(this, {x: spawnPoint.x, y: spawnPoint.y}, this.playerState);

    this.physics.add.collider(this.playerUnit, this.wallsGroup, test);
    this.physics.add.collider(this.playerUnit, this.worldLayer);

    let gunner = this.add.sprite(30, 30, "gunner", "gunner-0.png");
    gunner.setScrollFactor(0);

    function test(player: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) {
      let playerBody: Phaser.Physics.Arcade.Body = player.body;
    }
  }

  update(time: number): void {
    const horizontalSpeed = 200;
    this.playerUnit.body.setVelocityX(0);
    if (this.cursors.right.isDown) {
      this.playerUnit.body.setVelocityX(horizontalSpeed);
      this.playerUnit.setDirection(1);
    }
    if (this.cursors.left.isDown) {
      this.playerUnit.body.setVelocityX(-horizontalSpeed);
      this.playerUnit.setDirection(-1);
    }
    if (this.cursors.up.isDown) {
      if (this.playerUnit.body.onFloor()) {
        this.playerUnit.body.setVelocityY(-2 * horizontalSpeed);
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

      this.physics.add.overlap(bullet, this.wallsGroup, (b: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => {
        bullet.destroy();
      });
    }
  }
}
