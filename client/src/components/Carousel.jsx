import styles from '../styles/Carousel.module.css'
import useAuth from '../hooks/useAuth'
import Thumb from './Thumb'

const Carousel = ({ profileData, role }) => {
  const { auth } = useAuth();
  return (
    <>
    <div className={`${styles.carousel}`}>
      <div className={`${styles.album}`}>
          {!role ?
            auth?.album?.map(item => {
            return (
            <Thumb
              key={auth?.album?.indexOf(item)}
              cloudName={item.split('/')[3]}
              publicId={item.split('/')[7].split('.')[0]}
              alt={''}
            />
            )})
            :
            profileData?.album?.map(item => {
            return (
            <Thumb
              key={profileData?.album.indexOf(item)}
              cloudName={item.split('/')[3]}
              publicId={item.split('/')[7].split('.')[0]}
              alt={''}
            />
            )})
          }           
      </div>
      <div className={`${styles.album}`} aria-hidden>
          {!role ?
            auth?.album?.map(item => {
            return (
            <Thumb
              key={auth?.album?.indexOf(item)}
              cloudName={item.split('/')[3]}
              publicId={item.split('/')[7].split('.')[0]}
              alt={''}
            />
            )})
            :
            profileData?.album?.map(item => {
            return (
            <Thumb
              key={profileData?.album.indexOf(item)}
              cloudName={item.split('/')[3]}
              publicId={item.split('/')[7].split('.')[0]}
              alt={''}
            />
            )})
          }           
      </div>
    </div>
    </>
  )
}

export default Carousel