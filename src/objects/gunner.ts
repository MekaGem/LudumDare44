import { Direction, getDX, getDirection } from "../logic/direction";
import { GUNNER } from "../const/const";
import { boxedSize } from "../utils/scaling";
import { Bullet } from "./bullet";

export class Gunner extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private _direction: Direction;
  private _sprite: Phaser.GameObjects.Sprite;
  private gunCooldown: number = 0;
  private _walking: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: Direction) {
    super(scene, x, y);

    this._sprite = scene.add.sprite(0, 0, "player", "Shooter1.PNG");
    var box = boxedSize(this._sprite.width, this._sprite.height, GUNNER.width, GUNNER.height);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.direction = Direction.Right;

    const anims = scene.anims;
    {
      var frameNames = anims.generateFrameNames("player", {
                           start: 1, end: 3, zeroPad: 0,
                           prefix: "Shooter", suffix: ".PNG"
                       });
      scene.anims.create({ key: "gunner-run", frames: frameNames, frameRate: 9, repeat: -1 });
    }
    {
      var frameNames = anims.generateFrameNames("player", {
                           start: 1, end: 1, zeroPad: 0,
                           prefix: "Shooter", suffix: ".PNG"
                       });
      scene.anims.create({ key: "gunner-shoot", frames: frameNames, frameRate: 9, repeat: -1 });
    }

    this.direction = direction;
    this.walking = true;
  }

  set direction(direction: Direction) {
    this._sprite.setFlipX(direction == Direction.Right);
    this._direction = direction;
  }

  get direction(): Direction {
    return this._direction;
  }

  update() {
    this.gunCooldown = Math.max(this.gunCooldown - 1, 0);

    if (this.walking) {
      this.body.setVelocityX(getDX(this._direction) * GUNNER.movingSpeed);
      this._sprite.anims.play("gunner-run", true);
    } else {
      this.body.setVelocityX(0);
      // TODO: Play idle-gunner animation.
      this._sprite.anims.stop();
    }
  }

  // Checks whether this gunner can see the given target.
  canSee(target: Phaser.Math.Vector2): boolean {
    let center = this.body.center;
    let distance = center.distance(target);
    var distanceCheck = (distance < GUNNER.visionDistance
                         && Math.abs(target.y - center.y) < this.height / 2);
    if (!distanceCheck) {
      return false;
    }

    // Walking gunners see only in the direction of walking.
    if (this.walking) {
      return (getDirection(center.x, target.x) == this.direction);
    }
    return true;
  }

  tryShoot(): boolean {
    if (this.gunCooldown == 0) {
      this.gunCooldown = GUNNER.gunCooldown;
      this._sprite.anims.play("gunner-shoot", true);
      return true;
    }
    return false;
  }

  set walking(walking: boolean) {
    this._walking = walking;
  }

  get walking(): boolean {
    return this._walking;
  }
}
