import { PLAYER, EVENT } from "../const/const";

// Stores player characteristics.
export class PlayerState extends Phaser.Events.EventEmitter {
  // Contains logic about cost of different operations, e.g. shooting.

  // Stores:
  // - Upgrades
  private regeneration: number = PLAYER.regenerationSpeed;
  private _alive: boolean;
  get alive(): boolean {
    return this._alive;
  }

  // - Current blood level
  private _blood: number;
  get blood(): number {
    return this._blood;
  }

  constructor(starting_blood) {
    super()
    this._alive = true;
    this.blood = starting_blood;
  }

  set blood(blood: number) {
    blood = Math.min(blood, PLAYER.maxBlood);
    var delta = blood - this._blood;
    this._blood = blood;
    this.emit(EVENT.bloodChanged, delta);

    if (this._blood == 0) {
      this.die();
    }
  }

  die() {
    console.log("Oh no! Player died!");
    this._alive = false;
    this.emit(EVENT.playerDied);
  }

  regenerate() {
    if (!this._alive) {
      return;
    }

    if (this._blood == PLAYER.startingBlood) return;
    this.regeneration = Math.max(this.regeneration - 1, 0);
    if (this.regeneration == 0) {
      this.regeneration = PLAYER.regenerationSpeed;
      this.blood += 1;
      console.log("BLOOD++");
    }
  }
}
