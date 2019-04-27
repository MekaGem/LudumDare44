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
  speed: 600,
  size: 16,
  bloodSprite: "blood_drop",
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
