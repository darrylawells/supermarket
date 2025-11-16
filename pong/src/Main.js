// Heaps.io-inspired Pong Game
// Using vanilla JavaScript with Heaps.io architecture patterns

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const WINNING_SCORE = 5;
const AI_DIFFICULTY = 0.75; // 0.0 to 1.0, higher = harder

// Game states
const STATE_MENU = 'menu';
const STATE_PLAYING = 'playing';
const STATE_GAME_OVER = 'gameOver';

// Paddle class - represents a player or AI paddle
class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.speed = PADDLE_SPEED;
    this.velocityY = 0;
  }

  move(direction) {
    this.velocityY = direction * this.speed;
  }

  update() {
    this.y += this.velocityY;

    // Keep paddle within bounds
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > GAME_HEIGHT) {
      this.y = GAME_HEIGHT - this.height;
    }
  }

  render(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityY = 0;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

// Ball class - the game ball
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = BALL_SIZE;
    this.velocityX = BALL_SPEED;
    this.velocityY = BALL_SPEED;
    this.baseSpeed = BALL_SPEED;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Bounce off top and bottom
    if (this.y <= 0 || this.y + this.size >= GAME_HEIGHT) {
      this.velocityY = -this.velocityY;
      this.y = this.y <= 0 ? 0 : GAME_HEIGHT - this.size;
    }
  }

  render(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    // Random direction
    this.velocityX = this.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.velocityY = this.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
  }

  reverseX() {
    this.velocityX = -this.velocityX;
    // Slightly increase speed on each hit for excitement
    this.velocityX *= 1.05;
    this.velocityY *= 1.05;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };
  }
}

// AI Controller - handles computer opponent logic
class AIController {
  constructor(paddle, ball, difficulty = AI_DIFFICULTY) {
    this.paddle = paddle;
    this.ball = ball;
    this.difficulty = difficulty;
    this.reactionTime = 0;
  }

  update() {
    // AI follows the ball with some reaction delay
    this.reactionTime++;

    // Only react every few frames based on difficulty
    const reactionDelay = Math.floor((1 - this.difficulty) * 10);
    if (this.reactionTime < reactionDelay) {
      return;
    }
    this.reactionTime = 0;

    // Calculate target position
    const paddleCenter = this.paddle.y + this.paddle.height / 2;
    const ballCenter = this.ball.y + this.ball.size / 2;
    const diff = ballCenter - paddleCenter;

    // Add some margin to make it beatable
    const threshold = 10;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.paddle.move(1);
      } else {
        this.paddle.move(-1);
      }
    } else {
      this.paddle.move(0);
    }
  }
}

// Base Scene class - similar to Heaps.io Scene
class Scene {
  constructor(game) {
    this.game = game;
  }

  update() {}
  render(ctx) {}
  onKeyDown(key) {}
  onKeyUp(key) {}
}

// Menu Scene - main menu
class MenuScene extends Scene {
  constructor(game) {
    super(game);
    this.blinkAlpha = 1;
    this.blinkDirection = -1;
  }

  update() {
    // Animate the "press space" text
    this.blinkAlpha += this.blinkDirection * 0.02;
    if (this.blinkAlpha <= 0.3 || this.blinkAlpha >= 1) {
      this.blinkDirection = -this.blinkDirection;
    }
  }

  render(ctx) {
    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PONG', GAME_WIDTH / 2, 200);

    // Instructions
    ctx.font = '20px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Use W and S to move your paddle', GAME_WIDTH / 2, 300);
    ctx.fillText(`First to ${WINNING_SCORE} wins!`, GAME_WIDTH / 2, 330);

    // Start button (blinking)
    ctx.globalAlpha = this.blinkAlpha;
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#00FF00';
    ctx.fillText('PRESS SPACE TO START', GAME_WIDTH / 2, 420);
    ctx.globalAlpha = 1.0;
  }

  onKeyDown(key) {
    if (key === ' ') {
      this.game.switchScene(new GameScene(this.game));
    }
  }
}

// Game Scene - main gameplay
class GameScene extends Scene {
  constructor(game) {
    super(game);
    this.playerScore = 0;
    this.aiScore = 0;

    // Initialize game objects
    this.playerPaddle = new Paddle(30, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    this.aiPaddle = new Paddle(GAME_WIDTH - 30 - PADDLE_WIDTH, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    this.ball = new Ball(GAME_WIDTH / 2 - BALL_SIZE / 2, GAME_HEIGHT / 2 - BALL_SIZE / 2);
    this.ai = new AIController(this.aiPaddle, this.ball);

    this.keys = {};
  }

  update() {
    // Handle player input
    if (this.keys['w'] || this.keys['W']) {
      this.playerPaddle.move(-1);
    } else if (this.keys['s'] || this.keys['S']) {
      this.playerPaddle.move(1);
    } else {
      this.playerPaddle.move(0);
    }

    // Update game objects
    this.playerPaddle.update();
    this.aiPaddle.update();
    this.ball.update();
    this.ai.update();

    // Check collisions with paddles
    this.checkCollision(this.playerPaddle);
    this.checkCollision(this.aiPaddle);

    // Check scoring
    if (this.ball.x <= 0) {
      this.aiScore++;
      this.resetBall();
      this.checkWinCondition();
    } else if (this.ball.x + this.ball.size >= GAME_WIDTH) {
      this.playerScore++;
      this.resetBall();
      this.checkWinCondition();
    }
  }

  render(ctx) {
    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Center line
    ctx.strokeStyle = '#FFFFFF';
    ctx.globalAlpha = 0.5;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH / 2, 0);
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;

    // Game objects
    this.playerPaddle.render(ctx);
    this.aiPaddle.render(ctx);
    this.ball.render(ctx);

    // Scores
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.playerScore, GAME_WIDTH / 4, 80);
    ctx.fillText(this.aiScore, 3 * GAME_WIDTH / 4, 80);
  }

  checkCollision(paddle) {
    const ballBounds = this.ball.getBounds();
    const paddleBounds = paddle.getBounds();

    // AABB collision detection
    if (ballBounds.x < paddleBounds.x + paddleBounds.width &&
        ballBounds.x + ballBounds.width > paddleBounds.x &&
        ballBounds.y < paddleBounds.y + paddleBounds.height &&
        ballBounds.y + ballBounds.height > paddleBounds.y) {

      this.ball.reverseX();

      // Prevent ball from getting stuck in paddle
      if (paddle === this.playerPaddle) {
        this.ball.x = paddleBounds.x + paddleBounds.width;
      } else {
        this.ball.x = paddleBounds.x - ballBounds.width;
      }

      // Add variation to ball angle based on where it hits the paddle
      const hitPos = (this.ball.y - paddle.y) / paddle.height;
      this.ball.velocityY += (hitPos - 0.5) * 2;
    }
  }

  resetBall() {
    this.ball.reset(GAME_WIDTH / 2 - BALL_SIZE / 2, GAME_HEIGHT / 2 - BALL_SIZE / 2);
  }

  checkWinCondition() {
    if (this.playerScore >= WINNING_SCORE) {
      this.game.switchScene(new GameOverScene(this.game, true));
    } else if (this.aiScore >= WINNING_SCORE) {
      this.game.switchScene(new GameOverScene(this.game, false));
    }
  }

  onKeyDown(key) {
    this.keys[key] = true;
  }

  onKeyUp(key) {
    this.keys[key] = false;
  }
}

// Game Over Scene - win/lose screen
class GameOverScene extends Scene {
  constructor(game, playerWon) {
    super(game);
    this.playerWon = playerWon;
  }

  render(ctx) {
    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Result text
    ctx.font = 'bold 72px monospace';
    ctx.textAlign = 'center';
    if (this.playerWon) {
      ctx.fillStyle = '#00FF00';
      ctx.fillText('YOU WIN!', GAME_WIDTH / 2, 220);
    } else {
      ctx.fillStyle = '#FF0000';
      ctx.fillText('YOU LOSE!', GAME_WIDTH / 2, 220);
    }

    // Instructions
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('PRESS SPACE TO PLAY AGAIN', GAME_WIDTH / 2, 370);

    ctx.font = '20px monospace';
    ctx.fillText('PRESS ESC FOR MENU', GAME_WIDTH / 2, 430);
  }

  onKeyDown(key) {
    if (key === ' ') {
      this.game.switchScene(new GameScene(this.game));
    } else if (key === 'Escape') {
      this.game.switchScene(new MenuScene(this.game));
    }
  }
}

// Main Game App - similar to Heaps.io hxd.App
class PongGame {
  constructor() {
    this.canvas = document.getElementById('webgl');
    this.ctx = this.canvas.getContext('2d');

    // Set canvas size
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;

    // Current scene
    this.currentScene = null;

    // Set up input handling
    this.setupInput();

    // Start with menu
    this.switchScene(new MenuScene(this));

    // Start game loop
    this.lastTime = performance.now();
    this.gameLoop();
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      if (this.currentScene) {
        this.currentScene.onKeyDown(e.key);
      }
      // Prevent default for game keys
      if (['w', 's', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.currentScene) {
        this.currentScene.onKeyUp(e.key);
      }
    });
  }

  switchScene(newScene) {
    this.currentScene = newScene;
  }

  gameLoop() {
    const currentTime = performance.now();
    const dt = (currentTime - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = currentTime;

    // Update current scene
    if (this.currentScene) {
      this.currentScene.update(dt);
      this.currentScene.render(this.ctx);
    }

    // Continue loop
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when DOM is ready
window.addEventListener('load', () => {
  new PongGame();
});
