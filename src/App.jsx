import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Room from './pages/Room'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-full">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/play" element={<Room/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
    
  )
}

export default App
