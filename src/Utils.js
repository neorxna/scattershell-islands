const GridPositions = (grid, size) => {
  const up = pos => grid[pos - size]
  const down = pos => grid[pos + size]
  const left = pos => (pos % size === 0 ? undefined : grid[pos - 1])
  const right = pos => (pos % size === size - 1 ? undefined : grid[pos + 1])
  return { up, down, left, right }
}

export { GridPositions }
