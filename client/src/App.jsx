import './App.css'
import MainScreen from './components/MainScreen'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <MainScreen />
    <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App