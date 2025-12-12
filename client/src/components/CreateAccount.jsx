import React from 'react'
import styles from '../styles/CreateAccount.module.css'

const CreateAccount = ({ userAction }) => {
  return (
    <div className={`${userAction !== 'create_acc' ? styles.hidden : null}`}>CREATE ACCOUNT</div>
  )
}

export default CreateAccount