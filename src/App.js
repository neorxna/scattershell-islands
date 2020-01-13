import React from 'react'
import './App.css'
import { Grid } from './Grid'
import { IslandSizes } from './Properties'

function App () {
  return (
    <div className='App'>
      {<Grid islandSize={IslandSizes.Tiny} />}
      <hr />
      {<Grid islandSize={IslandSizes.Small} />}
      <hr />
      {<Grid islandSize={IslandSizes.Medium} />}
      <hr />
      {<Grid islandSize={IslandSizes.Large} />}
    </div>
  )
}

export default App
