import './App.css'
import MainScreen from './components/MainScreen'
import Dashboard from './components/Dashboard'
import Missing from './components/Missing'
import RequireAuth from './components/RequireAuth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path='/*' element={<MainScreen />} />
          <Route element={<RequireAuth />}>
            <Route path='/dashboard/*' element={<Dashboard />} />
          </Route>          
          <Route path='*' element={<Missing />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App