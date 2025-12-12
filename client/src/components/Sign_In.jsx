import React from 'react'
import styles from '../styles/Sign_In.module.css'

const Sign_In = ({ userAction }) => {
  return (
    <div className={`${userAction !== 'sign_in' ? styles.hidden : null}`}>SIGN IN</div>
  )
}

export default Sign_In