// Stores player characteristics.
export class PlayerState extends Phaser.Events.EventEmitter {
  // Contains logic about cost of different operations, e.g. shooting.

  // Stores:
  // - Upgrades

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
    this._blood -= amount;
    this.emit('damage', amount);
  }
}
