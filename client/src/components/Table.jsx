import styles from '../styles/Table.module.css'
const Table = ({ id, active, modal }) => {
  return (
    <>
      <div className={`
        ${styles.container} 
        ${styles[`t${id}`]} 
        ${active ? styles.active : styles.inactive}
        ${modal ? styles.selected : null}`}>
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