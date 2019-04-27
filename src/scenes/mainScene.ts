import { PlayerState } from "../logic/playerState";
import { PLAYER_INFO } from "../const/const";
import { HealthBar } from "../hud/playerInfo";

export class MainScene extends Phaser.Scene {
  // Logic.
  private playerState: PlayerState;

  // Graphics and physics.
  private playerHealthBar: HealthBar;
  private playerUnit: Phaser.Physics.Arcade.Sprite;
  private ground: Phaser.Physics.Arcade.Sprite;
  private cursors: CursorKeys;
  private canvas: HTMLCanvasElement;

  private LEVEL_WIDTH: number = 1200;
  private LEVEL_HEIGHT: number = 1200;
  private wallsGroup: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload(): void {
    this.load.image("player", "./assets/vampire.png");
    this.load.image("ground", "./assets/ground.png");
    this.load.image("1x1white", "./assets/1x1white.png");

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
    this.cameras.main.setBackgroundColor('#ccccff');

    {
      this.wallsGroup = this.physics.add.staticGroup();

      let border = 50;

      let upWall = this.physics.add.staticSprite(-border, -border, "1x1white");
      upWall.setScale(this.LEVEL_WIDTH + border * 2, border);
      upWall.setSize(this.LEVEL_WIDTH + border * 2, border);
      upWall.setOrigin(0, 0);
      upWall.setTint(0xff0000);

      let downWall = this.physics.add.staticSprite(-border, this.LEVEL_HEIGHT, "1x1white");
      downWall.setScale(this.LEVEL_WIDTH + border * 2, border);
      downWall.setSize(this.LEVEL_WIDTH + border * 2, border);
      downWall.setOrigin(0, 0);
      downWall.setTint(0xff0000);

      let leftWall = this.physics.add.staticSprite(-border, -border, "1x1white");
      leftWall.setScale(border, this.LEVEL_HEIGHT + border * 2);
      leftWall.setSize(border, this.LEVEL_HEIGHT + border * 2);
      leftWall.setOrigin(0, 0);
      leftWall.setTint(0xff0000);

      let rightWall = this.physics.add.staticSprite(this.LEVEL_WIDTH, -border, "1x1white");
      rightWall.setScale(border, this.LEVEL_HEIGHT + border * 2);
      rightWall.setSize(border, this.LEVEL_HEIGHT + border * 2);
      rightWall.setOrigin(0, 0);
      rightWall.setTint(0xff0000);

      this.wallsGroup.add(upWall);
      this.wallsGroup.add(downWall);
      this.wallsGroup.add(leftWall);
      this.wallsGroup.add(rightWall);
    }

    this.playerState = new PlayerState(PLAYER_INFO.STARTING_BLOOD);
    this.playerHealthBar = new HealthBar(this, {
      x: 30,
      y: 30,
    }, this.playerState);
    this.playerHealthBar.setScrollFactor(0);

    this.ground = this.physics.add.staticSprite(200, 400, "ground");
    this.wallsGroup.add(this.ground);

    this.playerUnit = this.physics.add.sprite(200, 120, "player");
    this.playerUnit.setScale(0.8);

    this.physics.add.collider(this.playerUnit, this.wallsGroup, test);

    function test(player: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) {
      let playerBody: Phaser.Physics.Arcade.Body = player.body;
    }
  }

  update(time): void {
    const horizontalSpeed = 200;
    this.playerUnit.setVelocityX(0);
    if (this.cursors.right.isDown) {
      this.playerUnit.setVelocityX(horizontalSpeed);
    }
    if (this.cursors.left.isDown) {
      this.playerUnit.setVelocityX(-horizontalSpeed);
    }
    if (this.cursors.up.isDown) {
      if (this.playerUnit.body.onFloor()) {
        this.playerUnit.setVelocityY(-2 * horizontalSpeed);
      }
    }

    if (this.playerUnit.body.onFloor()) {
      this.playerUnit.setTint(0xff0000);
    } else {
      this.playerUnit.setTint(0x00ff00);
    }
    this.cameras.main.startFollow(this.playerUnit);
  }
}
