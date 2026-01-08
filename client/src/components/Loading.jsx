import React from 'react'
import styles from '../styles/Loading.module.css'

const Loading = ({ message, userStatus }) => {
  return (
    <div className={`${styles.content}
                     ${userStatus !=='logged_out' ? styles.hidden : null}`}>{message}</div>
  )
}

export default Loading