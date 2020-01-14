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
    noneActivated
  } = props

  const cellView = cellType

  const blocked = (!activated && !canActivate) || (activated && !canDeactivate)
  const click = blocked
    ? {}
    : {
      onClick: e => {
        e.preventDefault()
        if (activated) onDeactivate()
        else onActivate()
      }
    }

  return (
    <td
      className={
        (activated ? 'cell--activated' : 'cell--unactivated') +
        (blocked ? ' cell--blocked' : '') +
        (!canActivate ? ' cell--unactivatable' : '') +
        (cellType === CellTypes.Settlement ? ' cell--settlement' : '') +
        (cellType !== CellTypes.Settlement && noneActivated
          ? ' cell--dim'
          : '') +
        (harbour ? ' cell--harbour' : '')
      }
      {...click}
    >
      {harbour && <div className={`harbour harbour-${harbour}`} />}

      {cellView}
    </td>
  )
}

export { Cell }
