var roads = [115, 400, 638, 945, 1145, 1361, 128, 244, 436, 550, 715];

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
	this.count = 0;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
		this.count++;
        if (this.loop) 
			this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function Human(game, zomb, cop, human) {
    this.animationHuman = new Animation(ASSET_MANAGER.getAsset("./img/h.png"), 32, 32, 32, 1, 1, true, 1);
	this.animationZomb = new Animation(ASSET_MANAGER.getAsset("./img/z.png"), 32, 32, 32, 1, 1, true, 1);
	this.animationCop = new Animation(ASSET_MANAGER.getAsset("./img/c.png"), 32, 32, 32, 1, 1, true, 1);
	this.isZombie = zomb;
	this.isCop = cop;
	this.isHuman = human
	this.isDead = false;
    this.speed = 10;
    this.ctx = game.ctx;
	this.road = Math.floor(Math.random() * 12);
	var dir = (Math.random() * 2);
	if (dir <= 1) {
		this.myDir = -1;
	} else {
		this.myDir = 1;
	}
	if (this.road <= 5) {
		this.posX = roads[this.road];
		this.posY = Math.floor(Math.random() * 801);
	} else {
		this.posY = roads[this.road];
		this.posX = Math.floor(Math.random() * 1601);
	}

    Entity.call(this, game, this.posX, this.posY);
}

Human.prototype = new Entity();
Human.prototype.constructor = Human;

Human.prototype.collide = function (other) {
 //   return distance(this, other) < this.radius + other.radius;
	return (this.posX <= other.posX && (this.posX + 32) >= other.posX 
			&& this.posY <= other.posY && (this.posY + 32) >= other.posY)
			|| (other.posX <= this.posX && (other.posX + 32) >= this.posX 
			&& other.posY <= this.posY && (other.posY + 32) >= this.posY);
};

Human.prototype.update = function () {
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (!(this.isDead) && ent !== this && this.collide(ent)) {
			if (this.isZombie && ent.isHuman) {
				ent.isZombie = true;
			} else if (this.isCop && ent.isZombie) {
				ent.isDead = true;
			}
		}
	}
	var newRoadX = -10;
	var newRoadY = -10;
	var changeDir = 1;
	for (var j = 0; j <= 5; j++) {
		if (this.posX === roads[j]) {
			newRoadX = j;
			changeDir = changeDir * -1;
		}
	}
	for (; j <= roads.length; j++) {
		if (this.posY === roads[j]) {
			newRoadY = j;
			changeDir = changeDir * -1;
		}
	}
	if (changeDir > 0) {
		if (Math.random() * 2 <= 1) {
			this.road = newRoadX;
		} else {
			this.road = newRoadY;
		}
	}
	var dist = (Math.random() * 2);
	if (dist <= 1) {
		dist = -9999;
	} else {
		dist = 9999;
	}
	if (this.isZombie) {
		for (i = 0; i < this.game.entities.length; i++) {
			ent = this.game.entities[i];
			if ((ent.isHuman)) {
				let disX = this.posX - ent.posX;
				if (disX > 800) {
					disX = disX - 1600;
				} else if (disX < -800) {
					disX = 1600 + disX;
				}
				let disY = this.posY - ent.posY;
				if (disY > 400) {
					disY = disY - 800;
				} else if (disY < -400) {
					disY = 800 + disY;
				}
				if (newRoadX >= 0 && ent.posX === this.posX && Math.abs(disY) < Math.abs(dist)) {
					dist = disY * -1;
					this.road = newRoadX;
					changeDir = 1;
				} else if (newRoadY >= 0 && ent.posY === this.posY && Math.abs(disX) < Math.abs(dist)) {
					dist = disX * -1;
					this.road = newRoadY;
					changeDir = 1;
				}
			}
		}
		
	}
	if (this.isCop) {
		for (i = 0; i < this.game.entities.length; i++) {
			ent = this.game.entities[i];
			if ((ent.isZombie)) {
				let disX = this.posX - ent.posX;
				if (disX > 800) {
					disX = disX - 1600;
				} else if (disX < -800) {
					disX = 1600 + disX;
				}
				let disY = this.posY - ent.posY;
				if (disY > 400) {
					disY = disY - 800;
				} else if (disY < -400) {
					disY = 800 + disY;
				}
				if (newRoadX >= 0 && ent.posX === this.posX && Math.abs(disY) < Math.abs(dist)) {
					dist = disY * -1;
					this.road = newRoadX;
					changeDir = 1;
				} else if (newRoadY >= 0 && ent.posY === this.posY && Math.abs(disX) < Math.abs(dist)) {
					dist = disX * -1;
					this.road = newRoadY;
					changeDir = 1;
				}
			}
		}
		
	}
	if (this.isHuman) {
		for (i = 0; i < this.game.entities.length; i++) {
			ent = this.game.entities[i];
			if ((ent.isZombie)) {
				let disX = this.posX - ent.posX;
				if (disX > 800) {
					disX = disX - 1600;
				} else if (disX < -800) {
					disX = 1600 + disX;
				}
				let disY = this.posY - ent.posY;
				if (disY > 400) {
					disY = disY - 800;
				} else if (disY < -400) {
					disY = 800 + disY;
				}
				if (newRoadX >= 0 && ent.posX === this.posX && Math.abs(disY) < Math.abs(dist)) {
					dist = disY;
					this.road = newRoadX;
					changeDir = 1;
				} else if (newRoadY >= 0 && ent.posY === this.posY && Math.abs(disX) < Math.abs(dist)) {
					dist = disX;
					this.road = newRoadY;
					changeDir = 1;
				}
			}
		}
		
	}
	if (changeDir > 0) {
		this.myDir = dist / Math.abs(dist);
	}
	//for (var i = 0; i < this.game.entities.length; i++) {
       // var ent = this.game.entities[i];
	if (this.road <= 5) {
		this.posY += this.myDir;
	} else {
		this.posX += this.myDir;
	}
	if (this.posX >= 1600) {
		this.posX = 1;
	}
	if (this.posY >= 800) {
		this.posY = 1;
	}
	if (this.posX <= 0) {
		this.posX = 1600;
	}
	if (this.posY <= 0) {
		this.posY = 800;
	}
}
Human.prototype.draw = function () {
	if (!(this.isDead)) {
		if (this.isCop) {
			this.animationCop.drawFrame(this.game.clockTick, this.ctx, this.posX, this.posY);
		} else if (this.isZombie) {
			this.animationZomb.drawFrame(this.game.clockTick, this.ctx, this.posX, this.posY);
		} else if (this.isHuman) {
			this.animationHuman.drawFrame(this.game.clockTick, this.ctx, this.posX, this.posY);
		}
		Entity.prototype.draw.call(this);
	}
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/map.png");
ASSET_MANAGER.queueDownload("./img/h.png");
ASSET_MANAGER.queueDownload("./img/z.png");
ASSET_MANAGER.queueDownload("./img/c.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
	gameEngine.init(ctx);
    gameEngine.start();
	gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/map.png")));
	for(var i = 0; i < 16; i++) {
		var human = new Human(gameEngine, false, false, true);
		gameEngine.addEntity(human);
	}
	for(var i = 0; i < 4; i++) {
		var zomb = new Human(gameEngine, true, false, false);
		gameEngine.addEntity(zomb);
	}
	var cop = new Human(gameEngine, false, true, false);
	gameEngine.addEntity(cop);
});
