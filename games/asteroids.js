// Asteroids Game Implementation
class AsteroidsGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.reset();
        this.setupControls();
    }

    reset() {
        this.ship = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            angle: 0,
            velocity: { x: 0, y: 0 },
            radius: 15
        };
        
        this.asteroids = [];
        this.bullets = [];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.keys = {};
        
        this.spawnAsteroids();
    }

    spawnAsteroids() {
        for (let i = 0; i < 5; i++) {
            this.asteroids.push(this.createAsteroid());
        }
    }

    createAsteroid() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: x = Math.random() * this.canvas.width; y = -50; break;
            case 1: x = this.canvas.width + 50; y = Math.random() * this.canvas.height; break;
            case 2: x = Math.random() * this.canvas.width; y = this.canvas.height + 50; break;
            case 3: x = -50; y = Math.random() * this.canvas.height; break;
        }
        
        return {
            x: x,
            y: y,
            radius: 30 + Math.random() * 20,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            vertices: this.generateAsteroidVertices()
        };
    }

    generateAsteroidVertices() {
        const vertices = [];
        const numVertices = 8 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numVertices; i++) {
            const angle = (i / numVertices) * Math.PI * 2;
            const radius = 0.8 + Math.random() * 0.4;
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        return vertices;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ' && !this.gameOver) {
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    shoot() {
        const bullet = {
            x: this.ship.x + Math.cos(this.ship.angle) * this.ship.radius,
            y: this.ship.y + Math.sin(this.ship.angle) * this.ship.radius,
            velocity: {
                x: Math.cos(this.ship.angle) * 8,
                y: Math.sin(this.ship.angle) * 8
            }
        };
        this.bullets.push(bullet);
    }

    update() {
        if (this.gameOver) return;

        // Ship rotation
        if (this.keys['ArrowLeft']) {
            this.ship.angle -= 0.1;
        }
        if (this.keys['ArrowRight']) {
            this.ship.angle += 0.1;
        }

        // Ship thrust
        if (this.keys['ArrowUp']) {
            this.ship.velocity.x += Math.cos(this.ship.angle) * 0.3;
            this.ship.velocity.y += Math.sin(this.ship.angle) * 0.3;
        }

        // Update ship position
        this.ship.x += this.ship.velocity.x;
        this.ship.y += this.ship.velocity.y;

        // Wrap around screen
        if (this.ship.x < 0) this.ship.x = this.canvas.width;
        if (this.ship.x > this.canvas.width) this.ship.x = 0;
        if (this.ship.y < 0) this.ship.y = this.canvas.height;
        if (this.ship.y > this.canvas.height) this.ship.y = 0;

        // Friction
        this.ship.velocity.x *= 0.99;
        this.ship.velocity.y *= 0.99;

        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.velocity.x;
            bullet.y += bullet.velocity.y;
            
            // Remove bullets that go off screen
            return bullet.x > 0 && bullet.x < this.canvas.width &&
                   bullet.y > 0 && bullet.y < this.canvas.height;
        });

        // Update asteroids
        this.asteroids.forEach(asteroid => {
            asteroid.x += asteroid.velocity.x;
            asteroid.y += asteroid.velocity.y;
            
            // Wrap around screen
            if (asteroid.x < -100) asteroid.x = this.canvas.width + 100;
            if (asteroid.x > this.canvas.width + 100) asteroid.x = -100;
            if (asteroid.y < -100) asteroid.y = this.canvas.height + 100;
            if (asteroid.y > this.canvas.height + 100) asteroid.y = -100;
        });

        // Check bullet-asteroid collisions
        this.bullets = this.bullets.filter(bullet => {
            let hit = false;
            this.asteroids = this.asteroids.filter(asteroid => {
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroid.radius) {
                    this.score += 10;
                    hit = true;
                    
                    // Split large asteroids
                    if (asteroid.radius > 20) {
                        for (let i = 0; i < 2; i++) {
                            const newAsteroid = this.createAsteroid();
                            newAsteroid.x = asteroid.x;
                            newAsteroid.y = asteroid.y;
                            newAsteroid.radius = asteroid.radius / 2;
                            newAsteroid.velocity = {
                                x: (Math.random() - 0.5) * 4,
                                y: (Math.random() - 0.5) * 4
                            };
                            this.asteroids.push(newAsteroid);
                        }
                    }
                    
                    return false;
                }
                return true;
            });
            
            return !hit;
        });

        // Check ship-asteroid collisions
        this.asteroids.forEach(asteroid => {
            const dx = this.ship.x - asteroid.x;
            const dy = this.ship.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.ship.radius + asteroid.radius) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver = true;
                } else {
                    this.ship.x = this.canvas.width / 2;
                    this.ship.y = this.canvas.height / 2;
                    this.ship.velocity = { x: 0, y: 0 };
                }
            }
        });

        // Spawn new asteroids if all destroyed
        if (this.asteroids.length === 0) {
            this.spawnAsteroids();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 137) % this.canvas.width;
            const y = (i * 89) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
        
        // Draw ship
        this.ctx.save();
        this.ctx.translate(this.ship.x, this.ship.y);
        this.ctx.rotate(this.ship.angle);
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.ship.radius, 0);
        this.ctx.lineTo(-this.ship.radius * 0.7, this.ship.radius * 0.7);
        this.ctx.lineTo(-this.ship.radius * 0.4, 0);
        this.ctx.lineTo(-this.ship.radius * 0.7, -this.ship.radius * 0.7);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw thrust flame
        if (this.keys['ArrowUp']) {
            this.ctx.fillStyle = '#ff6600';
            this.ctx.beginPath();
            this.ctx.moveTo(-this.ship.radius * 0.4, 0);
            this.ctx.lineTo(-this.ship.radius * 1.5, 0);
            this.ctx.lineTo(-this.ship.radius * 0.4, 3);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        // Draw bullets
        this.ctx.fillStyle = '#0f0';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
        });
        
        // Draw asteroids
        this.asteroids.forEach(asteroid => {
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            asteroid.vertices.forEach((vertex, index) => {
                const x = asteroid.x + vertex.x * asteroid.radius;
                const y = asteroid.y + vertex.y * asteroid.radius;
                
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            
            this.ctx.closePath();
            this.ctx.stroke();
        });
        
        // Draw score and lives
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 55);
        
        // Draw controls
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Controls: Arrow Keys to move, Space to shoot', 10, this.canvas.height - 10);
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
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
