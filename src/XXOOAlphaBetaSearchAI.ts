import { XXOOAI } from './XXOOCanvasGame'
import * as XXOO from './XXOO';

interface Minimax {
    value: number,
    action?: XXOO.Action,
}

export default class XXOOAlphaBetaSearchAI implements XXOOAI {

    private count: number;

    play(state: XXOO.Game) {
        this.count = 0;
        let result: Minimax;
        if (state.player === XXOO.Sign.O) {
            result = this.minValue(state, -Infinity, +Infinity);
        } else {
            result = this.maxValue(state, -Infinity, +Infinity);
        }
        console.log(this.count, result);
        return result.action;
    }

    maxValue(state: XXOO.Game, alpha: number, beta: number): Minimax {
        this.count++;
        if (state.isEnd) {
            if (this.count % 100000 === 0) console.log(this.count);
            return { value: state.utility };
        }
        let value = -Infinity;
        let action: XXOO.Action;
        for (let a of state.actions) {
            const result = this.minValue(state.next(a), alpha, beta);
            const v = result.value;
            if (v > value) {
                value = v;
                action = a;
            }
            if (v > beta) {
                return { value }
            }
            alpha = Math.max(alpha, v);
        }
        return { value, action };
    }

    minValue(state: XXOO.Game, alpha: number, beta: number): Minimax {
        this.count++;
        if (state.isEnd) {
            if (this.count % 100000 === 0) console.log(this.count);
            return { value: state.utility };
        }
        let value = +Infinity;
        let action: XXOO.Action;
        for (let a of state.actions) {
            const result = this.maxValue(state.next(a), alpha, beta);
            const v = result.value;
            if (v < value) {
                value = v;
                action = a;
            }
            if (v <= alpha) {
                return { value }
            }
            beta = Math.min(beta, v);
        }
        return { value, action };
    }
}