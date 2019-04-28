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
    size: 16,
    spritePack: "blood_drop",
    spriteName: "blood_drop.png",
  },
  gun: {
    speed: 1000,
    size: 16,
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
  regenerationSpeed: 120,
  // Physics.
  maxWSpeed: 300,
  drag: 1000,
  groundAcceleration: 600,
  airAcceleration: 200,
  maxHSpeed: 550,
  hSpeed: 550,  // Influences jumpiness.
  // Graphics.
  width: 0.9 * CONST.tileSize,
  height: 1.8 * CONST.tileSize,
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
  width: 0.9 * CONST.tileSize,
  height: 1.8 * CONST.tileSize,

  gunCooldown: 60,
}
