import { BULLET } from "../const/const";

// Stores graphical and physical representation of Bullet.
export class Bullet extends Phaser.GameObjects.Container {

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene: Phaser.Scene, params: any) {
    super(scene, params.x, params.y);

    let drop = scene.add.sprite(0, 0, "blood_drop");
    // TODO: Scale should depend on bullet size.
    drop.setScale(1.0 / 8);
    this.setSize(BULLET.size, BULLET.size);
    this.add(drop);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setAllowGravity(false);
  }
}
