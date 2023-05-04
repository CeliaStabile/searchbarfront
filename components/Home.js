import styles from '../styles/Home.module.css';
import Searchbar from './Searchbar';
import  { useState, useEffect } from 'react';


function Home() {

 
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.heading}>Recherchez vos voyages, trajets courts et bien plus encore...
        </h1>
       <Searchbar></Searchbar>  
      </main>
    </div>
  );
}

export default Home;
