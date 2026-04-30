import getImageUrl from '../functions/getImageUrl';
import styles from '../styles/Image.module.css'

export default function Image({ cloudName, publicId, alt, profileGallery }) {
  const imageSource = getImageUrl({
    cloudName,
    publicId,
    transformations: 'q_auto:low,f_auto,c_fill,w_auto'
  });

  return <img src={imageSource} alt={alt} 
    className={`${profileGallery ? styles.profile : null}`} 
  />;
}