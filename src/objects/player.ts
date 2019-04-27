import { PlayerState } from "../logic/playerState";

// Stores graphical and physical representation of Player.
export class Player extends Phaser.GameObjects.Container {
  private state: PlayerState;

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene, params) {
    super(scene, params);
    scene.add.existing(this);
  }
}
