import useAuth from '../hooks/useAuth'
import RequireAuth from './RequireAuth'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './Home'
import Clients from './Clients'
import Profile from './Profile'
import Auctions from './Auctions'
import Stats from './Stats'
import Missing from './Missing'

const Dashboard = () => {
  
  const { auth } = useAuth();
  
  if (!auth) return null;

  return (
    <>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<RequireAuth />}>
          <Route index element={<Home />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/auctions' element={<Auctions />} />
          <Route path='/stats' element={<Stats />} />
        </Route>

        <Route path='*' element={<Missing />} />

      </Route>
    </Routes>
    </>
  )
}

export default Dashboard