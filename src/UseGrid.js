import { useState, useEffect } from 'react'
import { CellTypes } from './Properties'
import { generateGrid } from './GenerateGrid'
import { GridPositions } from './Utils'

const countActivated = grid =>
  grid.reduce((acc, cell) => acc + (cell.activated ? 1 : 0), 0)

const getActivatedNeighbours = (pos, grid, size) => {
  const { up, down, left, right } = GridPositions(grid, size)
  return [up(pos), down(pos), left(pos), right(pos)].filter(
    x => x && x.activated
  )
}

const checkConnected = (grid, size) => {
  /*
  Check if the user's cells are connected,
  i.e. there is a single component in the graph represented by the
  activated cells and their neighbours.

  Performs a breadth first search and then checks if there are any
  activated unvisited cells remaining.
  */
  let queue = []
  let visited = {}
  let current = null
  const activatedCells = grid.filter(cell => cell.activated)

  if (activatedCells[0]) queue.push(activatedCells[0].pos)
  else return true

  while (queue.length > 0) {
    current = queue.shift()
    if (!visited[current]) {
      visited[current] = true
      let neighbours = getActivatedNeighbours(current, grid, size)
      for (let neighbour of neighbours) {
        queue.push(neighbour.pos)
      }
    }
  }

  // are there are any active cells that do not have their pos in visited?
  return grid.filter(cell => cell.activated && !visited[cell.pos]).length === 0
}

function useGrid (size) {
  const [grid, setGrid] = useState(() => generateGrid(size))

  const gridByRow = grid.reduce(
    (rows, item) => {
      let head = rows[rows.length - 1]
      return head.length === size
        ? [...rows, [item]]
        : [...rows.slice(0, rows.length - 1), [...head, item]]
    },
    [[]]
  )

  const remainingActives = size - countActivated(grid)

  const getPos = (x, y) => y * size + x

  const updateCell = (x, y, update) => {
    setGrid(prevGrid => {
      return checkValid(x, y, update, prevGrid, false)
    })
  }

  const checkValid = (x, y, update, grid, check) => {
    const pos = getPos(x, y)
    const target = grid[pos]

    // ensure an update would not lead to a disconnected graph.
    if (target !== undefined) {
      let updatedGrid = [...grid]
      updatedGrid[pos] = { ...target, ...update }

      return checkConnected(updatedGrid, size)
        ? check
          ? true
          : updatedGrid
        : check
          ? false
          : grid
    } else {
      return check ? false : grid
    }
  }

  const cellCanDeactivate = (x, y) => {
    return checkValid(x, y, { activated: false }, grid, true)
  }

  const cellHasActivatedNeighbour = (x, y) => {
    const pos = getPos(x, y)
    return getActivatedNeighbours(pos, grid, size).length > 0
  }

  const clearGrid = () => {
    setGrid(prevGrid => prevGrid.map(cell => ({ ...cell, activated: false })))
  }

  /* Message conditions */
  let messages = []

  const oneSettlementActivated =
    grid.filter(
      cell => cell.activated && cell.cellType === CellTypes.Settlement
    ).length === 1
  if (oneSettlementActivated) messages.push('✔️ one settlement')
  else messages.push(`need one settlement (${CellTypes.Settlement})`)

  if (size === 8) {
    const mountainActivated =
      grid.filter(
        cell => cell.activated && cell.cellType === CellTypes.Mountain
      ).length > 0
    if (mountainActivated) messages.push('✔️ at least one mountain')
    else messages.push(`need mountain (${CellTypes.Mountain})`)
  }

  /* Note conditions */

  let notes = []

  // how many non-activated cells are adjacent to more than one activated cell?

  const { up, down, left, right } = GridPositions(grid, size)
  const harbours = grid.filter(cell => {
    const neighbours = [
      up(cell.pos),
      down(cell.pos),
      left(cell.pos),
      right(cell.pos)
    ]
    const activatedNeighbours = neighbours.filter(n => n && n.activated)
    return !cell.activated && activatedNeighbours.length > 1
  }).length
  if (harbours > 0) {
    notes.push(
      `${harbours} harbour${harbours > 1 ? 's' : ''} (fishing possible)`
    )
  }

  const numFoodActivated = grid.filter(
    cell => cell.activated && cell.cellType === CellTypes.Food
  ).length
  if (numFoodActivated === 0 && harbours === 0) {
    notes.push('food may be hard to come by.')
  } else {
    notes.push(`bountiful food x${numFoodActivated}`)
  }

  const numMaterialsActivated = grid.filter(
    cell => cell.activated && cell.cellType === CellTypes.Materials
  ).length
  if (numMaterialsActivated === 0) {
    notes.push('materials may be hard to come by.')
  } else {
    notes.push(`bountiful materials x${numMaterialsActivated}`)
  }

  return {
    grid,
    gridByRow,
    checkConnected,
    remainingActives,
    updateCell,
    cellHasActivatedNeighbour,
    cellCanDeactivate,
    clearGrid,
    messages,
    notes
  }
}

export { useGrid }
