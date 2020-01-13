import React from 'react'

function Cell (props) {
  const {
    onActivate,
    onDeactivate,
    activated,
    cellType,
    canActivate,
    canDeactivate
  } = props

  const cellView = cellType

  const activatedView = canDeactivate ? (
    <a
      className={'cell--activated'}
      href='#'
      onClick={e => {
        e.preventDefault()
        onDeactivate()
      }}
    >
      {cellView}
    </a>
  ) : (
    <span className={'cell--undeactivatable'}>{cellView}</span>
  )
  const unactivatedView = canActivate ? (
    <a
      className={'cell--unactivated'}
      href='#'
      onClick={e => {
        e.preventDefault()
        onActivate()
      }}
    >
      {cellView}
    </a>
  ) : (
    <span className={'cell--unactivatable'}>{cellView}</span>
  )

  return activated ? activatedView : unactivatedView
}

export { Cell }
