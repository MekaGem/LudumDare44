export class MainScene extends Phaser.Scene {
  private playerUnit: Phaser.Physics.Arcade.Sprite;
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
  }

  create(): void {
    this.playerUnit = this.physics.add.sprite(50, 50, "player");
    this.playerUnit.setCollideWorldBounds(true);
  }

  update(time): void {
    if (this.cursors.right.isDown) {
      this.playerUnit.x += 10;
    } else if (this.cursors.left.isDown) {
      this.playerUnit.x -= 10;
    } else if (this.cursors.up.isDown) {
      this.playerUnit.y -= 10;
    } else if (this.cursors.down.isDown) {
      this.playerUnit.y += 10;
    }
  }
}
