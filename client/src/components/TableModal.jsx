import styles from '../styles/TableModal.module.css'
const TableModal = ({ id, modal }) => {
  return (
    <>
      <div className={`${styles.container} ${styles[`m${id}`]} ${!modal ? styles.hidden : null}`}>
        <button>Customize</button>
        <button>Auction</button>
      </div>
    </>    
  )
}

export default TableModal