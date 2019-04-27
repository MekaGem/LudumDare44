import { PlayerState } from "../logic/playerState";

// Stores graphical and physical representation of Player.
export class Player extends Phaser.GameObjects.Container {
  private playerState: PlayerState;
  private playerUnit: Phaser.Physics.Arcade.Sprite;

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene, params, playerState: PlayerState) {
    super(scene, params.x, params.y);

    this.playerState = playerState;

    this.playerUnit = scene.add.sprite(0, 0, "player");
    this.setSize(140, 210);

    this.add(this.playerUnit);

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
}
