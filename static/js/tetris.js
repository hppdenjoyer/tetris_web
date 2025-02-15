class Tetris {
    static SHAPES = {
        'I': [[1, 1, 1, 1]],
        'O': [[1, 1], [1, 1]],
        'T': [[0, 1, 0], [1, 1, 1]],
        'S': [[0, 1, 1], [1, 1, 0]],
        'Z': [[1, 1, 0], [0, 1, 1]],
        'J': [[1, 0, 0], [1, 1, 1]],
        'L': [[0, 0, 1], [1, 1, 1]]
    };

    static COLORS = {
        'I': '#00f0f0',
        'O': '#f0f000',
        'T': '#a000f0',
        'S': '#00f000',
        'Z': '#f00000',
        'J': '#0000f0',
        'L': '#f0a000'
    };

    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    reset() {
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.createPiece();
    }

    createPiece() {
        const pieces = Object.keys(Tetris.SHAPES);
        const type = pieces[Math.floor(Math.random() * pieces.length)];
        this.currentPiece = {
            type: type,
            shape: Tetris.SHAPES[type],
            color: Tetris.COLORS[type],
            x: Math.floor(this.width / 2) - Math.floor(Tetris.SHAPES[type][0].length / 2),
            y: 0
        };
    }

    rotate() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }

    isValidMove(x, y, shape = this.currentPiece.shape) {
        return shape.every((row, dy) =>
            row.every((value, dx) =>
                value === 0 ||
                (x + dx >= 0 &&
                 x + dx < this.width &&
                 y + dy >= 0 &&
                 y + dy < this.height &&
                 !this.grid[y + dy][x + dx])
            )
        );
    }

    moveLeft() {
        if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y)) {
            this.currentPiece.x--;
        }
    }

    moveRight() {
        if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y)) {
            this.currentPiece.x++;
        }
    }

    moveDown() {
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            return true;
        }
        this.freeze();
        return false;
    }

    freeze() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    if (this.currentPiece.y + y < 0) {
                        this.gameOver = true;
                        return;
                    }
                    this.grid[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color;
                }
            });
        });

        this.clearLines();
        this.createPiece();
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.width).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += [0, 40, 100, 300, 1200][linesCleared] * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
        }
    }

    hardDrop() {
        while (this.moveDown()) {}
    }
}
