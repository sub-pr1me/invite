import { Suspense } from 'react'
import { ShowMessageSeconds } from '../functions/ShowMessageSeconds'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'
import Log_In from './Log_In'

const Authorization = () => {
  
  const messagePromise = ShowMessageSeconds(3);
  const { userStatus, setUserStatus, setActiveEmail } = useAuth();

  return (
    <>
    <Suspense fallback={<Loading message={'Your account has been successfully created!'}/>}>
        <Log_In
          messagePromise={messagePromise}
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          setActiveEmail={setActiveEmail}
        />
      </Suspense>
    </>
  )
}

export default Authorization