// Components for showing current player information.
export class HealthBar extends Phaser.GameObjects.Container {
  // Something like in Diablo would look awesome.
  
  constructor(scene, params) {
    super(scene, params);
    this.scene.add.existing(this);
  }
}
