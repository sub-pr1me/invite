import { Routes, Route } from 'react-router-dom'
import Options from './Options'
import CreateAccount from './CreateAccount'
import AccCreatedMessage from './AccCreatedMessage'
import Log_In from './Log_In'
import LayoutMain from './LayoutMain'
import Missing from './Missing'

const MainScreen = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LayoutMain />}>
        <Route path='/' element={<Options />} />
        <Route path='/create_acc' element={<CreateAccount />} />
        <Route path='/acc_created' element={<AccCreatedMessage />} />
        <Route path='/login' element={<Log_In />} />
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
    </>    
  )
}

export default MainScreen