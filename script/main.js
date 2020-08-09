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
 * Returning a array of arrays, representing a grid. Width and height are passed as parameters.
 *
 * @param {number} width
 * @param {number} height 
 */
function getCells(width, height) {
    let cells = new Array(width)
    for (let i = 0; i < width; i++) {
        cells[i] = new Array(height);
    }
    return cells
}

/** @class Animation representing the state of the canvas, with methods for executing the animation */
class Animation{
    static defaultSeed = [[12, 12], [14, 13], [11, 14], [12, 14], [15, 14], [16, 14], [17, 14]]

    constructor(prob=null) {
        this.state = prob ? this.randomSeed(prob) : this.defaultSeeding()
        this.animate()
    }

    defaultSeeding() {
        let list = getCells(maxWidth, maxHeight)
        for (let i = 0; i < maxWidth; i++) {
            for (let k = 0; k < maxHeight; k++) {
                list[i][k] = false
            }
        } 
        Animation.defaultSeed.forEach(coord => list[coord[0]][coord[1]] = true)
        return list
    }

    randomSeed(prob) {
        let list = getCells(maxWidth, maxHeight)
        for (let i = 0; i < maxWidth; i++) {
            for (let k = 0; k < maxHeight; k++) {
                list[i][k] = Math.random() < prob
            }
        } 
        return list
    }

    drawCells() {
        this.state.forEach((row, rowNumber) => {
            row.forEach((cell, columnNUmber) => {
                if (cell) {
                    c.fillStyle = ['#5DA614','#8C5D42', '#F27E63'][Math.random() * 3 | 0]
                    c.fillRect(rowNumber, columnNUmber, 1, 1)
                }
            })
        });
    }

    countsLiveNeighbours(cellX, cellY) {
        let cells_status = []
        for (let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                cells_status.push(this.state[getX(cellX + x)][getY(cellY + y)])
            }
        }
        cells_status.splice(4, 1)   // removing cell (cellX, cellY)
        return cells_status.reduce((x, y) => x + y)
    }

    isSurvived(cellX, cellY) {
        return [2, 3].includes(this.countsLiveNeighbours(cellX, cellY)) 
    }

    isAliveNextTick(cellX, cellY) {
        return this.countsLiveNeighbours(cellX, cellY) === 3
    }
    
    updateState() {
        let newState = getCells(maxWidth, maxHeight)
        for (let i = 0; i < maxWidth; i++) {
            for (let k = 0; k < maxHeight; k++) {
                newState[i][k] = this.state[i][k] ? 
                this.isSurvived(i, k) : this.isAliveNextTick(i, k)
            }
        } 
        this.state = newState
    }

    nextTick() {
        c.beginPath()
        c.clearRect(0, 0, canvas.width, canvas.height)
        this.drawCells() 
        this.updateState()
    }

    animate() {
        requestAnimationFrame(() => this.animate())
        this.nextTick()
    }
}

/* ON PAGE LOAD */
const animation = new Animation(.2)
