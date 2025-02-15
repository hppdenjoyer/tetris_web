document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const BLOCK_SIZE = 30;
    
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    let tetris = new Tetris();
    let gameLoop;
    let isPaused = false;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        for (let i = 0; i < tetris.width; i++) {
            for (let j = 0; j < tetris.height; j++) {
                ctx.strokeRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }

        // Draw fallen pieces
        tetris.grid.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            });
        });

        // Draw current piece
        ctx.fillStyle = tetris.currentPiece.color;
        tetris.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillRect(
                        (tetris.currentPiece.x + x) * BLOCK_SIZE,
                        (tetris.currentPiece.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE - 1,
                        BLOCK_SIZE - 1
                    );
                }
            });
        });
    }

    function updateScore() {
        scoreElement.textContent = tetris.score;
        levelElement.textContent = tetris.level;
        linesElement.textContent = tetris.lines;
    }

    function gameStep() {
        if (!tetris.moveDown()) {
            if (tetris.gameOver) {
                endGame();
                return;
            }
        }
        updateScore();
        draw();
    }

    function startGame() {
        tetris = new Tetris();
        isPaused = false;
        startBtn.textContent = 'Restart';
        pauseBtn.disabled = false;
        
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(() => {
            if (!isPaused) gameStep();
        }, 1000 - (tetris.level - 1) * 50);
        
        draw();
    }

    function pauseGame() {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    }

    function endGame() {
        clearInterval(gameLoop);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        
        pauseBtn.disabled = true;
    }

    // Event Listeners
    document.addEventListener('keydown', (e) => {
        if (isPaused || tetris.gameOver) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                tetris.moveLeft();
                break;
            case 'ArrowRight':
                tetris.moveRight();
                break;
            case 'ArrowDown':
                tetris.moveDown();
                break;
            case 'ArrowUp':
                tetris.rotate();
                break;
            case ' ':
                tetris.hardDrop();
                break;
        }
        draw();
        updateScore();
    });

    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
});
