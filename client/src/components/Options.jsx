import styles from '../styles/Options.module.css'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const Options = () => {

  const { auth } = useAuth();

  return (
    <>
    <div className={`${styles.btns_div} ${auth ? styles.hidden : null}`}>
      <Link to='/create_acc'><button>Create Account</button></Link>
      <Link to='/login'><button>Log In</button></Link>
    </div>
    </>
  )
}

export default Options