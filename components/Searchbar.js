import styles from '../styles/Home.module.css';
import  { useState, useEffect, useRef } from 'react';

function Searchbar(props) {
  const [autoComplete, setAutoComplete] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [input, setInput] = useState("");
  const [popularDestination, setPopularDestination] = useState([]);
  const [formatDest, setFormatDest] = useState("");
  const [chosenDestination, setChosenDestination] = useState("");
  const [popularFrom, setPopularFrom] = useState([]);



  //1- au clic sur input, PopularDestination chargé OK
  function handleClickInput () {
    setIsClicked(true);
    fetch('http://localhost:8888/popular')
    .then(response => response.json())
    .then(data => {
      console.log("popular destination", data)
      setPopularDestination(data.result)
  })
}

//2- au clic sur une destination, on prend le param destination qui est local name de popular destination 
//ou de search response 
//on garde que le premier devant la région etc. 
async function handleDestinationClick (destination) {
  let firstWord = destination.slice(0, destination.indexOf(","))
  setChosenDestination(firstWord);
  fetchPopularFrom(firstWord.toLowerCase());
}


 //suggérer les trajets populaires depuis chosen destination
 //popularFrom rempli depuis API from chosen destination
 function fetchPopularFrom(place) {
  fetch(`http://localhost:8888/popular/${place}`)
  .then(response => response.json())
  .then(data => {
    setPopularFrom(data.result);
    setInput(" ");
    setPopularDestination([]);
    setAutoComplete([]);
  })
}


//recherche autocomplete, le résultat est envoyé dans state autocomplete
  async function recherche(value) {
    let cleanedInput = value.replace(/[^\w\s]/gi, "");
    cleanedInput = cleanedInput.trim();
    cleanedInput = cleanedInput.toLowerCase();
    cleanedInput = cleanedInput.replace(/\s+/g, "");

    const trips = await fetch(
      `http://localhost:8888/autocomplete?q=${cleanedInput}`
    )
      .then((response) => response.json())
      .then((data) => {
        const result = data.result
        const trips = result.map((item) => ({
          local_name: item.local_name,
          unique_name: item.unique_name,
          serviced: item.serviced
        })
        );
        setAutoComplete(trips);
        console.log("autocomplete", autoComplete);
      });
  }

  //fonction pour montrer l'autocomplete au fur et a mesure
  const handleChange = (event) => {
    setInput(event.target.value);
    recherche(input)
    setPopularFrom([]);
  };

 

  //Vide tous les états si l'utilisateur clique en dehors de la searchbar
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsClicked(false);
          setInput("");
          setChosenDestination("");
          setAutoComplete([]);
          setPopularFrom([]);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  

  //logs de test debug 
  useEffect(() => {
    console.log("popular from state :" , popularFrom)
       }
   , [popularFrom])
 
   useEffect(() => {
     console.log("chosen destination :" , chosenDestination)
        }
    , [chosenDestination])
 
    useEffect(() => {
      console.log("formatdest :" , formatDest)
         }
     , [formatDest])

  return (
    <div className="search-container" ref={wrapperRef}>
      <div className="searchbar">
        <input className={styles.input}
          type="text"
          placeholder="Une destination, demande..."
          onClick={handleClickInput}
          onChange={handleChange}
          value={input}
        />
      </div>
      <div className="results">
        {popularDestination.length > 0 && input === "" && isClicked &&
          <>
            <p>Destinations populaires</p>
            {popularDestination.map((value, index) => {
              return <div key={index} onClick={ () => {handleDestinationClick(value.local_name)}}> {value.local_name}</div>
            })}
          </>
        }
        {input !== "" && autoComplete.length > 0 &&
          <>
            {autoComplete.map((suggestion, index) => (
              <div key={index} onClick={ () => {handleDestinationClick(suggestion.local_name)}}>{suggestion.local_name}</div>
            ))}
      </>
         }
         {input !== "" && popularFrom.length > 0 &&
        //  autoComplete.length < 0 || popularDestination.length < 0 &&
             <>
             <p>Destinations populaires depuis {chosenDestination}</p>
               {popularFrom.map((suggestion, index) => (
                 <div key={index}> {suggestion.local_name}</div>
               ))}
         </>
           }
      </div>
    </div>
  );
}

export default Searchbar;