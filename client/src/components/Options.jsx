import styles from '../styles/Options.module.css'

const Options = ({ auth, handleClick, userAction }) => {
  return (
    <>
    <div className={`${styles.btns_div} ${userAction || auth ? styles.hidden : null}`}>
        <button onClick={() => handleClick('create_acc')}>Create Account</button>
        <button onClick={() => handleClick('sign_in')}>Log In</button>
    </div>
    </>
  )
}

export default Options