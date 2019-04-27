// Stores player characteristics.
export class PlayerState {
  // Contains logic about cost of different operations, e.g. shooting.

  // Stores:
  // - Upgrades

  // - Current blood level
  private _blood: number;
  get blood(): number {
    return this._blood;
  }

  constructor(starting_blood) {
    this._blood = starting_blood;
  }
}