import { Direction, getDX } from "../logic/direction";
import { GUNNER_INFO } from "../const/const";

export class Gunner extends Phaser.GameObjects.Container {
  private movingDirection: Direction;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    let sprite = scene.add.sprite(0, 0, "gunner", "gunner-0.png");
    this.setSize(20, 38);
    this.add(sprite);

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
    this.body.setVelocityX(getDX(this.movingDirection) * GUNNER_INFO.MOVING_SPEED);
  }
}
