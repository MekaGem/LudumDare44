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
