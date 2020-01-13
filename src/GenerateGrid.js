import { CellTypes } from './Properties'
import { GridPositions } from './Utils'

const randomChoice = arr => {
  let index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const generateGrid = size => {
  const baseCell = { cellType: CellTypes.Undecided, activated: false }

  const getPos = (x, y) => y * size + x

  let grid = Array(size * size)
    .fill({ ...baseCell })
    .map((cell, pos) => ({ ...cell, pos }))

  const { up, down, left, right } = GridPositions(grid, size)

  // add size/3 settlements

  // for (let i = 0; i < size / 4; i++) {
  let x = rand(0, size - 1)
  let y = rand(0, size - 1)
  let cell = grid[getPos(x, y)]
  grid[getPos(x, y)] = { ...cell, cellType: CellTypes.Settlement }
  // }

  // add at least 1 food next to a settlement.
  // find a settlement, pick a random direction that leads to another cell, place food.
  let sPos = randomChoice(
    grid.filter(cell => cell.cellType === CellTypes.Settlement)
  ).pos
  let essentialFoodCandidates = [
    up(sPos),
    down(sPos),
    left(sPos),
    right(sPos)
  ].filter(x => x != undefined && x.cellType === CellTypes.Undecided)
  let essentialFoodPosition = randomChoice(essentialFoodCandidates)

  grid[essentialFoodPosition.pos] = {
    ...essentialFoodPosition,
    cellType: CellTypes.Food
  }

  // add at least 1 materials within an n-manhattan-walk of a settlement, where n=size.
  if (size >= 3) {
    let walk = [grid[sPos]] // start at sPos
    while (walk.length < size) {
      let head = walk[walk.length - 1]
      let hPos = head.pos
      let candidates = [up(hPos), down(hPos), left(hPos), right(hPos)].filter(
        x => x != undefined && x.cellType === CellTypes.Undecided
      )
      let pick = randomChoice(candidates)
      walk.push(pick)
    }
    let head = walk[walk.length - 1]
    grid[head.pos] = { ...head, cellType: CellTypes.Materials }
  }

  // for size=8, do a random n-manhattan walk from each settlement, where n=size-2, place a mountain.
  if (size === 8) {
    let walk = [grid[sPos]] // start at sPos
    while (walk.length < 6) {
      let head = walk[walk.length - 1]
      let hPos = head.pos
      let candidates = [up(hPos), down(hPos), left(hPos), right(hPos)].filter(
        x => x != undefined && x.cellType === CellTypes.Undecided
        // &&
        // walk.filter(w => w.pos === x.pos).length === 0
      )
      let pick = randomChoice(candidates)
      walk.push(pick)
    }
    let head = walk[walk.length - 1]
    grid[head.pos] = { ...head, cellType: CellTypes.Mountain }
  }

  return grid
}

export { generateGrid }
