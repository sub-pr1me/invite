import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import LayoutDashboard from './LayoutDashboard'
import Home from './Home'
import Clients from './Clients'
import Profile from './Profile'
import Auctions from './Auctions'
import Cashier from './Cashier'
import Explore from './Explore'
import HomeScreen from './HomeScreen'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { setActive } = useAuth();
    const [auctions, setAuctions] = useState(null);
    const [visit, setVisit] = useState(null);
  return (
    <>
    <Routes>
      <Route path='/' element={<LayoutDashboard />}>
          <Route index element={<Home setAuctions={setAuctions}/>}/>
          <Route path=':userId' element={<HomeScreen key={visit} setVisit={setVisit}/>} />
          <Route path='/explore' element={<Explore setActive={setActive}/>} />
          <Route path='/clients' element={<Clients setActive={setActive}/>} />
          <Route path='/profile' element={<Profile setActive={setActive}/>} />
          <Route path='/auctions' element={<Auctions setActive={setActive} auctions={auctions} setAuctions={setAuctions}/>} />
          <Route path='/cashier' element={<Cashier setActive={setActive}/>} />
      </Route>
    </Routes>
    </>
  );
};

export default Dashboard