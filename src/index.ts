class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private _pacman: Pacman;
    private ghosts: Ghost[];
    private dots: Dot[];
    private walls: Wall[];
    private dotsEaten: number; // Counter for dots eaten
    
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this._pacman = new Pacman(this.canvas.width / 2, this.canvas.height / 2);
        this.ghosts = [new Ghost(50, 450), new Ghost(50, 100)]; // Example positions
        this.walls = this.createWalls();
        this.dots = this.createDots();
        this.dotsEaten = 0; // Initialize counter
    }

    private createWalls(): Wall[] {
        // Define walls' positions and dimensions
        const borderThickness = 20;
        return [
            new Wall(0, 0, this.canvas.width, borderThickness), // Top border
            new Wall(0, this.canvas.height - borderThickness, this.canvas.width, borderThickness), // Bottom border
            new Wall(0, 0, borderThickness, this.canvas.height), // Left border
            new Wall(this.canvas.width - borderThickness, 0, borderThickness, this.canvas.height), // Right border
            new Wall(100, 100, 300, 20),
            new Wall(300, 200, 20, 200),
            // Add more walls as needed
        ];
    }

    private createDots(): Dot[] {
        // Create dots for the game board
        let dots: Dot[] = [];
        for (let i = 0; i < this.canvas.width; i += 20) {
            for (let j = 0; j < this.canvas.height; j += 20) {
                const dot = new Dot(i, j);
                if (!this.walls.some(wall => wall.collidesWith(dot))) {
                    dots.push(dot);
                }
            }
        }
        return dots;
    }

    public start() {
        setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);
    }

    private update() {
        this._pacman.update(this.walls);
        this.ghosts.forEach(ghost => ghost.update(this.walls));

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
        this.walls.forEach(wall => wall.draw(this.context));
        
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

    public update(walls: Wall[]) {
        let nextX = this.x;
        let nextY = this.y;

        switch (this.direction) {
            case 'right':
                nextX += this.speed;
                break;
            case 'left':
                nextX -= this.speed;
                break;
            case 'up':
                nextY -= this.speed;
                break;
            case 'down':
                nextY += this.speed;
                break;
        }

        if (!walls.some(wall => wall.collidesWithCircle(nextX, nextY, this.radius))) {
            this.x = nextX;
            this.y = nextY;
        }
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
    private speed: number;
    private direction: string;
    private changeDirectionInterval: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = 2;
        this.direction = this.getRandomDirection();
        this.changeDirectionInterval = 0;
    }

    private getRandomDirection(): string {
        const directions = ['right', 'left', 'up', 'down'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    public update(walls: Wall[]) {
        let nextX = this.x;
        let nextY = this.y;

        switch (this.direction) {
            case 'right':
                nextX += this.speed;
                break;
            case 'left':
                nextX -= this.speed;
                break;
            case 'up':
                nextY -= this.speed;
                break;
            case 'down':
                nextY += this.speed;
                break;
        }

        if (!walls.some(wall => wall.collidesWithCircle(nextX, nextY, this.radius))) {
            this.x = nextX;
            this.y = nextY;
        } else {
            this.direction = this.getRandomDirection(); // Change direction if hitting a wall
        }

        this.changeDirectionInterval++;
        if (this.changeDirectionInterval > 60) { // Change direction every 1 second (assuming 60 FPS)
            this.direction = this.getRandomDirection();
            this.changeDirectionInterval = 0;
        }
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

class Wall {
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'blue';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    public collidesWith(dot: Dot): boolean {
        return (
            dot.x > this.x &&
            dot.x < this.x + this.width &&
            dot.y > this.y &&
            dot.y < this.y + this.height
        );
    }

    public collidesWithCircle(cx: number, cy: number, radius: number): boolean {
        const closestX = Math.max(this.x, Math.min(cx, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(cy, this.y + this.height));
        const distanceX = cx - closestX;
        const distanceY = cy - closestY;

        return (distanceX ** 2 + distanceY ** 2) < (radius ** 2);
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