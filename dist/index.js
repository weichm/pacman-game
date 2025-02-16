"use strict";
var Game = /** @class */ (function () {
    function Game(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this._pacman = new Pacman(this.canvas.width / 2, this.canvas.height / 2);
        this.ghosts = [new Ghost(50, 50), new Ghost(100, 100)]; // Example positions
        this.dots = this.createDots();
        this.gameLoop = 0;
    }
    Game.prototype.createDots = function () {
        // Create dots for the game board
        var dots = [];
        for (var i = 0; i < this.canvas.width; i += 20) {
            for (var j = 0; j < this.canvas.height; j += 20) {
                dots.push(new Dot(i, j));
            }
        }
        return dots;
    };
    Game.prototype.start = function () {
        var _this = this;
        this.gameLoop = setInterval(function () {
            _this.update();
            _this.draw();
        }, 1000 / 60);
    };
    Game.prototype.update = function () {
        var _this = this;
        this._pacman.update();
        this.ghosts.forEach(function (ghost) { return ghost.update(); });
        // Check for collisions between Pacman and dots
        this.dots = this.dots.filter(function (dot) { return !_this._pacman.collidesWith(dot); });
        // Handle other game logic here
    };
    Game.prototype.draw = function () {
        var _this = this;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._pacman.draw(this.context);
        this.ghosts.forEach(function (ghost) { return ghost.draw(_this.context); });
        this.dots.forEach(function (dot) { return dot.draw(_this.context); });
    };
    Object.defineProperty(Game.prototype, "pacman", {
        get: function () {
            return this._pacman;
        },
        enumerable: false,
        configurable: true
    });
    return Game;
}());
var Pacman = /** @class */ (function () {
    function Pacman(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = 2;
        this.direction = 'right';
    }
    Pacman.prototype.update = function () {
        switch (this.direction) {
            case 'right':
                this.x += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
            case 'up':
                this.y -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
        }
        // Add boundary checks and collision detection here
    };
    Pacman.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0.2 * Math.PI, 1.8 * Math.PI);
        context.lineTo(this.x, this.y);
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
    };
    Pacman.prototype.setDirection = function (direction) {
        this.direction = direction;
    };
    Pacman.prototype.collidesWith = function (dot) {
        var distance = Math.sqrt(Math.pow((this.x - dot.x), 2) + Math.pow((this.y - dot.y), 2));
        return distance < this.radius + dot.radius;
    };
    return Pacman;
}());
var Ghost = /** @class */ (function () {
    function Ghost(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
    }
    Ghost.prototype.update = function () {
        // Add ghost movement logic here
    };
    Ghost.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    };
    return Ghost;
}());
//
var Dot = /** @class */ (function () {
    function Dot(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3;
    }
    Dot.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    };
    return Dot;
}());
window.onload = function () {
    var game = new Game('gameCanvas');
    game.start();
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowRight':
                game.pacman.setDirection('right');
                break;
            case 'ArrowLeft':
                game.pacman.setDirection('left');
                break;
            case 'ArrowUp':
                game.pacman.setDirection('up');
                break;
            case 'ArrowDown':
                game.pacman.setDirection('down');
                break;
        }
    });
};
