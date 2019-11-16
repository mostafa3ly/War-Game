var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var container = document.getElementById("container")

var c = decodeURIComponent(window.location.search).substr(3,5);
var character = c!='' ? c : 'plane';
 
var player = new Image();
var enemy = new Image();
var bullet = new Image();
var heart = new Image();
var fuel = new Image();

player.src = `../images/${character}.png`;
enemy.src = "../images/enemyplane.png";
bullet.src = "../images/fire.png";
heart.src = "../images/heart.png";
fuel.src = "../images/fuel.png";

var gameAudio = new Audio('../sounds/war.mp3');


var fuelX;
var fuelY;
var xCoo;
var yCoo;

var live = 3;
var stamina = 100;
var enemiesLive = 3;
var score = 0;
var night = 0;
var bulletGenerateTime = 1500;
var enemyGenerateTime = 4000;


var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var supplyFuel = false;
var alive = true;
var isNight = false;
var isDay = true;
var masterMode = false;


var playerY = character == 'tank' ? 542 : canvas.height / 2;
var playerX = 100;

var liveBullets = [];
var enemiesBullets = [];
var enemies = [];

var enemyGenerateInterval;
var enemiesBulletsGenerateInterval;
var staminaDrainInterval;
var nightInterval;


document.addEventListener("keydown", keyDownHandler);

function keyDownHandler(e) {

	if (e.keyCode == 65) {
		leftPressed = true;
	}
	if (e.keyCode == 68) {
		rightPressed = true;
	}
	if (e.keyCode == 83) {
		downPressed = true;
	}
	if (e.keyCode == 87) {
		upPressed = true;
	}
}


document.addEventListener("keyup", keyUpHandler);

function keyUpHandler(e) {

	if (e.keyCode == 65) {
		leftPressed = false;
	}
	if (e.keyCode == 68) {
		rightPressed = false;
	}
	if (e.keyCode == 83) {
		downPressed = false;
	}
	if (e.keyCode == 87) {
		upPressed = false;
	}
}


function moveLeft() {

	if (playerX > 0) {
		playerX -= 6;
	}
}

function moveRight() {
	if (playerX < canvas.width - player.width) {
		playerX += 8;
	}
}
function moveUp() {
	if (playerY > 0 && character != 'tank') {
		playerY -= 7;
	}
}

function moveDown() {
	if (playerY < canvas.height / 2 && character != 'tank') {
		playerY += 7;
	}
}

enemies[0] = {
	x: canvas.width,
	y: 0,
	live: enemiesLive,
	shoot: 0,
	type: 'plane'
};


function reLoad(event) {
if(event.code=="Space"){
	location.reload();
}
}
 function playAudio()
 {
	gameAudio.play();
 }

function draw() {
	playAudio()
	
	context.clearRect(0, 0, canvas.width, canvas.height)

	if (leftPressed === true) {
		moveLeft();
	}
	if (rightPressed === true) {
		moveRight();
	}
	if (upPressed === true) {
		moveUp();
	}
	if (downPressed === true) {
		moveDown();
	}


	//levels enhancing  start
	if (!masterMode) {

		if (score >= 3000 && enemiesLive != 4) {
			enemiesLive = 4;
		}
		else if (score >= 5000 && enemiesLive != 5) {
			enemiesLive = 5
		}

		if (score >= 7000 && bulletGenerateTime == 1500) {
			bulletGenerateTime = 1000;
			clearInterval(enemiesBulletsGenerateInterval);
			makeEnemyBulletsGenerateInterval();
		}
		else if (score >= 9000 && bulletGenerateTime == 1000) {
			bulletGenerateTime = 500;
			clearInterval(enemiesBulletsGenerateInterval);
			makeEnemyBulletsGenerateInterval();
		}

		if (score >= 11000 && enemyGenerateTime == 4000) {
			enemyGenerateTime = 3500;
			clearInterval(enemyGenerateInterval);
			makeEnemyGenerateInterval();
		}
		else if (score >= 13000 && enemyGenerateTime == 3500) {
			enemyGenerateTime = 2500;
			clearInterval(enemyGenerateInterval);
			makeEnemyGenerateInterval();
		}
		else if (score >= 15000 && enemyGenerateTime == 2500) {
			enemyGenerateTime = 1500;
			clearInterval(enemyGenerateInterval);
			makeEnemyGenerateInterval();
			masterMode = true;
		}
	}
	//levels enhancing  end

	for (var i = 0; i < enemies.length; i++) {

		if (enemies[i].x < 0 - enemy.width) {
			enemies.splice(i, 1);
			score -= 50;
			if (score <= 0) {
				score = 0;
				live--;
			}
		}




		for (j = 1; j <= enemies[i].live; j++) {
			context.fillStyle = "#0a0";
			context.fillRect(enemies[i].x + 60 + 15 * j, enemies[i].y + enemy.height + 2, 12, 3);
		}
		enemy.src = `../images/enemy${enemies[i].type}.png`;
		context.drawImage(enemy, enemies[i].x, enemies[i].y);
		enemies[i].x -= 4;
		if(supplyFuel){

		

		if (((playerX + player.width > fuelX && playerX + player.width <= fuelX + fuel.width) 
		|| (fuelX +fuel.width >playerX && fuelX + fuel.width <= playerX + player.width))  
		&& ((playerY + player.height > fuelY && playerY + player.height <= fuelY + fuel.height) 
		|| (fuelY + fuel.height > playerY && fuelY + fuel.height <= playerY + player.height))) {
			stamina = 100;
			supplyFuel = false;
		}
		}

		if (playerX + player.width >= enemies[i].x + 50 && playerX <= enemies[i].x + enemy.width &&
			(playerY <= enemies[i].y + enemy.height - 20 && playerY + player.height >= enemies[i].y + 20)) {
			enemies.splice(i, 1);
			playerX = 200;
			playerY = character == 'plane' ? Math.floor(Math.random() * canvas.height / 2) : 542;
			live--;
			stamina = 100;

		}
	}


	if (supplyFuel) {
		context.drawImage(fuel, fuelX, fuelY);
	}


	context.fillStyle = "#0a0";
	context.fillRect(character == 'plane' ? playerX + player.width / 2 - 50 : playerX + 50,
		character == 'plane' ? playerY + player.height + 2 : playerY, stamina, 3);

	context.fillStyle = "#a00";
	context.fillRect(character == 'plane' ? playerX + player.width / 2 - 50 + stamina : playerX + 50 + stamina,
		character == 'plane' ? playerY + player.height + 2 : playerY, 100 - stamina, 3)



	for (i = 0; i < enemiesBullets.length; i++) {
		enemiesBullets[i].draw(true);
		enemiesBullets[i].moveBullet();
		if (enemiesBullets[i].wallCollision(enemiesBullets[i]) === true) {
			enemiesBullets.splice(i, 1);
		}

		if (playerHit(enemiesBullets[i])) {
			enemiesBullets.splice(i, 1);
		}
	}

	for (i = 0; i < liveBullets.length; i++) {
		liveBullets[i].draw(false);
		liveBullets[i].moveBullet();
		if (liveBullets[i].wallCollision(liveBullets[i]) === true) {
			liveBullets.splice(i, 1);
		}
		if (enemyHit(liveBullets[i])) {
			liveBullets.splice(i, 1);
		}


	}



	context.drawImage(player, playerX, playerY);
	context.fillStyle = "background-color:transparent";




	if (isNight) {
		if (isDay) {
			night -= 0.0002;
		}
		else {
			night += 0.0002;
			if (night >= 0.98)
				isDay = true;
		}

		context.fillStyle = `rgba(0, 0, 0, ${night})`;
		context.fillRect(0, 0, canvas.width, canvas.height);
		if (night <= 0) {
			isNight = false;
			makeNightInterval();
		}
	}



	for (i = 0; i < live; i++) {
		context.drawImage(heart, 1350 + (i * 35), 20);
	}


	context.font = "20px tahoma";
	context.fillStyle = "#d02";
	context.fillText("Score : " + score, 40, 40);


	if (live == 0) {
		alive = false;
	}

	function onPause() {
		if (!alive) {
	context.font = "60px cursive";
	context.fillStyle = "#111";
	context.fillText("Game Over", canvas.width/2.5, canvas.height/3);
	context.fillText("Score : "+ score, canvas.width/2.5, canvas.height/2.3);
	context.fillText("Press space key to play again", canvas.width/4, canvas.height/1.9);
			document.addEventListener("keydown", reLoad);
		} else {
			requestAnimationFrame(draw);
		}
	}
	onPause();

}

draw();



function playerHit(bullet) {
	if (bullet) {
		if (bullet.x >= playerX + 20 && bullet.x < playerX + player.width - 10
			&& bullet.y >= playerY + 10 && bullet.y < playerY + player.height - 10) {
			stamina -= 10;
			if (stamina <= 0) {
				live--;
				stamina = 100;
			}
			return true;
		}
	}
}


function enemyHit(bullet) {
	if (bullet) {
		for (i = 0; i < enemies.length; i++) {

			if (bullet.x >= enemies[i].x + 20 && bullet.x < enemies[i].x + enemy.width - 10
				&& bullet.y >= enemies[i].y + 10 && bullet.y < enemies[i].y + enemy.height - 10) {
				if (enemies[i].live <= 1) {
					enemies.splice(i, 1);
					score += 50;
				}
				else {
					enemies[i].live--;
					score += 10;
				}
				return true;
			}
		}

	}
}


//score interval
setInterval(() => {
	if (alive) {
		score += 1;
	}
}, 100);

function Bullet() {
	this.x;
	this.y;
	this.xDelta = 0;
	this.yDelta = 0;

	this.xTarget;
	this.yTarget;
	this.draw = function (isEnemy) {
			bullet.src = isEnemy ?  "../images/enemyfire.png"  : "../images/fire.png" ;
		context.drawImage(bullet, this.x, this.y);
	};
}

Bullet.prototype.setCoordinates = function (x, y, xTarget, yTarget) {
	this.x = x;
	this.y = y;
	this.xTarget = xTarget;
	this.yTarget = yTarget;
}


Bullet.prototype.setDeltas = function () {
	var diffY = this.y - this.yTarget;
	var diffX = this.x - this.xTarget;
	var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
	this.xDelta = (14 * diffX) / distance;
	this.yDelta = (14 * diffY) / distance;
};

Bullet.prototype.moveBullet = function () {
	this.x -= this.xDelta;
	this.y -= this.yDelta;
};

Bullet.prototype.wallCollision = function (bullet) {
	if (bullet.x > canvas.width || bullet.x < 0) {
		return true;
	}
	if (bullet.y > canvas.height || bullet.y < 0) {
		return true;
	}
	else return false;
};




function fireBullet() {
	var newBullet = new Bullet();
	newBullet.setCoordinates(playerX + 100, playerY + 50, xCoo - container.offsetLeft - 10, yCoo - container.offsetTop-10)
	newBullet.setDeltas();
	liveBullets.push(newBullet);
};

canvas.addEventListener('click', function (event) {
	xCoo = event.clientX;
	yCoo = event.clientY;
	fireBullet();
}, false);

function makeEnemyGenerateInterval() {
	enemyGenerateInterval = setInterval(() => {
		enemies.push({
			x: canvas.width,
			y: Math.floor(Math.random() * 400),
			live: enemiesLive,
			shoot: 0,
			type: 'plane'
		});
	}, enemyGenerateTime);
}

function makeEnemyBulletsGenerateInterval() {
	enemiesBulletsGenerateInterval = setInterval(() => {
		for (i = 0; i < enemies.length; i++) {
			if (enemies[i].shoot == 0) {
				enemies[i].shoot = 3;
				var enemyBullet = new Bullet();
				enemyBullet.setCoordinates(enemies[i].x + 50, enemies[i].y + 50,
					playerX + Math.random() * player.width + 50,
					playerY + Math.random() * player.height + 50);

				enemyBullet.setDeltas();
				enemiesBullets.push(enemyBullet);
			}
			else {
				enemies[i].shoot--;
			}
		}
	}, bulletGenerateTime);
}


//stamina drain interval
staminaDrainInterval = setInterval(() => {
	stamina -= 1;
	if (stamina == 0) {
		live--;
		stamina = 100;
	}

}, 1000);


//fuel supply interval
setInterval(() => {
	fuelX = (Math.random() * 1450);
	fuelY = character == 'tank' ? 575 : Math.random() * 400 ;
	supplyFuel = true;
	setTimeout(function () {

		supplyFuel = false;

	}, 5000);

}, 25000);

//night effect interval
function makeNightInterval() {
	nightInterval = setInterval(() => {
		isNight = true;
		isDay = false;
		clearInterval(nightInterval);
	}, 30000);
}
makeNightInterval();
makeEnemyGenerateInterval();
makeEnemyBulletsGenerateInterval();