import React from 'react'
import styles from '../styles/Loading.module.css'

const Loading = ({ message }) => {
  return (
    <div className={`${styles.content}`}>{message}</div>
  )
}

export default Loading