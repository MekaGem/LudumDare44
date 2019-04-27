import { BULLET } from "../const/const";
import { Direction, getDX } from "../logic/direction";

export enum BulletType {
  Blood,
  Gun,
}

export class Bullet extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, type: BulletType, direction: Direction) {
    super(scene, x, y);

    let config = Bullet.chooseConfig(type);

    var sprite: Phaser.GameObjects.Sprite;
    if (type == BulletType.Blood) {
      sprite = this.scene.add.sprite(0, 0, config.spritePack);
    } else {
      sprite = this.scene.add.sprite(0, 0, config.spritePack, config.spriteName);
    }
    sprite.setDisplaySize(config.size, config.size);
    this.setSize(config.size, config.size);
    this.add(sprite);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setVelocityX(getDX(direction) * config.speed);
  }

  private static chooseConfig(type: BulletType): any {
    if (type == BulletType.Blood) {
      return BULLET.BLOOD;
    } else if (type == BulletType.Gun) {
      return BULLET.GUN;
    }
  }
}
