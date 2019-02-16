import { XXOOAI } from './XXOOCanvasGame'
import * as XXOO from './XXOO';

interface Minimax {
    value: number,
    action: XXOO.Action,
    array: Minimax[];
}

export class XXOOSearchingAI implements XXOOAI {

    private count: number;

    play(state: XXOO.Game) {
        this.count = 0;
        let result: Minimax;
        if (state.player === XXOO.Sign.O) {
            result = this.minValue(state);
        } else {
            result = this.maxValue(state);
        }
        console.log(this.count, result);
        return result.action;
    }

    maxValue(state: XXOO.Game): Minimax {
        this.count++;
        if (state.isEnd) {
            if (this.count % 100000 === 0) console.log(this.count);
            return { value: state.utility, action: null, array: null };
        }
        let value = -Infinity;
        let action: XXOO.Action;
        const array = state.actions.map((a: XXOO.Action) => {
            const result = this.minValue(state.next(a));
            const v = result.value;
            if (v > value) {
                value = v;
                action = a;
            }
            return result;
        });
        return { value, action, array };
    }

    minValue(state: XXOO.Game): Minimax {
        this.count++;
        if (state.isEnd) {
            if (this.count % 100000 === 0) console.log(this.count);
            return { value: state.utility, action: null, array: null };
        }
        let value = +Infinity;
        let action: XXOO.Action;
        const array = state.actions.map((a: XXOO.Action) => {
            const result = this.maxValue(state.next(a));
            const v = result.value;
            if (v < value) {
                value = v;
                action = a;
            }
            return result;
        });
        return { value, action, array };
    }
}