import './App.css'
import MainScreen from './components/MainScreen'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path='/*' element={<MainScreen />} />
          <Route path='/dashboard/*' element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App