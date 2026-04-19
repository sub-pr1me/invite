import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useEffectEvent } from 'react'
import ProfileTopSection from './ProfileTopSection'
import UserProfile from './UserProfile'
import LikesLoading from './LikesLoading'
import Carousel from './Carousel'

const HomeScreen = ({ profileData, setProfileData }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();
  const getRandomKey = () => crypto.randomUUID();

  

  return (
    <>
      <div className={`${styles.homescreen_container}`}>
        <div className={`${styles.edge_fader}`}></div>        
        <Carousel />
        <ProfileTopSection />
      </div>
    </>
  );
};

export default HomeScreen