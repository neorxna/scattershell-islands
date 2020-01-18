import React, { useState, useEffect } from 'react'
import { CellTypes } from './Properties'
import { generateGrid } from './GenerateGrid'
import { GridPositions } from './Utils'
import { ResourceTypes } from './scattershell-common/Resources'

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
  // for (let i = 0; i < 100; i++) { generateGrid(size); }
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

  const maxActives = size + Math.floor(size / 2)
  const remainingActives = maxActives - countActivated(grid)
  const noneActivated = remainingActives === maxActives 

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

  const cellCanActivate = (x, y) =>
    remainingActives > 0 &&
    (noneActivated || cellHasActivatedNeighbour(x, y))

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

  const { up, down, left, right } = GridPositions(grid, size)

  const oneSettlementActivated =
    grid.filter(
      cell => cell.activated && cell.cellType === CellTypes.Settlement
    ).length > 0
  const lagoonWithFourNeighbours =
    grid.filter(cell => {
      if (cell.activated && cell.cellType === CellTypes.Lagoon) {
        const activatedNeighbours = [
          up(cell.pos),
          down(cell.pos),
          left(cell.pos),
          right(cell.pos)
        ].filter(n => n && n.activated)
        if (activatedNeighbours.length === 4) return true
      } else {
        return false
      }
    }).length > 0

  if (oneSettlementActivated || lagoonWithFourNeighbours) {
    if (oneSettlementActivated) messages.push('✔ settlement')
    if (lagoonWithFourNeighbours) messages.push('✔ lagoon with four neighbours')
  } else {
    messages.push(
      `need settlement (${CellTypes.Settlement})${
        size > 2 ? ' or lagoon (💧) with four neighbours' : ''
      }`
    )
  }

  if (size > 2) {
    // all settlements must be adjacent to two activated cells
    let settlements = grid.filter(
      cell => cell.activated && cell.cellType === CellTypes.Settlement
    )
    let allHaveAdjacent =
      settlements.filter(s => {
        const activatedNeighbours = [
          up(s.pos),
          down(s.pos),
          left(s.pos),
          right(s.pos)
        ].filter(n => n && n.activated)
        return activatedNeighbours.length > 1
      }).length === settlements.length && settlements.length > 0
    if (allHaveAdjacent) {
      messages.push('✔ settlements have at least two neighbours')
    } else if (settlements.length > 0) {
      messages.push('settlements need at least two neighbours')
    }
  }

  if (size === 8) {
    const mountainActivated =
      grid.filter(
        cell => cell.activated && cell.cellType === CellTypes.Mountain
      ).length > 0
    if (mountainActivated) messages.push('️✔ at least one mountain')
    else messages.push(`need mountain (${CellTypes.Mountain})`)
  }

  /* Note conditions */

  let notes = []

  // how many non-activated cells are adjacent to more than one activated cell?

  useEffect(
    () => {
      setGrid(grid =>
        grid.map(cell => {
          const { up, down, left, right } = GridPositions(grid, size)
          const neighbours = [
            ['u', up(cell.pos)],
            ['d', down(cell.pos)],
            ['l', left(cell.pos)],
            ['r', right(cell.pos)]
          ]
          const activatedNeighbours = neighbours.filter(
            n => n[1] && n[1].activated
          )
          return !cell.activated && activatedNeighbours.length > 1
            ? {
              ...cell,
              harbour: activatedNeighbours.reduce((str, n) => str + n[0], '')
            }
            : { ...cell, harbour: false }
        })
      )
    },
    [grid.filter(c => c.activated).length]
  )

  const harbours = grid.filter(c => c.harbour).length
  if (harbours > 0) {
    notes.push(`${harbours} fishing harbour${harbours > 1 ? 's' : ''}`)
  }

  /*
  const numFoodActivated = grid.filter(
    cell => cell.activated && cell.cellType === CellTypes.Food
  ).length
  if (numFoodActivated === 0 && harbours === 0) {
    notes.push('food may be hard to come by.')
  } else if (numFoodActivated > 0) {
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

  const numGrasslands = grid.filter(
    cell => cell.activated && cell.cellType === CellTypes.Grass
  ).length
  if (numGrasslands > 0) notes.push(`grasslands x${numGrasslands}`)

  const numLagoons = grid.filter(
    cell => cell.activated && cell.cellType === CellTypes.Lagoon
  ).length
  if (numLagoons > 0) notes.push(`lagoon x${numLagoons}`)
*/

  let stuff = {}
  grid.forEach(cell => {
    if (cell.activated && cell.contains && cell.contains.length > 0) {
      cell.contains.forEach(
        item => (stuff[item] = stuff[item] ? stuff[item] + 1 : 1)
      )
    }
  })

  if (Object.entries(stuff).length > 0 && harbours > 0) {
    notes.push(<br />)
  }

  for (let [thing, num] of Object.entries(stuff)) {
    notes.push(`${thing} ${num > 1 ? `x${num}` : ''}`)
  }

  return {
    grid,
    gridByRow,
    checkConnected,
    remainingActives,
    noneActivated,
    updateCell,
    cellHasActivatedNeighbour,
    cellCanActivate,
    cellCanDeactivate,
    clearGrid,
    messages,
    notes
  }
}

export { useGrid }
