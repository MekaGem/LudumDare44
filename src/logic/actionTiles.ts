export function getActionFromTile(tile): string {
  if (tile && ("npc_action" in tile.properties)) {
    var action = tile.properties["npc_action"];
    if (action != "") {
      return action;
    }
  }
  return "none";
}

export function getTileProperty(tile: Phaser.Tilemaps.Tile, name: string) {
  if (tile && (name in tile.properties)) {
    return tile.properties[name];
  }
  return null;
}
