import styles from '../styles/EditGallery.module.css'
import useAuth from '../hooks/useAuth'

const EditGallery = () => {
  
  const { auth } = useAuth();

  
  return (
    <>
      <div className={`${styles.gallery_container}`}>
        
      </div>
    </>
  );
};

export default EditGallery