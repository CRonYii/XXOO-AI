import * as XXOO from './XXOO';

export class XXOOCanvasGame {

    public static BLOCK_SIZE: number = 100;
    public static WIDTH: number = XXOO.Game.SIDE * XXOOCanvasGame.BLOCK_SIZE;
    public static HEIGHT: number = XXOO.Game.SIDE * XXOOCanvasGame.BLOCK_SIZE;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private state: XXOO.Game;

    private count: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.init();

        this.canvas.addEventListener('click', ({ layerX, layerY }) => {
            const x = Math.floor(layerX / XXOOCanvasGame.BLOCK_SIZE);
            const y = Math.floor(layerY / XXOOCanvasGame.BLOCK_SIZE);
            if (this.next({ x, y }) && !this.state.endTest()) {
                this.AI();
            }
        });
    }

    init() {
        const matrix = [];
        for (let i = 0; i < XXOO.Game.SIDE; i++) {
            const sub = [];
            for (let j = 0; j < XXOO.Game.SIDE; j++) {
                sub.push(XXOO.Sign.EMPTY);
            }
            matrix.push(sub);
        }
        this.state = new XXOO.Game(matrix);
        this.drawBackground();
    }

    AI() {
        this.count = 0;
        let action: XXOO.Action;
        if (this.state.player() === XXOO.Sign.O) {
            action = this.minValue(this.state).action;
        } else {
            action = this.maxValue(this.state).action;
        }
        this.next(action);
        console.log(this.count);
    }

    maxValue(state: XXOO.Game): { value: number, action: XXOO.Action } {
        this.count++;
        if (state.endTest()) {
            return { value: state.utility(), action: null };
        }
        let value = -Infinity;
        let action: XXOO.Action;
        state.actions().forEach((a: XXOO.Action) => {
            const v = this.minValue(state.next(a)).value;
            if (v > value) {
                value = v;
                action = a;
            }
        });
        return { value, action };
    }

    minValue(state: XXOO.Game): { value: number, action: XXOO.Action } {
        this.count++;
        if (state.endTest()) {
            return { value: state.utility(), action: null };
        }
        let value = +Infinity;
        let action: XXOO.Action;
        state.actions().forEach((a: XXOO.Action) => {
            const v = this.maxValue(state.next(a)).value;
            if (v < value) {
                value = v;
                action = a;
            }
        });
        return { value, action };
    }

    next({ x, y }: XXOO.Action) {
        if (this.state.endTest() || this.state.isInvalidClick({ x, y })) {
            return false;
        }
        this.state = this.state.next({ x, y });
        if (this.state.endTest()) {
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

        for (let i = 1; i <= XXOO.Game.SIDE - 1; i++) {
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