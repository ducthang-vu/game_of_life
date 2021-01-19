# Conway's Game of Life
Online [here](https://ducthang-vu.github.io/game_of_life/).

This is an implementation of the most famous "Game of Life", also known simply as Life, which is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input.

The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the
following transitions occur:
* Any live cell with two or three neighbors survives.
* Any dead cell with three live neighbors becomes a live cell.
* All other live cells die in the next generation. Similarly, all other dead cells stay dead.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick.
Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.

For futher insights see [here](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).


## Requirements
None.

## Feature
In this implementation, the field is a 150x100 grid, which is also a toroid. On the page load, a random number of cell (approximately 20%) shall be populated. This constitutes the seed of the system.

To start a new game, reload the page.


## Usage
Download the repository and open index.html.
