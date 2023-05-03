import styles from '../styles/Home.module.css';
import Searchbar from './Searchbar';
import  { useState, useEffect } from 'react';

function Home() {

 
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.headerContainer}>
       <Searchbar></Searchbar>
       </div>
      </main>
    </div>
  );
}

export default Home;
