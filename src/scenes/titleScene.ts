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
    this.add.text(280, 500, "Click space to start!", {fontSize: "14pt", color: "#fff"});
    this.add.text(40, 550, "Controls: arrows to move and jump, z - shoot, x - melee attack", {fontSize: "14pt", color: "#fff"});
  }

  update(): void {
    if (this.startKey.isDown) {
      console.log("Space pressed");
      this.scene.start("MainScene");
    }
  }
}
