// Stores graphical and physical representation of Bullet.
export class Bullet extends Phaser.GameObjects.Container {

  // Knows how to draw itself.
  // Needs to have a physical body to collide with enemies.

  constructor(scene, params) {
    super(scene, params);
    scene.add.existing(this);
  }
}
