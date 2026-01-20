import { Routes, Route } from 'react-router-dom'
import LayoutDashboard from './LayoutDashboard'
import Home from './Home'
import Clients from './Clients'
import Profile from './Profile'
import Auctions from './Auctions'
import Stats from './Stats'

const Dashboard = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LayoutDashboard />}>
          <Route index element={<Home />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/auctions' element={<Auctions />} />
          <Route path='/stats' element={<Stats />} />
      </Route>
    </Routes>
    </>
  )
}

export default Dashboard