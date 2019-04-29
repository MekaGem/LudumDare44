import { Direction, getDX, getDirection } from "../logic/direction";
import { GUNNER } from "../const/const";
import { boxedSize } from "../utils/scaling";
import { Bullet } from "./bullet";

export enum GunnerState {
  None,
  Walking,
  Dying,
  Shooting,
}

export class Gunner extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private _direction: Direction;
  private _sprite: Phaser.GameObjects.Sprite;
  private gunCooldown: number = 0;
  private _state: GunnerState = GunnerState.None;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: Direction) {
    super(scene, x, y);

    this._sprite = scene.add.sprite(0, 0, "player", "Shooter1.PNG");
    var box = boxedSize(this._sprite.width, this._sprite.height, GUNNER.width, GUNNER.height);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);

    scene.physics.world.enable(this);
    scene.add.existing(this);

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
  }

  set direction(direction: Direction) {
    this._direction = direction;
    if (this.state == GunnerState.Walking) {
      this._sprite.setFlipX(this._direction == Direction.Right);
      this.body.setVelocityX(getDX(this._direction) * GUNNER.movingSpeed);
    }
  }
  get direction(): Direction {
    return this._direction;
  }

  get state() {
    return this._state;
  }
  set state(state: GunnerState) {
    if (this._state == state) {
      return;
    }
    this._state = state;

    switch (state) {
      case GunnerState.None:
        break;

      case GunnerState.Walking:
        this.body.setVelocityX(getDX(this._direction) * GUNNER.movingSpeed);
        this._sprite.setFlipX(this._direction == Direction.Right);
        this._sprite.anims.play("gunner-run", true);
        break;

      case GunnerState.Dying:
        this.body.setVelocityX(0);
        // TODO: Play idle-gunner animation.
        this._sprite.anims.stop();
        break;

      case GunnerState.Shooting:
        this.body.setVelocityX(0);
        // TODO: Play idle-gunner animation.
        this._sprite.anims.play("gunner-shoot", true);
        break;

      default:
        console.log("Unrecognized state", state);
        break;
    }
  }

  update() {
    this.gunCooldown = Math.max(this.gunCooldown - 1, 0);
    // Checks triggeting state transitions should happen here.
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
    if (this.state == GunnerState.Walking) {
      return (getDirection(center.x, target.x) == this.direction);
    }
    return true;
  }

  tryShoot(): boolean {
    if (this.gunCooldown == 0) {
      this.gunCooldown = GUNNER.gunCooldown;
      return true;
    }
    return false;
  }
}
