// Stores global game constants.
// This includes
// - Object dimensions
// - Player default characteristics

//
// ======= General =======
//
export let CONST = {
  FONT_SIZE: "32px",
  BACKGROUND_COLOR: "#ccccff",
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
  STARTING_BLOOD: 10,
}

export let PLAYER_PHYSICS = {
  wSpeed: 200,
  hSpeed: 700,
}

export let PLAYER_GRAPHICS = {
  HEIGHT: 50,
}

export let PLAYER_HUD = {
  BLOOD_TEXT_STYLE: {
    fontSize: CONST.FONT_SIZE,
    color: "#000000",  // Black.
  }
}
