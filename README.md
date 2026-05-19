# 2D Super Mario Game

A simple 2D platformer game built with Python and Pygame, inspired by Super Mario.

## Features

- **Player Movement**: Use LEFT/RIGHT arrow keys to move
- **Jumping**: Press SPACE to jump
- **Platforms**: Navigate through multiple platforms to reach the goal
- **Enemies**: Avoid or jump on enemies to defeat them
- **Goal**: Reach the yellow platform at the top to win
- **Score System**: Earn points by completing levels

## Installation

1. Install Python 3.7 or higher
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## How to Play

```bash
python main.py
```

### Controls
- **LEFT Arrow** - Move left
- **RIGHT Arrow** - Move right
- **SPACE** - Jump
- **R** - Restart after game over or win

### Gameplay
- Avoid red enemies or jump on them to defeat them
- Jump across green platforms to reach the yellow goal platform at the top
- Don't fall off the platforms!
- Reach the goal to win and increase your score

## Game States

- **Playing**: Normal gameplay
- **Game Over**: You fell off a platform or touched an enemy (press R to restart)
- **Win**: You reached the goal platform (press R to play again)

## Game Elements

- **Red Rectangle**: Player (Mario)
- **Green Rectangles**: Platforms
- **Red Enemies**: Goombas (moving back and forth)
- **Yellow Platform**: Goal/Flag

Enjoy the game! 🎮
