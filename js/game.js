var gameStatus = 'active';

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

	startGame(stage, flapper, pipes, pipeCount, speed);

}

function startGame (stage, flapper, pipes, pipeCount, speed) {
	var levels = [3, 51, 101, 201, 501];

	(function addPipes() {
		if (gameStatus == 'active') {
			var int = helpers.randomize(300 * speed, 200 * speed);
			setTimeout(function () {
				pipes.push(addPipe());
				pipeCount++;
				if (levels.indexOf(pipeCount) > -1) {
					levelUp(stage, flapper, pipes, pipeCount, speed, levels.indexOf(pipeCount) + 2);
				}
				addPipes();
			}, int);
		}
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
	if (gameStatus == 'active') {
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
			height = helpers.randomize(350, 100),
			y = helpers.randomize(500, height) - (height + 50);
	pipe.graphics.beginFill(color.fill).beginStroke(color.stroke).drawRect(0,0,100, height);
	pipe.y = y;
	pipe.x = 750;
	return pipe;
}

function gravitizeFlapper (stage, flapper, speed) {
	if (gameStatus == 'active') {
		setTimeout(function () {
			if (flapper.y <= 425) {
				flapper.y++;
				stage.addChild(flapper);
				stage.update();
				gravitizeFlapper(stage, flapper, speed);
			}
		}, speed);
	}
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
	}, speed / 10);
}

function levelUp (stage, flapper, pipes, pipeCount, speed, level) {
	helpers.pause();
	setTimeout(function () {
		var alertBox = new createjs.Shape();
		alertBox.graphics.beginFill('rgba(0,0,0,.75)').drawRect(187.5,125,375,250);
		var alert = new createjs.Text('Level ' + level +'!', '30px Josefin Sans', '#ffffff');
		alert.x = helpers.centerText(375, alert, 187.5);
		alert.y = 150;
		var play = new createjs.Text('Play', '20px Josefin Sans', '#ffffff');
		play.x = helpers.centerText(375, play, 187.5);
		play.y = 250;
		play.addEventListener('click', function(btn) {
			helpers.continue(stage, flapper, pipes, pipeCount, speed, alertBox, alert, play);
		});
		stage.addChild(alertBox);
		stage.addChild(alert);
		stage.addChild(play);
		stage.update();
	}, speed);
}

var helpers = {
	randomize: function (max, min) {
		return Math.random() * (max - min) + min;
	},
	centerText: function (containerWidth, text, offset) {
		if (!offset) {
			offset = 0;
		}
		return ((containerWidth - text.getMeasuredWidth()) / 2) + offset;
	},
	pause: function () {
		gameStatus = 'paused';
	},
	continue: function (stage, flapper, pipes, pipeCount, speed, alertBox, alert, play) {
		gameStatus = 'active';
		stage.removeChild(alertBox);
		stage.removeChild(alert);
		stage.removeChild(play);
		console.log(stage);
		startGame(stage, flapper, pipes, pipeCount, speed);
	}
}