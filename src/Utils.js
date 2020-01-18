const GridPositions = (grid, size) => {
  const _up = pos => pos - size
  const _down = pos => pos + size
  const _left = pos => (pos % size === 0 ? undefined : pos - 1)
  const _right = pos => (pos % size === size - 1 ? undefined : pos + 1)

  const up = pos => grid[_up(pos)]
  const down = pos => grid[_down(pos)]

  const left = pos => (pos % size === 0 ? undefined : grid[pos - 1])
  const right = pos => (pos % size === size - 1 ? undefined : grid[pos + 1])

  const upright = pos => grid[_up(_right(pos))]
  const downleft = pos => grid[_down(_left(pos))]
  const upleft = pos => grid[_up(_left(pos))]
  const downright = pos => grid[_down(_right(pos))]

  return { up, down, left, right, upright, downleft, upleft, downright }
}

const maxActiveTiles = size => size + Math.floor(size / 2)

export { GridPositions, maxActiveTiles }
