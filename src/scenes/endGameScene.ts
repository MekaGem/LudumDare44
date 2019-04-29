export class EndGameScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;

    constructor() {
      super({
        key: "EndGameScene"
      });
    }

    init(): void {
    }

    preload(): void {
      this.load.image("logo", "./assets/phaser.png");
    }

    create(): void {
      this.phaserSprite = this.add.sprite(400, 300, "logo");
      this.add.text(300, 450, "You Win!");
    }

    update(): void {
    }
  }
