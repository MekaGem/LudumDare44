import { PLAYER } from "../const/const";

// Stores player characteristics.
export class PlayerState extends Phaser.Events.EventEmitter {
  // Contains logic about cost of different operations, e.g. shooting.

  // Stores:
  // - Upgrades
  private regeneration: number = PLAYER.regenerationSpeed;

  // - Current blood level
  private _blood: number;
  get blood(): number {
    return this._blood;
  }

  constructor(starting_blood) {
    super()
    this._blood = starting_blood;
  }

  damage(amount: number) {
    this._blood = Math.min(this._blood - amount, PLAYER.startingBlood);
    this.emit('damage', amount);
  }

  regenerate() {
    if (this._blood == PLAYER.startingBlood) return;
    this.regeneration = Math.max(this.regeneration - 1, 0);
    if (this.regeneration == 0) {
      this.regeneration = PLAYER.regenerationSpeed;
      this.damage(-1);
      console.log("BLOOD++");
    }
  }
}
