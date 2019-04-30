/// <reference path="../phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";
import { TitleScene } from "./scenes/titleScene";
import { EndGameScene } from "./scenes/endGameScene";
import { CONST } from "./const/const";

// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: [TitleScene, MainScene, EndGameScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: CONST.gravity },
      debug: false,
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
