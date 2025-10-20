import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DragDropGrid from './DragDropGrid';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DragDropGrid />
    </>
  )
}

export default App
