class XXOOCanvasGame {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.init();

        this.canvas.addEventListener('click', ({ layerX, layerY }) => {
            const x = Math.floor(layerX / 100);
            const y = Math.floor(layerY / 100);
            this.next({ x, y });
            if (!this.state.goalTest()) {
                this.AI();
            }
        });
    }

    init() {
        this.state = new XXOO([
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]);
        this.drawBackground();
    }

    AI() {
        const actions = this.state.actions();
        const choices = actions.map((action) => {
            return this.minValue(this.state.next(action));
        });
        const bestMatch = choices.reduce((prev, cur, curI, array) => {
            if (cur > array[prev]) {
                return curI;
            } else {
                return prev;
            }
        }, 0);
        console.log(choices);
        this.next(actions[bestMatch]);
    }

    maxValue(state) {
        if (state.goalTest()) {
            return state.utility();
        }
        let value = -Infinity;
        state.actions().forEach((action) => {
            value = Math.max(value, this.minValue(state.next(action)));
        });
        return value;
    }

    minValue(state) {
        if (state.goalTest()) {
            return state.utility();
        }
        let value = +Infinity;
        state.actions().forEach((action) => {
            value = Math.min(value, this.maxValue(state.next(action)));
        });
        return value;
    }

    next({ x, y }) {
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
    }

    drawBackground() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, 300, 300);
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeRect(0, 0, 300, 300);

        for (let i = 1; i <= 2; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(100 * i, 0);
            this.ctx.lineTo(100 * i, 300);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, 100 * i);
            this.ctx.lineTo(300, 100 * i);
            this.ctx.stroke();
        }
    }

    drawOptions() {
        this.state.matrix.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block) {
                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = '50px arial';
                    this.ctx.fillText(block, 100 * x + 30, 100 * y + 60);
                }
            })
        });
    }

}

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
        if (x < 0 || x > 2 || y < 0 || y > 2 || this.matrix[y][x]) {
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
        for (let i = 0; i < 3; i++) {
            if (this.hypoTest() || this.rowTest(i) || this.columnTest(i)) {
                return true;
            }
        }

        return false;
    }

    utility() {
        if (this.goalTest()) {

            if (this.tie()) {
                return 0;
            } else {
                return this.player() === 'X' ? -1 : 1;
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

        for (let x = 1; x < 3; x++) {
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

        for (let y = 1; y < 3; y++) {
            if (this.matrix[y][x] !== this.matrix[y - 1][x]) {
                return false;
            }
        }

        return true;
    }

    hypoTest() {
        let topLeftBottomRight = this.matrix[0][0];
        let bottomLeftTopRight = this.matrix[2][0];
        for (let i = 1; i < 3; i++) {
            if (this.matrix[i][i] !== this.matrix[i - 1][i - 1]) {
                topLeftBottomRight = false;
                break;
            }
        }
        for (let x = 1, y = 1; x >= 0, y < 3; x-- , y++) {
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
