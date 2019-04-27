export class Gunner extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
      super(scene, x, y);

      let sprite = scene.add.sprite(0, 0, "gunner", "gunner-0.png");
      this.setSize(20, 38);
      this.add(sprite);

      scene.physics.world.enable(this);
      scene.add.existing(this);
    }
  }
