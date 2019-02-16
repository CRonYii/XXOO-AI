class XXOOCanvasGame {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.init();

        this.canvas.addEventListener('click', ({ layerX, layerY }) => {
            const x = Math.floor(layerX / XXOOCanvasGame.BLOCK_SIZE);
            const y = Math.floor(layerY / XXOOCanvasGame.BLOCK_SIZE);
            if (this.next({ x, y }) && !this.state.goalTest()) {
                this.AI();
            }
        });
    }

    init() {
        const matrix = [];
        for (let i = 0; i < XXOOCanvasGame.ROWS; i++) {
            const sub = [];
            for (let j = 0; j < XXOOCanvasGame.ROWS; j++) {
                sub.push(null);
            }
            matrix.push(sub);
        }
        this.state = new XXOO(matrix);
        this.drawBackground();
    }

    AI() {
        this.count = 0;
        let action;
        if (this.state.player() === 'O') {
            action = this.minValue(this.state).action;
        } else {
            action = this.maxValue(this.state).action;
        }
        this.next(action);
        console.log(this.count);
    }

    maxValue(state) {
        this.count++;
        if (state.goalTest()) {
            return { value: state.utility(), action: null };
        }
        let value = -Infinity;
        let action;
        state.actions().forEach((a) => {
            const v = this.minValue(state.next(a)).value;
            if (v > value) {
                value = v;
                action = a;
            }
        });
        return { value, action };
    }

    minValue(state) {
        this.count++;
        if (state.goalTest()) {
            return { value: state.utility(), action: null };
        }
        let value = +Infinity;
        let action;
        state.actions().forEach((a) => {
            const v = this.maxValue(state.next(a)).value;
            if (v < value) {
                value = v;
                action = a;
            }
        });
        return { value, action };
    }

    next({ x, y }) {
        if (this.state.goalTest() || x < 0 || x > XXOOCanvasGame.COLUMNS - 1 || y < 0 || y > XXOOCanvasGame.ROWS - 1 || this.state.matrix[y][x]) {
            return false;
        }
        this.state = this.state.next({ x, y });
        if (this.state.goalTest()) {
            switch (this.state.utility()) {
                case 1:
                    console.log('X won!!');
                    break;
                case -1:
                    console.log('O won!!');
                    break;
                case 0:
                    console.log('tie!!');
                    break;
            }
        }
        this.drawBackground();
        this.drawOptions();

        return true;
    }

    drawBackground() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, XXOOCanvasGame.WIDTH, XXOOCanvasGame.HEIGHT);
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeRect(0, 0, XXOOCanvasGame.WIDTH, XXOOCanvasGame.HEIGHT);

        for (let i = 1; i <= XXOOCanvasGame.ROWS - 1; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(XXOOCanvasGame.BLOCK_SIZE * i, 0);
            this.ctx.lineTo(XXOOCanvasGame.BLOCK_SIZE * i, XXOOCanvasGame.HEIGHT);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, XXOOCanvasGame.BLOCK_SIZE * i);
            this.ctx.lineTo(XXOOCanvasGame.WIDTH, XXOOCanvasGame.BLOCK_SIZE * i);
            this.ctx.stroke();
        }
    }

    drawOptions() {
        this.state.matrix.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block) {
                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = '50px arial';
                    this.ctx.fillText(block, XXOOCanvasGame.BLOCK_SIZE * x + 30, XXOOCanvasGame.BLOCK_SIZE * y + 60);
                }
            })
        });
    }

}

XXOOCanvasGame.BLOCK_SIZE = 100;
XXOOCanvasGame.COLUMNS = 4;
XXOOCanvasGame.ROWS = 4;
XXOOCanvasGame.WIDTH = XXOOCanvasGame.COLUMNS * XXOOCanvasGame.BLOCK_SIZE;
XXOOCanvasGame.HEIGHT = XXOOCanvasGame.ROWS * XXOOCanvasGame.BLOCK_SIZE;

class XXOO {

    constructor(matrix) {
        this.matrix = matrix;
    }

    player() {
        let result = 0;
        this.matrix.forEach((row) => {
            row.forEach(block => {
                switch (block) {
                    case 'X':
                        result++;
                        break;
                    case 'O':
                        result--;
                        break;
                    default:
                        break;
                }
            });
        });
        return XXOO.sign[result];
    }

    actions() {
        if (this.goalTest()) {
            return [];
        }
        const actions = [];
        this.matrix.forEach((row, y) => {
            row.forEach((block, x) => {
                if (!block) {
                    actions.push({ x, y });
                }
            })
        });
        return actions;
    }

    next({ x, y }) {
        if (this.goalTest()) {
            console.error('already reached goal');
            return new XXOO(this.matrix);
        }
        if (x < 0 || x > XXOOCanvasGame.ROWS - 1 || y < 0 || y > XXOOCanvasGame.ROWS - 1 || this.matrix[y][x]) {
            console.error('invalid x y: ', x, y);
            return new XXOO(this.matrix);
        }

        const nextMatrix = this.matrix.map(row => row.slice());
        // action
        nextMatrix[y][x] = this.player();
        return new XXOO(nextMatrix);
    }

    goalTest() {
        if (this.tie()) {
            return true;
        };

        return this.winTest();
    }

    winTest() {
        if (this.hypoTest()) {
            return true;
        }
        for (let i = 0; i < XXOOCanvasGame.COLUMNS; i++) {
            if (this.rowTest(i) || this.columnTest(i)) {
                return true;
            }
        }

        return false;
    }

    utility() {
        if (this.goalTest()) {

            if (this.winTest()) {
                return this.player() === 'X' ? -1 : 1;
            } else {
                return 0;
            }

        } else {
            console.error('Not goal yet');
        }
    }

    tie() {
        return this.matrix.every(row => {
            return row.every(block => {
                return block !== null;
            });
        });
    }

    rowTest(y) {
        if (!this.matrix[y][0]) {
            return false;
        }

        for (let x = 1; x < XXOOCanvasGame.COLUMNS; x++) {
            if (this.matrix[y][x] !== this.matrix[y][x - 1]) {
                return false;
            }
        }

        return true;
    }

    columnTest(x) {
        if (!this.matrix[0][x]) {
            return false;
        }

        for (let y = 1; y < XXOOCanvasGame.COLUMNS; y++) {
            if (this.matrix[y][x] !== this.matrix[y - 1][x]) {
                return false;
            }
        }

        return true;
    }

    hypoTest() {
        let topLeftBottomRight = this.matrix[0][0];
        let bottomLeftTopRight = this.matrix[XXOOCanvasGame.COLUMNS - 1][0];
        for (let i = 1; i < XXOOCanvasGame.COLUMNS; i++) {
            if (this.matrix[i][i] !== this.matrix[i - 1][i - 1]) {
                topLeftBottomRight = false;
                break;
            }
        }
        for (let x = 1, y = 1; x >= 0, y < XXOOCanvasGame.COLUMNS; x-- , y++) {
            if (this.matrix[y][x] !== this.matrix[y - 1][x + 1]) {
                bottomLeftTopRight = false;
                break;
            }
        }

        return topLeftBottomRight || bottomLeftTopRight;
    }
}

XXOO.sign = ['X', 'O'];

var canvas = document.querySelector('#canvas');

var xxoo = new XXOOCanvasGame(canvas);

document.querySelector('#reset-btn').addEventListener('click', () => xxoo.init())
// row win
// xxoo.next({ x: 0, y: 0 })
// xxoo.next({ x: 1, y: 1 })
// xxoo.next({ x: 2, y: 0 })
// xxoo.next({ x: 0, y: 1 })
// xxoo.next({ x: 1, y: 0 })

// col win
// xxoo.next({ x: 2, y: 2 })
// xxoo.next({ x: 1, y: 0 })
// xxoo.next({ x: 0, y: 0 })
// xxoo.next({ x: 1, y: 1 })
// xxoo.next({ x: 0, y: 1 })
// xxoo.next({ x: 1, y: 2 })

// hypo win
// xxoo.next({ x: 0, y: 0 })
// xxoo.next({ x: 0, y: 1 })
// xxoo.next({ x: 1, y: 1 })
// xxoo.next({ x: 0, y: 2 })
// xxoo.next({ x: 2, y: 2 })
