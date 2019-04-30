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
        this.load.setPath('./assets/');
        this.load.multiatlas("units", "atlas.json");
    }

    create(): void {
      let gameWidth = this.game.config.width as number;
      let gameHeight = this.game.config.height as number;

      this.phaserSprite = this.add.sprite(gameWidth / 2, gameHeight / 2, "units", "vamp_jump_4.png");
      this.add.text(300, 450, "You Win!", {fontSize: "32pt", color: "#f00"});
      this.add.text(50, 500, "Collected " + 10 + "/" + 10 + " disco balls", {fontSize: "32pt", color: "#f00"});
    }

    update(): void {
    }
  }
