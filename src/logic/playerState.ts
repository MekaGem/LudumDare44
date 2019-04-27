// Stores player characteristics.
export class PlayerState {
  // Contains logic about cost of different operations, e.g. shooting.

  // Stores:
  // - Upgrades

  // - Current blood level
  private _blood: number;
  blood(): number {
    return this._blood;
  }

  constructor(starting_blood) {
    this._blood = starting_blood;
  }
}
