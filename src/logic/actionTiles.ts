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
  if (tile && tile.properties && (name in tile.properties)) {
    return tile.properties[name];
  }
  return null;
}

export function setTileProperty(tile: Phaser.Tilemaps.Tile, name: string, value: any) {
  if (tile && tile.properties && (name in tile.properties)) {
    return tile.properties[name] = value;
  }
}
