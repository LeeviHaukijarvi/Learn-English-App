import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const apiURL = '/api/locations'

  const [locationsList, setLocationsList] = useState()

  useEffect(() => {fetchIt()}, [])

  async function fetchIt() {
    try {
      let response = await fetch(apiURL)
      let locations = await response.json()

      setLocationsList(locations.map((location) => (
        <li key={location.id}>
          {location.latitude}, {location.longitude}
        </li>
      )))

    } catch (error) {
        console.log(error)
    }
  }




  return (
    <>
      <h1>Locations</h1>
      <ul>{locationsList}</ul>
    </>
  )
}

export default App
