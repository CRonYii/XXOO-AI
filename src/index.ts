import { XXOOCanvasGame } from './XXOOCanvasGame';

const canvas = <HTMLCanvasElement> document.querySelector('#canvas');

const xxoo = new XXOOCanvasGame(canvas);

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
