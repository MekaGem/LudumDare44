export function init() {
    console.log('kek');

    let stage = new createjs.Stage("gameCanvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("Cyan").drawCircle(0, 100, 100);
    circle.x = 0;
    circle.y = 300;
    stage.addChild(circle);

    var circle2 = new createjs.Shape();
    circle2.graphics.beginFill("Cyan").drawCircle(0, 100, 100);
    stage.addChild(circle2);

    var circle3 = new createjs.Shape();
    circle3.graphics.beginFill("Cyan").drawCircle(0, 100, 100);
    stage.addChild(circle3);

    createjs.Ticker.framerate = 120;

    function update(event: any) {
        console.log(event.delta);
        circle.x += event.delta as number * 1;
        let canvas = stage.canvas as HTMLCanvasElement;
        console.log(canvas.width);
        if (circle.x > canvas.width + 100) {
            circle.x -= canvas.width / 2;
        }

        circle2.x = circle.x - canvas.width / 2;
        circle2.y = circle.y;

        circle3.x = circle.x - canvas.width;
        circle3.y = circle.y;

        stage.update();
    }

    createjs.Ticker.addEventListener('tick', update);
}
