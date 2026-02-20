import styles from '../styles/Table.module.css'
const Table = ({ id, active }) => {
  return (
    <>
      <div className={`${styles.container} ${active ? styles.active : styles.inactive}`}>
        {
          active
          ? <div>{`Table ${id}`}</div>
          : <div></div>
        }
      </div>
    </>    
  )
}

export default Table