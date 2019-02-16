import * as XXOO from './XXOO';
import { XXOOSearchingAI } from './XXOOSearchingAI';

export interface XXOOAI {
    play: (state: XXOO.Game) => XXOO.Action
}

export class XXOOCanvasGame {

    public static BLOCK_SIZE: number = 100;
    public static WIDTH: number = XXOO.Game.SIDE * XXOOCanvasGame.BLOCK_SIZE;
    public static HEIGHT: number = XXOO.Game.SIDE * XXOOCanvasGame.BLOCK_SIZE;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private state: XXOO.Game;
    private AI: XXOOAI = new XXOOSearchingAI();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.init();

        this.canvas.addEventListener('click', ({ layerX, layerY }) => {
            const x = Math.floor(layerX / XXOOCanvasGame.BLOCK_SIZE);
            const y = Math.floor(layerY / XXOOCanvasGame.BLOCK_SIZE);
            if (this.next({ x, y }) && !this.state.isEnd) {
                this.AIPlay();
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

    AIPlay() {
        if (this.AI)
            this.next(this.AI.play(this.state));
    }

    next({ x, y }: XXOO.Action) {
        if (this.state.isEnd || this.state.isInvalidClick({ x, y })) {
            return false;
        }
        this.state = this.state.next({ x, y });
        if (this.state.isEnd) {
            switch (this.state.utility) {
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