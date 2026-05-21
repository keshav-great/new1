// Tetris Game Implementation
class TetrisGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        
        this.colors = {
            I: '#00f0f0',
            O: '#f0f000',
            T: '#a000f0',
            S: '#00f000',
            Z: '#f00000',
            J: '#0000f0',
            L: '#f0a000'
        };
        
        this.pieces = {
            I: [[1,1,1,1]],
            O: [[1,1],[1,1]],
            T: [[0,1,0],[1,1,1]],
            S: [[0,1,1],[1,1,0]],
            Z: [[1,1,0],[0,1,1]],
            J: [[1,0,0],[1,1,1]],
            L: [[0,0,1],[1,1,1]]
        };
        
        this.reset();
        this.setupControls();
    }

    reset() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.currentPiece = null;
        this.nextPiece = null;
        this.spawnPiece();
    }

    spawnPiece() {
        const pieceNames = Object.keys(this.pieces);
        const randomPiece = pieceNames[Math.floor(Math.random() * pieceNames.length)];
        
        this.currentPiece = {
            type: randomPiece,
            shape: this.pieces[randomPiece].map(row => [...row]),
            x: Math.floor(this.cols / 2) - 1,
            y: 0
        };

        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver = true;
        }
    }

    checkCollision(piece, dx, dy) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x + dx;
                    const newY = piece.y + y + dy;
                    
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    mergePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.type;
                    }
                }
            }
        }
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
        }
    }

    rotatePiece() {
        const piece = this.currentPiece;
        const newShape = piece.shape[0].map((_, i) => 
            piece.shape.map(row => row[i]).reverse()
        );
        
        const rotatedPiece = {
            ...piece,
            shape: newShape
        };
        
        if (!this.checkCollision(rotatedPiece, 0, 0)) {
            this.currentPiece.shape = newShape;
        }
    }

    movePiece(dx, dy) {
        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        }
        return false;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    while (this.movePiece(0, 1)) {}
                    this.mergePiece();
                    break;
            }
        });
    }

    update() {
        if (this.gameOver) return;
        
        if (!this.movePiece(0, 1)) {
            this.mergePiece();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
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
        
        // Draw board
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.colors[this.board[y][x]];
                    this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, 
                                     this.cellSize - 2, this.cellSize - 2);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.colors[this.currentPiece.type];
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        this.ctx.fillRect(
                            (this.currentPiece.x + x) * this.cellSize + 1,
                            (this.currentPiece.y + y) * this.cellSize + 1,
                            this.cellSize - 2, this.cellSize - 2
                        );
                    }
                }
            }
        }
        
        // Draw score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, this.canvas.height - 40);
        this.ctx.fillText(`Lines: ${this.lines}`, 10, this.canvas.height - 20);
        this.ctx.fillText(`Level: ${this.level}`, this.canvas.width - 80, this.canvas.height - 20);
        
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
        let lastDrop = 0;
        const gameLoop = (timestamp) => {
            if (this.gameOver) {
                this.draw();
                return;
            }
            
            const dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            
            if (timestamp - lastDrop > dropInterval) {
                this.update();
                lastDrop = timestamp;
            }
            
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }
}
