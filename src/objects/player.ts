import { PlayerState } from "../logic/playerState";
import { PLAYER_GRAPHICS } from "../const/const";
import { Direction } from "../logic/direction";

// Stores graphical and physical representation of Player.
export class Player extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private playerState: PlayerState;
  private playerUnit: Phaser.GameObjects.Sprite;
  private _direction: Direction;

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene: Phaser.Scene, params: any, playerState: PlayerState) {
    super(scene, params.x, params.y);

    this.playerState = playerState;

    this.playerUnit = scene.add.sprite(0, 0, "player");
    let scale = PLAYER_GRAPHICS.height / this.playerUnit.height;

    //var box = new Phaser.Structs.Size(
      //PLAYER_GRAPHICS.width, PLAYER_GRAPHICS.height, Phaser.Structs.Size.FIT);

    let width = this.playerUnit.width * scale;
    let height = this.playerUnit.height * scale;
    this.playerUnit.setDisplaySize(width, height);
    this.setSize(width, height);

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

  get direction(): Direction {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._direction = direction;
  }
}
