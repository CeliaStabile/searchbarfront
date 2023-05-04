import styles from '../styles/Home.module.css';
import Searchbar from './Searchbar';
import  { useState, useEffect } from 'react';
import logo from '../public/logo.png';

function Home() {

 
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.header}>
        <img className={styles.logo} src='logo.png' alt="Logo" />
          <div className={styles.headerLinks}>
          <p>Voyager</p>
          <p>Billets</p>
          <p>Offres</p>
          <p>Compte</p>
          </div>
        </div>
        <h1 className={styles.heading}>Recherchez vos voyages, trajets courts et bien plus encore...
        </h1>
       <Searchbar></Searchbar>  
      </main>
    </div>
  );
}

export default Home;
