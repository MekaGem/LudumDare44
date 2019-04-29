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
