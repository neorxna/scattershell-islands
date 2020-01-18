import React from 'react'
import './App.css'
import { Grid } from './Grid'
import { IslandSizes } from './Properties'

function App () {
  return (
    <div className='App'>
      {<Grid islandSize={IslandSizes.Tiny} />}
      {<Grid islandSize={IslandSizes.Small} />}
      {<Grid islandSize={IslandSizes.Medium} />}
      {<Grid islandSize={IslandSizes.Large} />}
    </div>
  )
}

export default App
