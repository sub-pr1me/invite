import './App.css';
import { Suspense, useState } from 'react';
import { fetchVenues } from './functions/FetchVenues';
import Loading from './components/Loading';
import MainScreen from './components/MainScreen';
import Venues from './components/Venues';

function App() {
    const [userStatus, setUserStatus] = useState('logged_out');
    const venuesPromise = fetchVenues();

  return (
    <>
      <MainScreen 
          userStatus={userStatus}
          setUserStatus={setUserStatus}
      />
      <Suspense fallback={<Loading userStatus={userStatus} message={'LOADING...'}/>}>        
        <Venues
          venuesPromise={venuesPromise}
          userStatus={userStatus}
        />
      </Suspense>      
    </>
  )
}

export default App