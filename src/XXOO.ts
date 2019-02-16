export enum Sign {
    X = 'X',
    O = 'O',
    EMPTY = ' '
}

export interface Action {
    x: number,
    y: number
}

export class Game {

    public static readonly Players: Sign[] = [Sign.X, Sign.O];
    public static readonly SIDE: number = 3;

    public readonly matrix: Sign[][];

    constructor(matrix: Sign[][]) {
        this.matrix = matrix;
    }

    /**
     * compute the current player based on the number of signs on the board
     */
    player(): Sign {
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
        return Game.Players[result];
    }

    actions(): Action[] {
        if (this.endTest()) {
            return [];
        }
        const actions: Action[] = [];
        this.matrix.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block === Sign.EMPTY) {
                    actions.push({ x, y });
                }
            })
        });
        return actions;
    }

    next({ x, y }: Action) {
        if (this.endTest()) {
            console.error('already reached goal');
            return this;
        }
        if (this.isInvalidClick({ x, y })) {
            console.error('invalid x y: ', x, y);
            return this;
        }

        const nextMatrix = this.matrix.map(row => row.slice());
        // action
        nextMatrix[y][x] = this.player();
        return new Game(nextMatrix);
    }

    endTest(): boolean {
        if (this.tie()) {
            return true;
        };

        return this.winTest();
    }

    /**
     * if X won, return 1,
     * if O won, return -1,
     * if tie, return 0
     */
    utility(): number {
        if (this.endTest()) {

            if (this.winTest()) {
                return this.player() === Sign.X ? -1 : 1;
            } else {
                return 0;
            }

        } else {
            console.error('Not goal yet');
        }
    }

    isInvalidClick({ x, y }: Action) {
        return x < 0 || x > Game.SIDE - 1 || y < 0 || y > Game.SIDE - 1 || this.matrix[y][x] !== Sign.EMPTY;
    }

    private winTest(): boolean {
        if (this.hypoTest()) {
            return true;
        }
        for (let i = 0; i < Game.SIDE; i++) {
            if (this.rowTest(i) || this.columnTest(i)) {
                return true;
            }
        }

        return false;
    }

    private tie(): boolean {
        return this.matrix.every(row => {
            return row.every(block => {
                return block !== Sign.EMPTY;
            });
        });
    }

    private rowTest(y) {
        if (this.matrix[y][0] === Sign.EMPTY) {
            return false;
        }

        for (let x = 1; x < Game.SIDE; x++) {
            if (this.matrix[y][x] !== this.matrix[y][x - 1]) {
                return false;
            }
        }

        return true;
    }

    private columnTest(x) {
        if (this.matrix[0][x] === Sign.EMPTY) {
            return false;
        }

        for (let y = 1; y < Game.SIDE; y++) {
            if (this.matrix[y][x] !== this.matrix[y - 1][x]) {
                return false;
            }
        }

        return true;
    }

    private hypoTest() {
        let topLeftBottomRight: boolean = this.matrix[0][0] !== Sign.EMPTY;
        let bottomLeftTopRight: boolean = this.matrix[Game.SIDE - 1][0] !== Sign.EMPTY;
        if (!(topLeftBottomRight || bottomLeftTopRight)) {
            return false;
        }
        for (let i = 1; i < Game.SIDE; i++) {
            if (this.matrix[i][i] !== this.matrix[i - 1][i - 1]) {
                topLeftBottomRight = false;
                break;
            }
        }
        for (let x = 1, y = 1; y < Game.SIDE; x-- , y++) {
            if (this.matrix[y][x] !== this.matrix[y - 1][x + 1]) {
                bottomLeftTopRight = false;
                break;
            }
        }

        return topLeftBottomRight || bottomLeftTopRight;
    }
}
