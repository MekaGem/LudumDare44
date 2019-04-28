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
  width: 100,
  height: 100,
}

export let PLAYER_HUD = {
  healthBarOffsetX: 30,
  healthBarOffsetY: 30,

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
  width: 50,
  height: 50,

  gunCooldown: 60,
}
