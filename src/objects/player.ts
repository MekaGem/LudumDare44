import { PlayerState } from "../logic/playerState";
import { PLAYER } from "../const/const";
import { Direction } from "../logic/direction";

// Stores graphical and physical representation of Player.
export class Player extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private playerState: PlayerState;
  private _sprite: Phaser.GameObjects.Sprite;
  private _direction: Direction;

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene: Phaser.Scene, params: any, playerState: PlayerState) {
    super(scene, params.x, params.y);

    this.playerState = playerState;

    this._sprite = scene.add.sprite(0, 0, "player");

    var box = new Phaser.Structs.Size(this._sprite.width, this._sprite.height,
                                      Phaser.Structs.Size.FIT);
    box.fitTo(PLAYER.width, PLAYER.height);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  highlight(active) {
    if (active) {
      this._sprite.setTint(0xff0000);
    } else {
      this._sprite.setTint(0x00ff00);
    }
  }

  get direction(): Direction {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._direction = direction;
  }
}
