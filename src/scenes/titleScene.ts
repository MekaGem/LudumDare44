export class TitleScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private startKey: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "TitleScene"
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  preload(): void {
    this.load.image("logo", "./assets/phaser.png");
  }

  create(): void {
    this.phaserSprite = this.add.sprite(400, 300, "logo");
    this.add.text(300, 450, "Click space to start!");
  }

  update(): void {
    if (this.startKey.isDown) {
      console.log("Space pressed");
      this.scene.start("MainScene");
    }
  }
}
 
