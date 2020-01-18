import React from 'react'
import { CellTypes, CellTypesLabel } from './Properties'

function Cell (props) {
  const {
    onActivate,
    onDeactivate,
    activated,
    cellType,
    harbour,
    canActivate,
    canDeactivate,
    noneActivated,
    allActivated,
    dragging,
    setDragging
  } = props

  const cellView = cellType

  const blocked = (!activated && !canActivate) || (activated && !canDeactivate)
  const click = blocked
    ? {
      onMouseUp: e => {
        setDragging(false)
        e.preventDefault()
      }
    }
    : {
      onMouseDown: e => {
        setDragging(true)
        if (activated) onDeactivate()
        else {
          onActivate()
        }
        e.preventDefault()
      },
      onMouseOver: e => {
        if (dragging) {
          if (activated) onDeactivate()
          else onActivate()
        }
      },
      onMouseUp: e => {
        setDragging(false)
        e.preventDefault()
      }
    }

  const unactivatable = !canActivate
  const settlementCell = cellType === CellTypes.Settlement
  const dim =
    cellType !== CellTypes.Settlement &&
    cellType !== CellTypes.Lagoon &&
    noneActivated
  const ocean = allActivated && !harbour && !activated

  return (
    <td
      className={
        (activated ? 'cell--activated' : 'cell--unactivated') +
        (blocked ? ' cell--blocked' : '') +
        (unactivatable ? ' cell--unactivatable' : '') +
        (settlementCell ? ' cell--settlement' : '') +
        (dim ? ' cell--dim' : '') +
        (harbour ? ' cell--harbour' : '') +
        (ocean ? ' cell--ocean' : '')
      }
      title={`${activated ? 'activated' : 'unactivated'} ${
        CellTypesLabel[cellType]
      }`}
      aria-label={`${CellTypesLabel[cellType]}, ${
        activated ? 'activated' : 'unactivated'
      }.${harbour ? ' harbour.' : ''} can${blocked ? 'not' : ''} ${
        activated ? 'de' : ''
      }activate${
        allActivated && !activated
          ? ' (no tiles left).'
          : blocked
            ? ' (would create two islands).'
            : '.'
      }`}
      {...click}
    >
      {cellView}
    </td>
  )
}

export { Cell }
