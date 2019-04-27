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
  gravity: 1500,
}

//
// ======= Bullets =======
//
export let BULLET = {
  BLOOD: {
    speed: 600,
    size: 16,
    spritePack: "blood_drop",
    spriteName: "blood_drop.png",
  },
  GUN: {
    speed: 1000,
    size: 16,
    spritePack: "gunner",
    spriteName: "gunner-5.png",
  },
}

//
// ======= Player =======
//
export let PLAYER_INFO = {
  startingBlood: 10,
}

export let PLAYER_PHYSICS = {
  wSpeed: 200,
  hSpeed: 700,
}

export let PLAYER_GRAPHICS = {
  height: 50,
}

export let PLAYER_HUD = {
  bloodTextStyle: {
    fontSize: CONST.fontSize,
    color: "#000000",  // Black.
  }
}

export let GUNNER_INFO = {
  MOVING_SPEED: 100,
}
