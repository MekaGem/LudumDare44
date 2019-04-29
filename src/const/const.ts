// Stores global game constants.
// This includes
// - Object dimensions
// - Player default characteristics

//
// ======= General =======
//
export let CONST = {
  fontSize: "32px",
  backgroundColor: "#ccccff",
  gravity: 1000,
  tileSize: 32,
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
    spritePack: "gunner",
    spriteName: "gunner-5.png",
  },
}

//
// ======= Player =======
//
export let PLAYER = {
  // Characteristics.
  startingBlood: 10,
  maxBlood: 20,
  regenerationSpeed: 120,
  // Physics.
  maxWSpeed: 400,
  maxHSpeed: 550,
  drag: 2000,
  groundAcceleration: 1000,
  hSpeed: 550,  // Influences jumpiness.
  // Graphics.
  width: 0.85 * CONST.tileSize,
  height: 1.7 * CONST.tileSize,
}

export let PLAYER_HUD = {
  healthBarOffsetX: 10,
  healthBarOffsetY: 10,

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
}

//
// ======= Events =======
//
export let EVENT = {
  bloodChanged: "bloodChanged",
}
