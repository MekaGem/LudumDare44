import { PlayerState } from "../logic/playerState";

// Components for showing current player information.
export class HealthBar extends Phaser.GameObjects.Container {
  private player_state: PlayerState;

  // Something like in Diablo would look awesome.
  private health_text: Phaser.GameObjects.Text;
  
  constructor(scene, scene_params, player_state: PlayerState) {
    super(scene, scene_params.x, scene_params.y);

    this.player_state = player_state;

    this.health_text = scene.make.text({
      x: 0,
      y: 0,
      style: {
        fontSize: 30,
        color: '#ffffff',
      },
      add: false,
    });
    this.add(this.health_text);

    this.health_text.setText("Blood: " + this.player_state.blood.toString());

    this.scene.add.existing(this);
  }
}
