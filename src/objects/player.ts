import { PlayerState } from "../logic/playerState";
import { PLAYER } from "../const/const";
import { Direction } from "../logic/direction";
import { boxedSize } from "../utils/scaling";

// Stores graphical and physical representation of Player.
// Knows how to draw itself.
// Has a physical body to collide with enemies.
export class Player extends Phaser.GameObjects.Container {
  // Fix imprecise phaser.d.ts interface.
  body!: Phaser.Physics.Arcade.Body

  private playerState: PlayerState;
  private _sprite: Phaser.GameObjects.Sprite;
  private _direction: Direction;

  private _keys: any;

  constructor(scene: Phaser.Scene, x: number, y: number, playerState: PlayerState) {
    super(scene, x, y);

    this.playerState = playerState;

    this._sprite = scene.add.sprite(0, 0, "player", "move1.png");
    var box = boxedSize(this._sprite.width, this._sprite.height, PLAYER.width, PLAYER.height);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);

    scene.physics.world.enable(this);
    this.body
      .setDrag(PLAYER.drag, 0)
      .setMaxVelocity(PLAYER.maxWSpeed, PLAYER.maxHSpeed);

    scene.add.existing(this);

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this._keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D
    });

    const anims = scene.anims;
    var frameNames = anims.generateFrameNames("player", {
                         start: 1, end: 3, zeroPad: 0,
                         prefix: "move", suffix: ".png"
                     });
    scene.anims.create({ key: "player-run", frames: frameNames, frameRate: 6, repeat: -1 });
  }

  update() {
    var onGround = this.body.onFloor();
    var acceleration = onGround ? PLAYER.groundAcceleration : PLAYER.airAcceleration;

    if (this._keys.right.isDown || this._keys.d.isDown) {
      this.body.setAccelerationX(acceleration);
      this.direction = Direction.Right;
    } else if (this._keys.left.isDown || this._keys.a.isDown) {
      this.body.setAccelerationX(-acceleration);
      this.direction = Direction.Left;
    } else {
      this.body.setAccelerationX(0);
    }

    if (onGround && (this._keys.up.isDown || this._keys.w.isDown)) {
      this.body.setVelocityY(-PLAYER.hSpeed);
    }

    // Update animation based on the player state.
    if (onGround) {
      if (this.body.velocity.x !== 0) {
        this._sprite.anims.play("player-run", true);
      } else {
        this._sprite.anims.stop();
      }
    }

    super.update();
  }

  highlight(active) {
    if (active) {
      this._sprite.setTint(0xff0000);
    } else {
      this._sprite.setTint(0x00ff00);
    }
  }

  get direction(): Direction {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._sprite.setFlipX(direction == Direction.Left);
    this._direction = direction;
  }
}
