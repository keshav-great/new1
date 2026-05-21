// Pong Game Implementation
class PongGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        this.reset();
        this.setupControls();
    }

    reset() {
        this.paddleWidth = 15;
        this.paddleHeight = 80;
        this.ballSize = 15;
        
        this.player1 = {
            x: 20,
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 8
        };
        
        this.player2 = {
            x: this.canvas.width - 35,
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 6
        };
        
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            dx: 5,
            dy: 3,
            speed: 5
        };
        
        this.gameOver = false;
        this.winningScore = 10;
    }

    setupControls() {
        const keys = {};
        
        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        // Player 1 controls (W/S)
        this.player1Controls = () => {
            if (keys['w'] || keys['W']) {
                this.player1.y = Math.max(0, this.player1.y - this.player1.speed);
            }
            if (keys['s'] || keys['S']) {
                this.player1.y = Math.min(this.canvas.height - this.paddleHeight, this.player1.y + this.player1.speed);
            }
        };
        
        // Player 2 controls (Arrow keys)
        this.player2Controls = () => {
            if (keys['ArrowUp']) {
                this.player2.y = Math.max(0, this.player2.y - this.player2.speed);
            }
            if (keys['ArrowDown']) {
                this.player2.y = Math.min(this.canvas.height - this.paddleHeight, this.player2.y + this.player2.speed);
            }
        };
    }

    update() {
        if (this.gameOver) return;
        
        this.player1Controls();
        this.player2Controls();
        
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top/bottom walls
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height - this.ballSize) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with paddles
        if (this.ball.x <= this.player1.x + this.paddleWidth &&
            this.ball.y >= this.player1.y &&
            this.ball.y <= this.player1.y + this.paddleHeight) {
            this.ball.dx = Math.abs(this.ball.dx);
            this.ball.speed += 0.5;
            this.ball.dx = this.ball.speed * Math.sign(this.ball.dx);
        }
        
        if (this.ball.x >= this.player2.x - this.ballSize &&
            this.ball.y >= this.player2.y &&
            this.ball.y <= this.player2.y + this.paddleHeight) {
            this.ball.dx = -Math.abs(this.ball.dx);
            this.ball.speed += 0.5;
            this.ball.dx = this.ball.speed * Math.sign(this.ball.dx);
        }
        
        // Score points
        if (this.ball.x < 0) {
            this.player2.score++;
            this.resetBall();
        }
        
        if (this.ball.x > this.canvas.width) {
            this.player1.score++;
            this.resetBall();
        }
        
        // Check for winner
        if (this.player1.score >= this.winningScore || this.player2.score >= this.winningScore) {
            this.gameOver = true;
        }
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speed = 5;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
        this.ball.dy = (Math.random() * 2 - 1) * this.ball.speed;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.player1.x, this.player1.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.player2.x, this.player2.y, this.paddleWidth, this.paddleHeight);
        
        // Draw ball
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.ball.x, this.ball.y, this.ballSize, this.ballSize);
        
        // Draw scores
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.player1.score, this.canvas.width / 4, 50);
        this.ctx.fillText(this.player2.score, (this.canvas.width / 4) * 3, 50);
        
        // Draw controls info
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Player 1: W/S', this.canvas.width / 4, this.canvas.height - 20);
        this.ctx.fillText('Player 2: Arrow Keys', (this.canvas.width / 4) * 3, this.canvas.height - 20);
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            const winner = this.player1.score >= this.winningScore ? 'Player 1' : 'Player 2';
            this.ctx.fillText(`${winner} Wins!`, this.canvas.width/2, this.canvas.height/2);
        }
    }

    start() {
        const gameLoop = () => {
            this.update();
            this.draw();
            if (!this.gameOver) {
                requestAnimationFrame(gameLoop);
            }
        };
        gameLoop();
    }
}
