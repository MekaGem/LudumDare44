// Stores global game constants.
// This includes
// - Object dimensions
// - Player default characteristics

//
// ======= General =======
//
export let CONST = {
  fontSize: "32px",
  backgroundColor: "black",
  gravity: 1000,
  tileSize: 64,
  inf: 1e9,
}

//
// ======= Bullets =======
//
export let BULLET = {
  blood: {
    speed: 600,
    size: CONST.tileSize / 2,
    spritePack: "blood_drop",
    spriteName: "blood_drop.png",
  },
  gun: {
    speed: 1000,
    size: CONST.tileSize / 2,
    spritePack: "bullet",
    spriteName: "bullet.png",
  },
}

//
// ======= Player =======
//
export let PLAYER = {
  // Characteristics.
  startingBlood: 50,
  maxBlood: 100,
  regenerationSpeed: 10,
  // Physics.
  maxWSpeed: 400,
  maxHSpeed: 550,
  drag: 2000,
  groundAcceleration: 1000,
  hSpeed: 550,  // Influences jumpiness.
  // Graphics.
  width: 0.85 * CONST.tileSize,
  height: 1.7 * CONST.tileSize,
  // Attack
  meleeAttackDuration: 200,
  meleeAttackDistance: 2.0 * CONST.tileSize,

  shotBloodCost: 10,

  regenerateDistance: 30,
}

export let PLAYER_HUD = {
  healthBarOffsetX: 10,
  healthBarOffsetY: 10,

  healthBarWidth: 200,
  healthBarHeight: 100,

  bloodTextStyle: {
    fontSize: CONST.fontSize,
    color: "red",
  }
}

//
// ======= Gunner =======
//
export let GUNNER = {
  // Characteristics.
  //
  // Physics.
  movingSpeed: 100,
  // Graphics.
  width: CONST.inf,
  height: 1.8 * CONST.tileSize,

  gunCooldown: 60,

  visionDistance: 300,

  shootDelay: 200,  // milliseconds.

  deathDuration: 5000,  // milliseconds.

  attackDamage: 10,  // in blood.
}

//
// ======= Bonuses =======
//
export let BONUS = {
  bloodBonusAmount: 10,
}

//
// ======= Events =======
//
export let EVENT = {
  bloodChanged: "bloodChanged",
  playerDied: "playerDied",
  scoreChanged: "scoreChanged",
}
