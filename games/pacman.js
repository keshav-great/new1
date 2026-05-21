// Pac-Man Game Implementation
class PacmanGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 20;
        this.rows = 21;
        this.cols = 19;
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        
        this.reset();
        this.setupControls();
    }

    reset() {
        this.pacman = { x: 9, y: 15, direction: 'left', mouthOpen: true };
        this.ghosts = [
            { x: 9, y: 9, color: '#ff0000', direction: 'up' },
            { x: 8, y: 9, color: '#ffb8ff', direction: 'up' },
            { x: 10, y: 9, color: '#00ffff', direction: 'up' },
            { x: 9, y: 8, color: '#ffb852', direction: 'up' }
        ];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.dots = [];
        this.powerPellets = [];
        this.initMaze();
    }

    initMaze() {
        // Simple maze layout (1 = wall, 0 = dot, 2 = power pellet, 3 = empty)
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,2,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,2,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
            [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
            [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1],
            [3,3,3,1,0,1,0,0,0,0,0,0,0,1,0,1,3,3,3],
            [1,1,1,1,0,1,0,1,1,3,1,1,0,1,0,1,1,1,1],
            [0,0,0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0],
            [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
            [3,3,3,1,0,1,0,0,0,0,0,0,0,1,0,1,3,3,3],
            [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
            [1,2,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,2,1],
            [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
            [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            switch(e.key) {
                case 'ArrowUp': this.pacman.direction = 'up'; break;
                case 'ArrowDown': this.pacman.direction = 'down'; break;
                case 'ArrowLeft': this.pacman.direction = 'left'; break;
                case 'ArrowRight': this.pacman.direction = 'right'; break;
            }
        });
    }

    update() {
        if (this.gameOver) return;

        // Move Pac-Man
        let newX = this.pacman.x;
        let newY = this.pacman.y;

        switch(this.pacman.direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }

        // Check wall collision
        if (this.maze[newY][newX] !== 1) {
            this.pacman.x = newX;
            this.pacman.y = newY;
        }

        // Eat dots
        if (this.maze[this.pacman.y][this.pacman.x] === 0) {
            this.maze[this.pacman.y][this.pacman.x] = 3;
            this.score += 10;
        }

        // Eat power pellets
        if (this.maze[this.pacman.y][this.pacman.x] === 2) {
            this.maze[this.pacman.y][this.pacman.x] = 3;
            this.score += 50;
        }

        // Move ghosts
        this.ghosts.forEach(ghost => {
            const directions = ['up', 'down', 'left', 'right'];
            const randomDir = directions[Math.floor(Math.random() * 4)];
            let ghostX = ghost.x;
            let ghostY = ghost.y;

            switch(randomDir) {
                case 'up': ghostY--; break;
                case 'down': ghostY++; break;
                case 'left': ghostX--; break;
                case 'right': ghostX++; break;
            }

            if (this.maze[ghostY][ghostX] !== 1) {
                ghost.x = ghostX;
                ghost.y = ghostY;
            }

            // Check collision with Pac-Man
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver = true;
                } else {
                    this.pacman.x = 9;
                    this.pacman.y = 15;
                }
            }
        });

        // Mouth animation
        this.pacman.mouthOpen = !this.pacman.mouthOpen;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw maze
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.maze[y][x];
                if (cell === 1) {
                    this.ctx.fillStyle = '#0000ff';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                } else if (cell === 0) {
                    this.ctx.fillStyle = '#ffb8ae';
                    this.ctx.beginPath();
                    this.ctx.arc(x * this.cellSize + this.cellSize/2, y * this.cellSize + this.cellSize/2, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (cell === 2) {
                    this.ctx.fillStyle = '#ffb8ae';
                    this.ctx.beginPath();
                    this.ctx.arc(x * this.cellSize + this.cellSize/2, y * this.cellSize + this.cellSize/2, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // Draw Pac-Man
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        let startAngle = 0;
        let endAngle = Math.PI * 2;
        
        if (this.pacman.mouthOpen) {
            switch(this.pacman.direction) {
                case 'right': startAngle = 0.2; endAngle = Math.PI * 2 - 0.2; break;
                case 'left': startAngle = Math.PI + 0.2; endAngle = Math.PI - 0.2; break;
                case 'up': startAngle = Math.PI * 1.5 + 0.2; endAngle = Math.PI * 1.5 - 0.2; break;
                case 'down': startAngle = Math.PI * 0.5 + 0.2; endAngle = Math.PI * 0.5 - 0.2; break;
            }
        }
        
        this.ctx.arc(this.pacman.x * this.cellSize + this.cellSize/2, 
                     this.pacman.y * this.cellSize + this.cellSize/2, 
                     this.cellSize/2 - 2, startAngle, endAngle);
        this.ctx.lineTo(this.pacman.x * this.cellSize + this.cellSize/2, 
                        this.pacman.y * this.cellSize + this.cellSize/2);
        this.ctx.fill();

        // Draw ghosts
        this.ghosts.forEach(ghost => {
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(ghost.x * this.cellSize + this.cellSize/2, 
                         ghost.y * this.cellSize + this.cellSize/2 - 3, 
                         this.cellSize/2 - 2, Math.PI, 0);
            this.ctx.lineTo(ghost.x * this.cellSize + this.cellSize - 2, 
                           ghost.y * this.cellSize + this.cellSize - 2);
            this.ctx.lineTo(ghost.x * this.cellSize + 2, 
                           ghost.y * this.cellSize + this.cellSize - 2);
            this.ctx.fill();
        });

        // Draw score and lives
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, this.canvas.height - 10);
        this.ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 60, this.canvas.height - 10);

        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
        }
    }

    start() {
        let lastTime = 0;
        const gameLoop = (timestamp) => {
            if (this.gameOver) {
                this.draw();
                return;
            }
            
            // Update game state
            this.update();
            this.draw();
            
            // Continue the game loop
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }
}
