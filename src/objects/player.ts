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
  private _attacking: boolean = false;
  private _attackSprite: Phaser.GameObjects.Sprite;

  private _keys: any;

  constructor(scene: Phaser.Scene, x: number, y: number, playerState: PlayerState, direction: Direction) {
    super(scene, x, y);

    this.playerState = playerState;

    this._sprite = scene.add.sprite(0, 0, "player", "Vampire1.PNG");
    //this._sprite = scene.add.sprite(0, 0, "bloodnight_tiles", "tiles/wall.png");
    var box = boxedSize(this._sprite.width, this._sprite.height, PLAYER.width, PLAYER.height);
    this._sprite.setDisplaySize(box.width, box.height);
    this.setSize(box.width, box.height);
    this.add(this._sprite);
    // Requires the sprite to be initialized.
    this.direction = direction;

    scene.physics.world.enable(this);
    this.body
      .setDrag(PLAYER.drag, 0)
      .setMaxVelocity(PLAYER.maxWSpeed, PLAYER.maxHSpeed);

    scene.add.existing(this);

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, DOWN, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this._keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      d: D
    });

    const anims = scene.anims;
    var frameNames = anims.generateFrameNames("player", {
                         start: 1, end: 3, zeroPad: 0,
                         prefix: "Vampire", suffix: ".PNG"
                     });
    scene.anims.create({ key: "player-run", frames: frameNames, frameRate: 6, repeat: -1 });
  }

  update() {
    var onGround = this.body.onFloor();
    var acceleration = PLAYER.groundAcceleration;

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

    if (this._attacking) {
      this.body.stop();
    }

    super.update();
  }

  // Freezes the player and stops all animations.
  freeze() {
    this.body.moves = false;
    this._sprite.anims.stop();
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
    if (this._attacking) return;
    this._sprite.setFlipX(direction == Direction.Left);
    this._direction = direction;
  }

  get attacking(): boolean {
    return this._attacking;
  }

  set attacking(attacking: boolean) {
    if (attacking && !this._attacking) {
      this.body.setAllowGravity(false);

      let width = PLAYER.meleeAttackDistance;
      let height = PLAYER.height * 0.25;

      var x = this.body.center.x;
      if (this._direction == Direction.Left) {
        x -= width;
      }
      this._attackSprite = this.scene.add.sprite(x, this.body.center.y - height / 2, "1x1white");

      this._attackSprite.setOrigin(0.0, 0.0);
      this._attackSprite.setTint(0xff0000);
      this._attackSprite.setDisplaySize(width, height);
      this._attackSprite.setSize(width, height);
    } else if (!attacking && this._attacking) {
      this.body.setAllowGravity(true);
      this._attackSprite.destroy();
    }
    this._attacking = attacking;
  }
}
