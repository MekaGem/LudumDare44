import { PLAYER_HUD, EVENT, PLAYER } from "../const/const";
import { PlayerState } from "../logic/playerState";
import { boxedSize } from "../utils/scaling";

// Components for showing current player information.
export class HealthBar extends Phaser.GameObjects.Container {
  private playerState: PlayerState;

  // Something like in Diablo would look awesome.
  private healthText: Phaser.GameObjects.Text;
  private fullBar: Phaser.GameObjects.Sprite;
  private emptyBar: Phaser.GameObjects.Sprite;

  constructor(scene, x: number, y: number, playerState: PlayerState) {
    super(scene, x, y);

    this.playerState = playerState;

    this.healthText = scene.make.text({
      x: 0,
      y: 0,
      style: PLAYER_HUD.bloodTextStyle,
      add: false,
    });
    this.add(this.healthText);

    this.emptyBar = scene.make.sprite({
      x: 150,
      y: 50,
      key: "healthbar_empty",
    });
    this.fullBar = scene.make.sprite({
      x: 150,
      y: 50,
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
      // TODO: If delta is negative, show damage, otherwise show regen animation.
      this.update();
    });
  }

  update() {
    this.healthText.setText("Blood: " + this.playerState.blood.toString());
    var rate = this.playerState.blood * 1.0 / PLAYER.maxBlood;

    this.fullBar.setCrop(0, 0, this.fullBar.width * rate, this.fullBar.height);
  }
}
