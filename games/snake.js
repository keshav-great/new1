// Snake Game Implementation
class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 20;
        this.cols = 30;
        this.rows = 20;
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        
        this.reset();
        this.setupControls();
    }

    reset() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.food = this.spawnFood();
        this.score = 0;
        this.gameOver = false;
        this.speed = 150;
    }

    spawnFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
            }
        });
    }

    update() {
        if (this.gameOver) return;

        this.direction = this.nextDirection;

        const head = { ...this.snake[0] };
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            this.gameOver = true;
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.spawnFood();
            // Increase speed slightly
            this.speed = Math.max(50, this.speed - 2);
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#111';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00';
            this.ctx.fillRect(
                segment.x * this.cellSize + 1,
                segment.y * this.cellSize + 1,
                this.cellSize - 2,
                this.cellSize - 2
            );
            
            // Draw eyes on head
            if (index === 0) {
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(
                    segment.x * this.cellSize + 4,
                    segment.y * this.cellSize + 4,
                    3, 3
                );
                this.ctx.fillRect(
                    segment.x * this.cellSize + 12,
                    segment.y * this.cellSize + 4,
                    3, 3
                );
            }
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.cellSize + this.cellSize/2,
            this.food.y * this.cellSize + this.cellSize/2,
            this.cellSize/2 - 2,
            0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, this.canvas.height - 10);
        
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
        let lastUpdate = 0;
        const gameLoop = (timestamp) => {
            if (timestamp - lastUpdate > this.speed) {
                this.update();
                lastUpdate = timestamp;
            }
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }
}
