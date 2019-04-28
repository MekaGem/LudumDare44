import { Direction, getDX } from "../logic/direction";
import { GUNNER } from "../const/const";
import { boxedSize } from "../utils/scaling";

export class Gunner extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private movingDirection: Direction;
  private _sprite: Phaser.GameObjects.Sprite;
  private _alive: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this._alive = true;

    this._sprite = scene.add.sprite(0, 0, "gunner", "gunner-0.png");
    var box = boxedSize(this._sprite.width, this._sprite.height, GUNNER.width, GUNNER.height);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setDirection(Direction.Right);
  }

  setDirection(direction: Direction) {
    this.movingDirection = direction;
  }

  update() {
    if (!this._alive) {
      return;
    }

    this.body.setVelocityX(getDX(this.movingDirection) * GUNNER.movingSpeed);
  }

  destroy() {
    this._alive = false;
    super.destroy();
  }
}
