# Heaps.io-Inspired Pong Game

A classic Pong game built with JavaScript following Heaps.io architectural patterns.

## Features

- **Main Menu**: Welcome screen with instructions
- **Gameplay**: Classic Pong mechanics with smooth physics
- **AI Opponent**: Computer-controlled paddle with adjustable difficulty
- **Win Conditions**: First player to reach 5 points wins
- **Game Over Screen**: Shows win/lose status with replay option

## Controls

- **W**: Move paddle up
- **S**: Move paddle down
- **Space**: Start game / Play again
- **Escape**: Return to main menu (from game over screen)

## Architecture

The game follows Heaps.io design patterns:

- **Scene System**: MenuScene, GameScene, GameOverScene
- **Entity Classes**: Paddle, Ball with update/render methods
- **Game Loop**: RequestAnimationFrame-based main loop
- **AI Controller**: Intelligent opponent with reaction delays

## Game Constants

- Game Size: 800x600
- Winning Score: 5 points
- AI Difficulty: 0.75 (configurable 0.0-1.0)
- Ball Speed: Increases on each paddle hit

## How to Play

1. Open `pong.html` in your browser
2. Press **Space** to start
3. Use **W** and **S** to move your paddle
4. Try to get the ball past the AI opponent
5. First to 5 points wins!

## Technical Details

- Pure JavaScript (ES6+)
- HTML5 Canvas rendering
- No external dependencies
- Heaps.io-inspired architecture for clean code organization
