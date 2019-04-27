// Stores graphical and physical representation of Bullet.
export class Bullet extends Phaser.GameObjects.Container {

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene: Phaser.Scene, params: any) {
    super(scene, params.x, params.y);

    let drop = scene.add.sprite(0, 0, "blood_drop");
    drop.setScale(1.0 / 8);
    this.setSize(16, 16);
    this.add(drop);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setAllowGravity(false);
  }
}
