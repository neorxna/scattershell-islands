import React, { useState } from 'react'
import './App.css'
import { Grid } from './Grid'
import { IslandSizes } from './Properties'

function App () {
  const [currentSize, updateSize] = useState(IslandSizes.Tiny)

  return (
    <div className='App'>
      {Object.values(IslandSizes).map(size =>
        size === currentSize ? (
          <Grid
            islandSize={size}
            currentSize={currentSize}
            updateSize={updateSize}
          />
        ) : (
          ''
        )
      )}
    </div>
  )
}

export default App
