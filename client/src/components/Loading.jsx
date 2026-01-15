import styles from '../styles/Loading.module.css'
import useAuth from '../hooks/useAuth'

const Loading = ({ message }) => {
  const { userStatus } = useAuth();

  return (
    <div className={`${styles.content}
    ${userStatus === 'acc_created' || userStatus === 'logged_out' ? null : styles.hidden}`}>{message}</div>
  )
}

export default Loading