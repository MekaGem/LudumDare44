export enum Direction {
    Left,
    Right,
}

export function getDX(direction: Direction): number {
    if (direction == Direction.Left) {
        return -1;
    } else if (direction == Direction.Right) {
        return 1;
    }
}

// Returns a direction in which source must move to reach destination.
export function getDirection(sourceX: number, destinationX: number): Direction {
  if (sourceX > destinationX) {
    return Direction.Left;
  } else {
    return Direction.Right;
  }
}

export function directionFromSpawn(spawn: any): Direction {
  if (spawn.properties) {
    for (var property of spawn.properties) {
      if (property.name == "direction") {
        var d = property.value;
        if (d == "left") {
          return Direction.Left;
        } else if (d == "right") {
          return Direction.Right;
        }
      }
    }
  }

  console.log("Failed to find direction in", spawn);
  return Direction.Right;
}
