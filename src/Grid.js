import { Cell } from './Cell'
import { useGrid } from './UseGrid'
import React, { useState } from 'react'

function Grid (props) {
  const { islandSize } = props
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
    <div className={'game-container'}>
      <div className={'grid-container'}>
        <h2>{remainingActives}</h2>
        <div className={'table-container'}>
          <table>
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
      <a
        href='#'
        onClick={e => {
          e.preventDefault()
          clearGrid()
        }}
      >
        restart
      </a>
    </div>
  )
}

export { Grid }
