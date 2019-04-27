import { PlayerState } from "../logic/playerState";
import { PLAYER_GRAPHICS } from "../const/const";
import { Direction } from "../logic/direction";

// Stores graphical and physical representation of Player.
export class Player extends Phaser.GameObjects.Container {
  private playerState: PlayerState;
  private playerUnit: Phaser.GameObjects.Sprite;
  private direction: Direction;

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene: Phaser.Scene, params: any, playerState: PlayerState) {
    super(scene, params.x, params.y);

    this.playerState = playerState;

    this.playerUnit = scene.add.sprite(0, 0, "player");
    let scale = PLAYER_GRAPHICS.height / this.playerUnit.height;

    //console.log(scale);
    //console.log(this.playerUnit.width);

    //this.playerUnit.setOrigin(this.playerUnit.width * scale / 2, 0);
    this.playerUnit.setOrigin(0, 0);
    this.setScale(scale);
    this.setSize(this.playerUnit.width * scale, this.playerUnit.height * scale);

    this.add(this.playerUnit);

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  highlight(active) {
    if (active) {
      this.playerUnit.setTint(0xff0000);
    } else {
      this.playerUnit.setTint(0x00ff00);
    }
  }

  setDirection(direction: Direction) {
    this.direction = direction;
  }

  getDirection(): Direction {
    return this.direction;
  }
}
