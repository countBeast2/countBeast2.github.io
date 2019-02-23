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
/*function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 3;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 1600;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                this.setNotIt();
                ent.setIt();
            }
            else if (ent.it) {
                this.setIt();
                ent.setNotIt();
            }
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};
*/

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

// the "main" code begins here
//var friction = 1;
//var acceleration = 1000000;
//var maxSpeed = 200;

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
    //var circle = new Circle(gameEngine);
    //circle.setIt();
    //gameEngine.addEntity(circle);
    //for (var i = 0; i < 12; i++) {
    //    circle = new Circle(gameEngine);
    //    gameEngine.addEntity(circle);
    //}

});
