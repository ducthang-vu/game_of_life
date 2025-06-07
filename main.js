/* GLOBAL VARIABLES (CANVAS) */
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');


/* FIX CANVAS */
canvas.width = 600
canvas.height = 400


/* GLOBAL VARIABLES (CANVAS MEASURES)*/
const scale = 4
c.scale(scale, scale)
const maxWidth = canvas.width / scale
const maxHeight = canvas.height / scale

/* UTILITIES*/ 
/* Making canvas a toroid */
function getX(rawX) {
    return (rawX + maxWidth) % maxWidth
}

function getY(rawY) {
    return (rawY + maxHeight) % maxHeight
}

/**
 * Returning an array of arrays, representing a grid. Width and height are passed as parameters.
 *
 * @param {number} width
 * @param {number} height
 * @return {boolean[][]} An array of arrays, each containing boolean values initialized to false.
 */
function getCells(width, height) {
    return Array.from({ length: width }, () => new Array(height).fill(false));
}

function createSelectColor() {
    const colors = ['#589830', '#2c6e8f', '#95a331'];
    let current = 0;
    return () => {
        const color = colors[current];
        current = (current + 1) % colors.length;
        return color;
    }
}

/** @class Animation representing the state of the canvas, with methods for executing the animation */
class Animation{
    /**
     * The next state of the game, to be drawn in the next tick.
     *
     * @type {boolean[][]}
     */
    #state= getCells(maxWidth, maxHeight)

    #selectColor = createSelectColor()

    /**
     * Creates an instance of Animation.
     *
     * @constructor
     * @param {number} [probability] The probability of any cell to be alive at the initial state, should be between 0
     *                               (excluded) and 1.
     */
    constructor(probability) {
        for (let i = 0; i < maxWidth; i++) {
            for (let k = 0; k < maxHeight; k++) {
                this.#state[i][k] = Math.random() < probability
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate())
        this.#nextTick()
    }

    #nextTick() {
        c.beginPath()
        c.clearRect(0, 0, canvas.width, canvas.height)

        // draw cells
        const color = this.#selectColor();
        this.#state.forEach((row, rowNumber) => {
            row.forEach((cell, columnNUmber) => {
                if (cell) {
                    c.fillStyle = color
                    c.fillRect(rowNumber, columnNUmber, 1, 1)
                }
            })
        });

        // create next state to be drawn in the next tick
        let newState = getCells(maxWidth, maxHeight)
        for (let i = 0; i < maxWidth; i++) {
            for (let k = 0; k < maxHeight; k++) {
                newState[i][k] = this.#state[i][k] ?
                    this.#shouldSurvived(i, k) : this.#isAliveNextTick(i, k)
            }
        }
        this.#state = newState
    }

    #countsLiveNeighbours(cellX, cellY) {
        let cells_status = []
        for (let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                cells_status.push(this.#state[getX(cellX + x)][getY(cellY + y)])
            }
        }
        cells_status.splice(4, 1)   // removing cell (cellX, cellY)
        return cells_status.reduce((x, y) => x + y)
    }

    #shouldSurvived(cellX, cellY) {
        return [2, 3].includes(this.#countsLiveNeighbours(cellX, cellY))
    }

    #isAliveNextTick(cellX, cellY) {
        return this.#countsLiveNeighbours(cellX, cellY) === 3
    }
}

/* ON PAGE LOAD */
const animation = new Animation(.4)
animation.animate()
