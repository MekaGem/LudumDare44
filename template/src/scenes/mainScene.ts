export class MainScene extends Phaser.Scene {
  private playerUnit: Phaser.GameObjects.Graphics;
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
    this.load.image("logo", "./assets/phaser.png");
  }

  create(): void {
    this.playerUnit = this.add.graphics();
    this.playerUnit.fillStyle(0xFFFFFF, 1.0);
    this.playerUnit.fillCircle(350, 350, 30);
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
