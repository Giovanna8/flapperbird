
var pipeColors = [
	{fill: '#a8e6cf', stroke: '#8cc1ad'},
	{fill: '#dcedc1', stroke: '#a1ae8d'},
	{fill: '#ffd3b6', stroke: '#c3a18a'},
	{fill: '#ffaaa5', stroke: '#ba7b78'},
	{fill: '#ff8b94', stroke: '#c96b73'}
],
	pipes = [],
	gameStatus = {paused: false, stopped: false},
	stage;

function init() {
	stage = new createjs.Stage('flapperBird');
	var sky = new createjs.Shape();
	sky.graphics.beginFill('DeepSkyBlue').drawRect(0,0,750,500);

	var ground = new createjs.Shape();
	ground.graphics.beginFill('#60c92b').drawRect(0,0,750, 50);
	ground.y = 450;

	var bird = new createjs.Shape();
	bird.graphics.beginFill('#89667c').drawCircle(0,0,20);
	bird.x = 40;
	bird.y = 240;

	stage.addChild(sky);
	stage.addChild(ground);
	stage.addChild(bird);
	stage.update();

	// Generate Pipes
	throwPipe(stage);

	// Move Pipes
	movePipes(stage);
}

function throwPipe (stage) {
	var int = randomize(3000, 500);
	setTimeout(function () {
		drawPipe(stage);
		throwPipe(stage);	
	}, int);
}

function movePipes (stage) {
	if (!gameStatus.paused && !gameStatus.stopped) {
		var counter = 0;
		setTimeout(function () {
			for (var i = 0; i < pipes.length; i++) {
				var pipe = pipes[i];
				pipe.x = pipe.x - 1;
				if (pipe.x < -100) {
					pipes.splice(i, 1);
				} else {
					stage.addChild(pipe);
				}
			}
			stage.update();

			if (counter < 100000) {
				movePipes(stage);
			} 
			counter++;
		}, 10);
	}	
}

function drawPipe (stage) {
	var pipe = new createjs.Shape(),
		colorSelector = Math.round(randomize(5, 1)) - 1,
		color = pipeColors[colorSelector],
		height = randomize(400, 100),
		y = randomize(500, height) - (height + 50);
	pipe.graphics.beginFill(color.fill).beginStroke(color.stroke).drawRect(0,0,100, height);
	pipe.y = y;
	pipe.x = 650;
	pipes.push(pipe);
}

function pauseGame () {
	gameStatus.paused = true;
}

function playGame () {
	gameStatus.paused = false;
	movePipes(stage);
}

function randomize (max, min) {
	return Math.random() * (max - min) + min;
}