import React from 'react'
import { CellTypes } from './Properties'

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

  return (
    <td
      className={
        (activated ? 'cell--activated' : 'cell--unactivated') +
        (blocked ? ' cell--blocked' : '') +
        (!canActivate ? ' cell--unactivatable' : '') +
        (cellType === CellTypes.Settlement ? ' cell--settlement' : '') +
        (cellType !== CellTypes.Settlement &&
        cellType !== CellTypes.Lagoon &&
        noneActivated
          ? ' cell--dim'
          : '') +
        (harbour ? ' cell--harbour' : '') +
        (allActivated && !harbour && !activated ? ' cell--ocean' : '')
      }
      {...click}
    >
      {harbour && <div className={`harbour harbour-${harbour}`} />}

      {cellView}
    </td>
  )
}

export { Cell }
