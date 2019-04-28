import { Direction, getDX } from "../logic/direction";
import { GUNNER } from "../const/const";

export class Gunner extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private movingDirection: Direction;
  private _sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this._sprite = scene.add.sprite(0, 0, "gunner", "gunner-0.png");
    var box = new Phaser.Structs.Size(this._sprite.width, this._sprite.height,
                                      Phaser.Structs.Size.FIT);
    box.fitTo(GUNNER.width, GUNNER.height);
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

  // TODO: Consider instead manually call update method for all gunners in mainScene.update.
  // https://github.com/photonstorm/phaser/pull/3379#issuecomment-373718957
  preUpdate() {
    this.body.setVelocityX(getDX(this.movingDirection) * GUNNER.movingSpeed);
  }
}
