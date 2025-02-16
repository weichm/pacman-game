class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private _pacman: Pacman;
    private ghosts: Ghost[];
    private dots: Dot[];
    private gameLoop: number;
    private dotsEaten: number; // Counter for dots eaten
    
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this._pacman = new Pacman(this.canvas.width / 2, this.canvas.height / 2);
        this.ghosts = [new Ghost(50, 50), new Ghost(100, 100)]; // Example positions
        this.dots = this.createDots();
        this.gameLoop = 0;
        this.dotsEaten = 0; // Initialize counter
    }

    private createDots(): Dot[] {
        // Create dots for the game board
        let dots: Dot[] = [];
        for (let i = 0; i < this.canvas.width; i += 20) {
            for (let j = 0; j < this.canvas.height; j += 20) {
                dots.push(new Dot(i, j));
            }
        }
        return dots;
    }

    public start() {
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);
    }

    private update() {
        this._pacman.update();
        this.ghosts.forEach(ghost => ghost.update());

        // Check for collisions between Pacman and dots
        this.dots = this.dots.filter(dot => {
            if (this._pacman.collidesWith(dot)) {
                this.dotsEaten++; // Increment counter
                return false;
            }
            return true;
        });

        // Handle other game logic here
    }

    private draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._pacman.draw(this.context);
        this.ghosts.forEach(ghost => ghost.draw(this.context));
        this.dots.forEach(dot => dot.draw(this.context));
        
        // Draw the dots eaten counter
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        this.context.fillText(`Dots Eaten: ${this.dotsEaten}`, this.canvas.width - 150, 30);
    }

    public get pacman(): Pacman {
        return this._pacman;
    }
}

class Pacman {
    private x: number;
    private y: number;
    private radius: number;
    private speed: number;
    private direction: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = 2;
        this.direction = 'right';
    }

    public update() {
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
    }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0.2 * Math.PI, 1.8 * Math.PI);
        context.lineTo(this.x, this.y);
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
    }

    public setDirection(direction: string) {
        this.direction = direction;
    }

    public collidesWith(dot: Dot): boolean {
        const distance = Math.sqrt((this.x - dot.x) ** 2 + (this.y - dot.y) ** 2);
        return distance < this.radius + dot.radius;
    }
}

class Ghost {
    private x: number;
    private y: number;
    private radius: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 10;
    }

    public update() {
        // Add ghost movement logic here
    }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    }
}

class Dot {
    public x: number;
    public y: number;
    public radius: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 3;
    }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }
}

window.onload = () => {
    const game = new Game('gameCanvas');
    game.start();

    document.addEventListener('keydown', (event) => {
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