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

/** @class Life representing the state of the game, with methods for advancing it and drawing it */
class Life {
    /**
     * The current state of the grid: true for each live cell.
     *
     * @type {boolean[][]}
     */
    #state= getCells(maxWidth, maxHeight)

    /**
     * Scratch grid for computing each tick. After a tick it holds the previous generation, and it is overwritten in full on the next tick.
     *
     * @type {boolean[][]}
     */
    #temporaryGrid = getCells(maxWidth, maxHeight)

    #selectColor = createSelectColor()

    /**
     * Creates an instance of Life.
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
        c.clearRect(0, 0, canvas.width, canvas.height)

        // draw cells
        const color = this.#selectColor();
        this.#state.forEach((row, rowNumber) => {
            row.forEach((cell, columnNumber) => {
                if (cell) {
                    c.fillStyle = color
                    c.fillRect(rowNumber, columnNumber, 1, 1)
                }
            })
        });

        // compute the next generation into temporaryGrid, then swap the two grids
        for (let i = 0; i < maxWidth; i++) {
            for (let k = 0; k < maxHeight; k++) {
                this.#temporaryGrid[i][k] = this.#state[i][k] ?
                    this.#shouldSurvive(i, k) : this.#isAliveNextTick(i, k)
            }
        }
        [this.#state, this.#temporaryGrid] = [this.#temporaryGrid, this.#state]
    }

    #countsLiveNeighbours(cellX, cellY) {
        let count = 0
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    continue
                }
                if (this.#state[getX(cellX + x)][getY(cellY + y)]) {
                    count++
                }
            }
        }
        return count
    }

    #shouldSurvive(cellX, cellY) {
        return [2, 3].includes(this.#countsLiveNeighbours(cellX, cellY))
    }

    #isAliveNextTick(cellX, cellY) {
        return this.#countsLiveNeighbours(cellX, cellY) === 3
    }
}

/* ON PAGE LOAD */
const life = new Life(.4)
life.animate()
