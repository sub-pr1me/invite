import styles from '../styles/Options.module.css'
import { Link } from 'react-router-dom'

const Options = () => {

  return (
    <>
    <div className={`${styles.btns_div}`}>
      <Link to='/create_acc'><button>Create Account</button></Link>
      <Link to='/login'><button>Log In</button></Link>
    </div>
    </>
  )
}

export default Options