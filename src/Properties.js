const CellTypes = {
  Undecided: '?',
  Food: '🌱',
  Materials: '🛠️',
  Settlement: '📌',
  Grass: '🌲',
  Lagoon: '💧',
  Desert: '🌵',
  Mountain: '⛰️'
}

const CellTypesLabel = {
  [CellTypes.Undecided]: 'undecided',
  [CellTypes.Food]: 'food',
  [CellTypes.Materials]: 'materials',
  [CellTypes.Settlement]: 'settlement',
  [CellTypes.Grass]: 'grass',
  [CellTypes.Lagoon]: 'lagoon',
  [CellTypes.Desert]: 'desert',
  [CellTypes.Mountain]: 'mountain'
}

const IslandSizes = {
  Tiny: 2,
  Small: 3,
  Medium: 5,
  Large: 8
}

export { CellTypes, IslandSizes, CellTypesLabel }
