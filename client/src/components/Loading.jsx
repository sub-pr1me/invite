import styles from '../styles/Loading.module.css'
import useAuth from '../hooks/useAuth'

const Loading = ({ userStatus, message }) => {
  const { auth } = useAuth();

  return (
    <div className={`${styles.content}
    ${userStatus === 'acc_created' || !auth ? null : styles.hidden}`}>{message}</div>
  )
}

export default Loading