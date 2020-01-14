import { Cell } from './Cell'
import { useGrid } from './UseGrid'
import React from 'react'

function Grid (props) {
  const { islandSize } = props
  const {
    gridByRow,
    remainingActives,
    updateCell,
    cellHasActivatedNeighbour,
    cellCanDeactivate,
    clearGrid,
    messages,
    notes
  } = useGrid(islandSize)

  return (
    <>
      <h2>{remainingActives}</h2>
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
                      canActivate={
                        remainingActives > 0 &&
                        (remainingActives === islandSize ||
                          cellHasActivatedNeighbour(rowN, colN))
                      }
                      canDeactivate={cellCanDeactivate(rowN, colN)}
                      onActivate={() =>
                        updateCell(rowN, colN, { activated: true })
                      }
                      onDeactivate={() =>
                        updateCell(rowN, colN, { activated: false })
                      }
                      noneActivated={remainingActives === islandSize}
                    />
                )
              })}
            </tr>
          )
        })}
      </table>

      <div className={'info'}>
        <a
          href='#'
          onClick={e => {
            e.preventDefault()
            clearGrid()
          }}
        >
          clear
        </a>
        <ul className={'messages'}>
          {messages.map((message, i) => (
            <li key={`${message}${i}`}>{message}</li>
          ))}
        </ul>
        {notes.length > 0 && '-'}
        <ul className={'notes'}>
          {notes.map((note, i) => (
            <li key={`${note}${i}`}>{note}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export { Grid }
