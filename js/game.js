function init () {
	var stage = new createjs.Stage('flapperBird');
	var sky = new createjs.Shape();
	sky.graphics.beginFill('#00bfff').drawRect(0,0,750,500);

	var ground = new createjs.Shape();
	ground.graphics.beginFill('#60c92b').drawRect(0,0,750, 50);
	ground.y = 450;

	var flapper = new createjs.Shape();
	flapper.graphics.beginFill('#89667c').drawCircle(0,0,20);
	flapper.x = 40;
	flapper.y = 240;

	stage.addChild(sky);
	stage.addChild(ground);
	stage.addChild(flapper);
	stage.update();

	var pipes = [],
			pipeCount = 0;
			speed = 10;

	// Add Pipes
	(function addPipes() {
		var int = helpers.randomize(300 * speed, 200 * speed);
		setTimeout(function () {
			pipes.push(addPipe());
			pipeCount++;
			addPipes();
		}, int);
	}());

	movePipes(stage, pipes, speed);

	gravitizeFlapper(stage, flapper, speed);

	window.onkeyup = function (e) {
		if (e.keyCode === 38) {
			moveFlapper(stage, flapper, -1, speed);
		} else if (e.keyCode === 40) {
			moveFlapper(stage, flapper, 1, speed);
		}
	}

}

function movePipes (stage, pipes, speed) {
	setTimeout(function () {
		for (var i = 0; i < pipes.length; i++) {
			var pipe = pipes[i];
			pipe.x -= 1;
			if (pipe.x < -100) {
				pipes.splice(i, 1);
			} else {
				stage.addChild(pipe);
			}
		}
		stage.update();
		movePipes(stage, pipes, speed);
	}, speed);
}

function addPipe() {
	var colors = [
				{fill: '#a8e6cf', stroke: '#8cc1ad'},
				{fill: '#dcedc1', stroke: '#a1ae8d'},
				{fill: '#ffd3b6', stroke: '#c3a18a'},
				{fill: '#ffaaa5', stroke: '#ba7b78'},
				{fill: '#ff8b94', stroke: '#c96b73'}
			],
			pipe = new createjs.Shape(),
			colorSelector = Math.round(helpers.randomize(5, 1)) - 1,
			color = colors[colorSelector],
			height = helpers.randomize(400, 200),
			y = helpers.randomize(500, height) - (height + 50);
	pipe.graphics.beginFill(color.fill).beginStroke(color.stroke).drawRect(0,0,100, height);
	pipe.y = y;
	pipe.x = 750;
	return pipe;
}

function gravitizeFlapper (stage, flapper, speed) {
	setTimeout(function () {
		if (flapper.y <= 425) {
			flapper.y++;
			stage.addChild(flapper);
			stage.update();
			gravitizeFlapper(stage, flapper, speed);
		}
	}, speed);
}

function moveFlapper (stage, flapper, direction, speed, counter) {
	if (!counter) {
		var counter = 0;
	}
	setTimeout(function () {
		if (counter < 100 && flapper.y > 0 && flapper.y < 425) {
			flapper.y = flapper.y + direction;
			stage.addChild(flapper);
			stage.update();
			counter++;
			moveFlapper(stage, flapper, direction, speed, counter);
		}
	}, speed / 10)
}

var helpers = {
	randomize: function (max, min) {
		return Math.random() * (max - min) + min;
	}
}