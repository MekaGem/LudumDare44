import { PLAYER_HUD, EVENT } from "../const/const";
import { PlayerState } from "../logic/playerState";

// Components for showing current player information.
export class HealthBar extends Phaser.GameObjects.Container {
  private player_state: PlayerState;

  // Something like in Diablo would look awesome.
  private health_text: Phaser.GameObjects.Text;
  private health_orb: Phaser.GameObjects.Sprite;

  constructor(scene, x: number, y: number, player_state: PlayerState) {
    super(scene, x, y);

    this.player_state = player_state;

    this.health_text = scene.make.text({
      x: 0,
      y: 0,
      style: PLAYER_HUD.bloodTextStyle,
      add: false,
    });
    this.add(this.health_text);

    //this.health_orb = scene.make.sprite({
      //x: 80,
      //y: 50,
      //key: "circle",
    //});
    //this.health_orb.setDisplaySize(100, 100);
    //this.add(this.health_orb);

    // Don't move with the camera.
    this.setScrollFactor(0);
    this.scene.add.existing(this);

    this.update();
    this.player_state.on(EVENT.bloodChanged, delta => {
      // TODO: If delta is negative, show damage, otherwise show regen animation.
      this.update();
    });
  }

  update() {
    this.health_text.setText("Blood: " + this.player_state.blood.toString());
  }
}
