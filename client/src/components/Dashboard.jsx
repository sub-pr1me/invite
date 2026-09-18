import { Routes, Route, useParams } from 'react-router-dom'
import { useState } from 'react'
import LayoutDashboard from './LayoutDashboard'
import Home from '../pages/Home'
import Clients from '../pages/Clients'
import Profile from '../pages/Profile'
import Auctions from '../pages/Auctions'
import Cashier from '../pages/Cashier'
import Explore from '../pages/Explore'
import HomeScreen from './HomeScreen'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { setActive } = useAuth();
  const [auctions, setAuctions] = useState(null);
  const { userId } = useParams();

  return (
    <>
    <Routes>
      <Route path='/' element={<LayoutDashboard />}>
          <Route index element={<Home setAuctions={setAuctions}/>}/>
          <Route path=':userId' element={
            <HomeScreen key={userId}/>} 
          />
          <Route path='/explore' element={
            <Explore/>}
          />
          <Route path='/clients' element={
            <Clients/>} 
            />
          <Route path='/profile' element={
            <Profile/>}
            />
          <Route path='/auctions' element={
            <Auctions 
              auctions={auctions} 
              setAuctions={setAuctions}/>} 
            />
          <Route path='/cashier' element={<Cashier setActive={setActive}/>} />
      </Route>
    </Routes>
    </>
  );
};

export default Dashboard