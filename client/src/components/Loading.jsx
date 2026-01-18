import styles from '../styles/Loading.module.css'
import useAuth from '../hooks/useAuth'

const Loading = ({ message }) => {
  const { auth } = useAuth();

  return (
    <div className={`${styles.content}
    ${!auth ? null : styles.hidden}`}>{message}</div>
  )
}

export default Loading