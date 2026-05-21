// Retro Arcade JavaScript - Game Integration

let currentGame = null;
let currentGameType = null;

// Sound effects
const clickSound = new Audio('sound/When click soundeffect.mp3');
const gameStartSound = new Audio('sound/When game starts.mp3');

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all arcade features
    initScrollEffects();
    initGlitchEffect();
    initCoinSlot();
    initGameCards();
    initHighScores();
    initArcadeSounds();
    initGameModal();
});

// Play click sound effect
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Sound play failed:', e));
}

// Play game start sound effect
function playGameStartSound() {
    gameStartSound.currentTime = 0;
    gameStartSound.play().catch(e => console.log('Sound play failed:', e));
}

// Game Modal Integration
function initGameModal() {
    const modal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.close-btn');
    const restartBtn = document.getElementById('restartBtn');
    const canvas = document.getElementById('gameCanvas');
    
    closeBtn.addEventListener('click', closeGameModal);
    restartBtn.addEventListener('click', restartCurrentGame);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGameModal();
        }
    });
    
    // Keyboard shortcut to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGameModal();
        }
    });
}

function openGameModal(gameType) {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const canvas = document.getElementById('gameCanvas');
    const startScreen = document.getElementById('startScreen');
    
    currentGameType = gameType;
    modal.style.display = 'flex';
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Set modal title
    const gameNames = {
        'pacman': 'PAC-MAN',
        'tetris': 'TETRIS',
        'pong': 'PONG',
        'snake': 'SNAKE',
        'asteroids': 'ASTEROIDS'
    };
    modalTitle.textContent = gameNames[gameType] || 'GAME';
    
    // Show start screen briefly then start game
    startScreen.style.display = 'flex';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        playGameStartSound();
        startGame(gameType, canvas);
    }, 1500);
}

function closeGameModal() {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';
    
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = 'auto';
    
    // Stop current game
    if (currentGame) {
        currentGame = null;
    }
}

function restartCurrentGame() {
    const canvas = document.getElementById('gameCanvas');
    const gameOver = document.getElementById('gameOver');
    gameOver.classList.add('hidden');
    
    if (currentGameType) {
        startGame(currentGameType, canvas);
    }
}

function startGame(gameType, canvas) {
    // Clear any existing game
    if (currentGame) {
        currentGame = null;
    }
    
    // Dynamically load game script and start
    const scriptUrl = `games/${gameType}.js`;
    
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.onload = () => {
            launchGame(gameType, canvas);
        };
        document.head.appendChild(script);
    } else {
        launchGame(gameType, canvas);
    }
}

function launchGame(gameType, canvas) {
    // Clear canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch(gameType) {
        case 'pacman':
            if (typeof PacmanGame !== 'undefined') {
                currentGame = new PacmanGame(canvas);
                currentGame.start();
            }
            break;
        case 'tetris':
            if (typeof TetrisGame !== 'undefined') {
                currentGame = new TetrisGame(canvas);
                currentGame.start();
            }
            break;
        case 'pong':
            if (typeof PongGame !== 'undefined') {
                currentGame = new PongGame(canvas);
                currentGame.start();
            }
            break;
        case 'snake':
            if (typeof SnakeGame !== 'undefined') {
                currentGame = new SnakeGame(canvas);
                currentGame.start();
            }
            break;
        case 'asteroids':
            if (typeof AsteroidsGame !== 'undefined') {
                currentGame = new AsteroidsGame(canvas);
                currentGame.start();
            }
            break;
    }
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add special effects for different sections
                if (entry.target.classList.contains('game-card')) {
                    animateGameCard(entry.target);
                } else if (entry.target.classList.contains('cabinet')) {
                    animateCabinet(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all game cards and cabinets
    document.querySelectorAll('.game-card, .cabinet, .score-row').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animate game cards when they come into view
function animateGameCard(card) {
    const delay = Array.from(card.parentNode.children).indexOf(card) * 100;
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, delay);
}

// Animate arcade cabinets
function animateCabinet(cabinet) {
    setTimeout(() => {
        cabinet.style.opacity = '1';
        cabinet.style.transform = 'translateY(0)';
    }, 200);
}

// Glitch Effect Enhancement
function initGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');
    if (!glitchElement) return;

    // Random glitch intensity changes
    setInterval(() => {
        const intensity = Math.random();
        if (intensity > 0.7) {
            glitchElement.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0px #ff00ff,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0px #00ffff
            `;
            setTimeout(() => {
                glitchElement.style.textShadow = '';
            }, 100);
        }
    }, 2000);
}

// Coin Slot Interaction
function initCoinSlot() {
    const coinSlot = document.querySelector('.coin-slot');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.style.cursor = 'pointer';
        scrollIndicator.addEventListener('click', () => {
            // Create coin animation
            const coin = document.createElement('div');
            coin.style.cssText = `
                position: fixed;
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                border-radius: 50%;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 0 20px #ffd700;
            `;
            
            // Position coin at click location
            const rect = scrollIndicator.getBoundingClientRect();
            coin.style.left = rect.left + rect.width / 2 - 15 + 'px';
            coin.style.top = rect.top + 'px';
            
            document.body.appendChild(coin);
            
            // Animate coin insertion
            coin.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateY(50px) scale(0.5)', opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-in'
            }).onfinish = () => coin.remove();

            // Play coin sound effect (visual feedback)
            showCoinMessage();
        });
    }
    
    if (coinSlot) {
        coinSlot.addEventListener('click', (e) => {
            e.stopPropagation();
            // Create coin animation
            const coin = document.createElement('div');
            coin.style.cssText = `
                position: fixed;
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                border-radius: 50%;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 0 20px #ffd700;
            `;
            
            // Position coin at click location
            const rect = coinSlot.getBoundingClientRect();
            coin.style.left = rect.left + rect.width / 2 - 15 + 'px';
            coin.style.top = rect.top + 'px';
            
            document.body.appendChild(coin);
            
            // Animate coin insertion
            coin.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateY(50px) scale(0.5)', opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-in'
            }).onfinish = () => coin.remove();

            // Play coin sound effect (visual feedback)
            showCoinMessage();
        });
    }
}

// Show coin insertion message
function showCoinMessage() {
    const message = document.createElement('div');
    message.textContent = 'CREDIT +1';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Press Start 2P', cursive;
        font-size: 2rem;
        color: #00ff00;
        text-shadow: 0 0 20px #00ff00;
        z-index: 10000;
        pointer-events: none;
        animation: coinMessage 1s ease-out forwards;
    `;
    
    // Add animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes coinMessage {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -100%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(message);
    setTimeout(() => {
        message.remove();
        style.remove();
    }, 1000);
}

// Game Cards Interaction
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-card, .cabinet');
    
    gameCards.forEach(card => {
        // Add hover sound effect simulation
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click to start game
        card.addEventListener('click', () => {
            const gameType = card.getAttribute('data-game');
            if (gameType) {
                playClickSound();
                openGameModal(gameType);
            }
        });
    });
}

// Show game start message
function showGameStartMessage(gameName) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Press Start 2P', cursive;
    `;
    
    const title = document.createElement('h2');
    title.textContent = gameName;
    title.style.cssText = `
        color: #ff00ff;
        font-size: 3rem;
        text-shadow: 0 0 20px #ff00ff;
        margin-bottom: 2rem;
        animation: gameTitlePulse 0.5s ease-in-out infinite alternate;
    `;
    
    const loading = document.createElement('p');
    loading.textContent = 'LOADING...';
    loading.style.cssText = `
        color: #00ff00;
        font-size: 1.5rem;
        animation: loadingBlink 0.5s step-end infinite;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 300px;
        height: 20px;
        border: 2px solid #00ff00;
        margin-top: 2rem;
        position: relative;
        overflow: hidden;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #00ffff);
        animation: progressFill 2s ease-in-out forwards;
    `;
    
    progressBar.appendChild(progressFill);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gameTitlePulse {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
        }
        @keyframes loadingBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        @keyframes progressFill {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(style);
    
    overlay.appendChild(title);
    overlay.appendChild(loading);
    overlay.appendChild(progressBar);
    document.body.appendChild(overlay);
    
    // Remove overlay after animation
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 500);
    }, 2500);
}

// High Scores System
function initHighScores() {
    // Initialize default scores if none exist
    if (!localStorage.getItem('retroArcadeScores')) {
        const defaultScores = [
            { rank: 1, player: 'AAA', score: 999999, game: 'PAC-MAN' },
            { rank: 2, player: 'ACE', score: 875400, game: 'TETRIS' },
            { rank: 3, player: 'MAX', score: 750200, game: 'SNAKE' },
            { rank: 4, player: 'ZAP', score: 625100, game: 'ASTEROIDS' },
            { rank: 5, player: 'KID', score: 500000, game: 'PONG' }
        ];
        localStorage.setItem('retroArcadeScores', JSON.stringify(defaultScores));
    }
    
    renderHighScores();
    
    // Add hover effects
    const scoreRows = document.querySelectorAll('.score-row');
    scoreRows.forEach((row, index) => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(0, 255, 0, 0.2)';
            row.style.transform = 'scale(1.05)';
            row.style.transition = 'all 0.3s ease';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.background = '';
            row.style.transform = 'scale(1)';
        });
    });
}

// Render high scores from localStorage
function renderHighScores() {
    const scoreRowsContainer = document.getElementById('scoreRows');
    if (!scoreRowsContainer) return;
    
    const scores = JSON.parse(localStorage.getItem('retroArcadeScores')) || [];
    
    scoreRowsContainer.innerHTML = '';
    
    scores.forEach((score, index) => {
        const row = document.createElement('div');
        row.className = 'score-row';
        row.innerHTML = `
            <span class="rank">${getRankSuffix(index + 1)}</span>
            <span class="player">${score.player}</span>
            <span class="score">${score.score.toLocaleString()}</span>
        `;
        scoreRowsContainer.appendChild(row);
    });
}

// Get rank suffix (1ST, 2ND, 3RD, etc.)
function getRankSuffix(rank) {
    const suffixes = ['ST', 'ND', 'RD'];
    const suffix = rank <= 3 ? suffixes[rank - 1] : 'TH';
    return `${rank}${suffix}`;
}

// Add a new score to the high scores
function addHighScore(playerName, score, gameName) {
    let scores = JSON.parse(localStorage.getItem('retroArcadeScores')) || [];
    
    // Add new score
    scores.push({
        player: playerName.toUpperCase().substring(0, 3),
        score: score,
        game: gameName
    });
    
    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    scores = scores.slice(0, 10);
    
    // Update ranks
    scores.forEach((score, index) => {
        score.rank = index + 1;
    });
    
    localStorage.setItem('retroArcadeScores', JSON.stringify(scores));
    renderHighScores();
}

// Arcade Sounds (Visual feedback system)
function initArcadeSounds() {
    // Create visual sound indicators
    const buttons = document.querySelectorAll('.button, .btn-a, .btn-b');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            createSoundWave(e.target);
        });
    });
}

// Create visual sound wave effect
function createSoundWave(element) {
    const wave = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    wave.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 10px;
        height: 10px;
        border: 2px solid #00ff00;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(wave);
    
    wave.animate([
        { width: '10px', height: '10px', opacity: 1 },
        { width: '100px', height: '100px', opacity: 0 }
    ], {
        duration: 500,
        easing: 'ease-out'
    }).onfinish = () => wave.remove();
}

// Keyboard Controls
let currentSelection = 0;
const gameCards = document.querySelectorAll('.game-card');

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        currentSelection = (currentSelection + 1) % gameCards.length;
        highlightGame(currentSelection);
    } else if (e.key === 'ArrowUp') {
        currentSelection = (currentSelection - 1 + gameCards.length) % gameCards.length;
        highlightGame(currentSelection);
    } else if (e.key === 'Enter') {
        if (gameCards[currentSelection]) {
            gameCards[currentSelection].click();
        }
    }
});

function highlightGame(index) {
    gameCards.forEach((card, i) => {
        if (i === index) {
            card.style.border = '3px solid #00ff00';
            card.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            card.style.border = '';
            card.style.boxShadow = '';
        }
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.backgroundPosition = `center ${scrolled * 0.3}px`;
    }
});

// Random Pixel Art Animation
function createRandomPixel() {
    const pixel = document.createElement('div');
    pixel.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${['#ff00ff', '#00ffff', '#00ff00', '#ffff00'][Math.floor(Math.random() * 4)]};
        pointer-events: none;
        z-index: 9999;
        left: ${Math.random() * 100}vw;
        top: -4px;
    `;
    
    document.body.appendChild(pixel);
    
    const duration = 3000 + Math.random() * 5000;
    
    pixel.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => pixel.remove();
}

// Create falling pixels periodically
setInterval(createRandomPixel, 500);

// Arcade Cabinet Screen Flicker Effect
function initScreenFlicker() {
    const screens = document.querySelectorAll('.cabinet-screen, .game-screen');
    
    screens.forEach(screen => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                screen.style.opacity = '0.8';
                setTimeout(() => {
                    screen.style.opacity = '1';
                }, 50);
            }
        }, 100);
    });
}

initScreenFlicker();

// Console Easter Egg
console.log('%c RETRO ARCADE ', 'background: #ff00ff; color: #000; font-size: 20px; font-weight: bold;');
console.log('%c Welcome to the Arcade! ', 'color: #00ff00; font-size: 14px;');
console.log('%c Press Arrow Keys to navigate, Enter to select ', 'color: #00ffff; font-size: 12px;');
