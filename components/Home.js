import styles from '../styles/Home.module.css';
import Searchbar from './Searchbar';
import  { useState, useEffect } from 'react';

function Home() {

 
  return (
    <div>
      <main className={styles.main}>
       <Searchbar></Searchbar>  
      </main>
    </div>
  );
}

export default Home;
