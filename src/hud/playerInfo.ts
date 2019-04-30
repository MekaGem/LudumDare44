import { PLAYER_HUD, EVENT, PLAYER } from "../const/const";
import { PlayerState } from "../logic/playerState";
import { boxedSize } from "../utils/scaling";

// Components for showing current player information.
export class HealthBar extends Phaser.GameObjects.Container {
  private playerState: PlayerState;

  // Something like in Diablo would look awesome.
  private bonusText: Phaser.GameObjects.Text;
  private fullBar: Phaser.GameObjects.Sprite;
  private emptyBar: Phaser.GameObjects.Sprite;

  constructor(scene, x: number, y: number, playerState: PlayerState) {
    super(scene, x, y);

    this.playerState = playerState;

    this.bonusText = scene.make.text({
      x: 600,
      y: 10,
      style: PLAYER_HUD.bloodTextStyle,
      add: false,
    });
    this.add(this.bonusText);

    this.emptyBar = scene.make.sprite({
      x: 100,
      y: 25,
      key: "healthbar_empty",
    });
    this.fullBar = scene.make.sprite({
      x: 100,
      y: 25,
      key: "healthbar_full",
    });
    var box = boxedSize(this.emptyBar.width, this.emptyBar.height,
                        PLAYER_HUD.healthBarWidth, PLAYER_HUD.healthBarHeight);
    this.emptyBar.setDisplaySize(box.width, box.height);
    this.fullBar.setDisplaySize(box.width, box.height);
    this.add(this.emptyBar);
    this.add(this.fullBar);

    // Don't move with the camera.
    this.setScrollFactor(0);
    this.scene.add.existing(this);

    this.update();
    this.playerState.on(EVENT.bloodChanged, delta => {
      this.update();
    });
    this.playerState.on(EVENT.scoreChanged, score => {
      this.update();
    });
  }

  update() {
    this.bonusText.setText("Score: " + this.playerState.score.toString());

    var rate = this.playerState.blood * 1.0 / PLAYER.maxBlood;
    this.fullBar.setCrop(0, 0, this.fullBar.width * rate, this.fullBar.height);
  }
}
