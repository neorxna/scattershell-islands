import { Cell } from './Cell'
import React, { useState } from 'react'
import { IslandSizes } from './Properties'
import { maxActiveTiles } from './Utils'
import { useGrid } from './UseGrid'

function Grid (props) {
  const { islandSize, currentSize, updateSize } = props

  const {
    gridByRow,
    remainingActives,
    noneActivated,
    updateCell,
    cellCanDeactivate,
    cellCanActivate,
    clearGrid,
    messages,
    notes
  } = useGrid(islandSize)

  const [dragging, setDragging] = useState(false)

  return (
    <div className={'grid-container'}>
      <div className={'size-picker'}>
        {Object.values(IslandSizes).map(size => {
          const maxTilesForSize = maxActiveTiles(size)
          const currentLabel = `${remainingActives} remaining tiles`
          return size === currentSize ? (
            <h2 title={currentLabel} aria-label={currentLabel}>
              {remainingActives}
            </h2>
          ) : (
            <span className={'size-choice'}>
              <a
                href='#'
                onClick={() => updateSize(size)}
                aria-label={`change to ${maxTilesForSize} size`}
              >
                {maxTilesForSize}
              </a>
            </span>
          )
        })}
      </div>

      <div className={'table-container'}>
        <table aria-label={'game tiles'}>
          {gridByRow.map((row, colN) => {
            return (
              <tr>
                {row.map((cell, rowN) => {
                  return (
                    <Cell
                      cellType={cell.cellType}
                      activated={cell.activated}
                      harbour={cell.harbour}
                      canActivate={cellCanActivate(rowN, colN)}
                      canDeactivate={cellCanDeactivate(rowN, colN)}
                      onActivate={() =>
                        updateCell(rowN, colN, { activated: true })
                      }
                      onDeactivate={() =>
                        updateCell(rowN, colN, { activated: false })
                      }
                      noneActivated={noneActivated}
                      allActivated={remainingActives === 0}
                      dragging={dragging}
                      setDragging={setDragging}
                    />
                  )
                })}
              </tr>
            )
          })}
        </table>
      </div>
      <div className={'restart'}>
        <a
          href='#'
          onClick={e => {
            e.preventDefault()
            clearGrid()
          }}
          aria-label={'restart game (deactivates all tiles)'}
        >
          restart
        </a>
      </div>
      <div className={'info'}>
        <ul className={'messages'}>
          {messages.map((message, i) => (
            <li key={`${i}${new Date().getTime()}`}>{message}</li>
          ))}
        </ul>
        <ul className={'notes'}>
          {notes.map((note, i) => (
            <li key={`${i}${new Date().getTime()}`}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { Grid }
