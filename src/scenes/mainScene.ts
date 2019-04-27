export class MainScene extends Phaser.Scene {
  private playerUnit: Phaser.Physics.Arcade.Sprite;
  private ground: Phaser.Physics.Arcade.Sprite;
	private cursors: CursorKeys;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload(): void {
    this.load.image("player", "./assets/circle.png");
    this.load.image("ground", "./assets/ground.png");
    // this.load.atlas("ground", "./assets/ground.png", "./assets/ground.json");
  }

  create(): void {
    this.ground = this.physics.add.sprite(0, 400, "ground");
    this.ground.setCollideWorldBounds(true);

    this.playerUnit = this.physics.add.sprite(50, 50, "player");
    this.playerUnit.setCollideWorldBounds(true);

    this.physics.add.collider(this.ground, this.playerUnit);
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
      if (this.playerUnit.body.velocity.y == 0) {
        this.playerUnit.setVelocityY(-2 * horizontalSpeed);
      }
    } else if (this.cursors.down.isDown) {
      // this.playerUnit.y += 10;
    }
  }
}
