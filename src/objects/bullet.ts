import { BULLET } from "../const/const";
import { Direction, getDX } from "../logic/direction";
import { boxedSize } from "../utils/scaling";

export enum BulletType {
  Blood,
  Gun,
}

export class Bullet extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private _sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, type: BulletType, direction: Direction) {
    super(scene, x, y);

    let config = Bullet.chooseConfig(type);

    if (type == BulletType.Blood) {
      this._sprite = this.scene.add.sprite(0, 0, config.spritePack);
    } else {
      this._sprite = this.scene.add.sprite(0, 0, config.spritePack, config.spriteName);
    }
    var box = boxedSize(this._sprite.width, this._sprite.height, config.size, config.size);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);

    if (direction == Direction.Left) {
      this._sprite.setFlipX(true);
    }

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setVelocityX(getDX(direction) * config.speed);
  }

  private static chooseConfig(type: BulletType): any {
    if (type == BulletType.Blood) {
      return BULLET.blood;
    } else if (type == BulletType.Gun) {
      return BULLET.gun;
    }
  }
}
