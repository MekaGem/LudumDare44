export class TitleScene extends Phaser.Scene {
  private titleSprite: Phaser.GameObjects.Sprite;
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
    this.load.image("title", "./assets/title.jpg");
  }

  create(): void {
    var gameWidth = this.game.config.width as number;
    var gameHeight = this.game.config.height as number;

    this.titleSprite = this.add.sprite(gameWidth / 2, gameHeight / 2, "title");
    this.titleSprite.setDisplaySize(gameWidth, gameHeight);
    this.add.text(300, 450, "Click space to start!");
  }

  update(): void {
    if (this.startKey.isDown) {
      console.log("Space pressed");
      this.scene.start("MainScene");
    }
  }
}
