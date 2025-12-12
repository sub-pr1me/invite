import './App.css';
import { Suspense } from 'react';
import { fetchVenues } from './functions/FetchVenues';
import Loading from './components/Loading';
import WelcomeScreen from './components/WelcomeScreen';
import Venues from './components/Venues';

function App() {

  const venuesPromise = fetchVenues();

  return (
    <>
      <WelcomeScreen />
      <Suspense fallback={<Loading />}>        
        <Venues venuesPromise={venuesPromise}/>
      </Suspense>      
    </>
  )
}

export default App