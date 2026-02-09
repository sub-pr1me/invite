import { Routes, Route } from 'react-router-dom'
import Options from './Options'
import CreateAccount from './CreateAccount'
import ActionMessage from './ActionMessage'
import Log_In from './Log_In'
import LayoutMain from './LayoutMain'

const MainScreen = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LayoutMain />}>
        <Route path='/' element={<Options />} />
        <Route path='/create_acc' element={<CreateAccount />} />
        <Route path='/message' element={<ActionMessage />} />
        <Route path='/login' element={<Log_In />} />
      </Route>
    </Routes>
    </>    
  )
}

export default MainScreen