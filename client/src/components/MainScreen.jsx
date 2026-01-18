import { Routes, Route } from 'react-router-dom'
import Options from './Options'
import CreateAccount from './CreateAccount'
import Authorization from './Authorization'
import LayoutMain from './LayoutMain'
import Missing from './Missing'

const MainScreen = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LayoutMain />}>
        <Route path='/' element={<Options />} />
        <Route path='/create_acc' element={<CreateAccount />} />
        <Route path='/login' element={<Authorization />} />
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
    </>    
  )
}

export default MainScreen