export function boxedSize(width: number, height: number,
                          boxWidth: number, boxHeight: number): Phaser.Structs.Size {
  var box = new Phaser.Structs.Size(width, height, Phaser.Structs.Size.FIT);
  box.fitTo(boxWidth, boxHeight);
  return box;
}
