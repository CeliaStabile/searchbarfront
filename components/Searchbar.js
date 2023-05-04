import styles from "../styles/Searchbar.module.css";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHouse } from "@fortawesome/free-solid-svg-icons";

function Searchbar() {
  const [autoComplete, setAutoComplete] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [input, setInput] = useState("");
  const [popularDestination, setPopularDestination] = useState([]);
  const [formatDest, setFormatDest] = useState("");
  const [chosenDestination, setChosenDestination] = useState("");
  const [popularFrom, setPopularFrom] = useState([]);

  //1- au clic sur input, PopularDestination chargé OK
  function handleClickInput() {
    setIsClicked(true);
    fetch("https://searchbarback.vercel.app/popular")
      .then((response) => response.json())
      .then((data) => {
        console.log("popular destination", data);
        setPopularDestination(data.result);
      });
  }

  //2- au clic sur une destination, on prend le param destination qui est local name de popular destination
  //ou de search response
  //on garde que le premier devant la région etc.
  async function handleDestinationClick(destination) {
    let firstWord = destination.slice(0, destination.indexOf(","));
    setChosenDestination(firstWord);
    fetchPopularFrom(firstWord.toLowerCase());
  }

  //suggérer les trajets populaires depuis chosen destination
  //popularFrom rempli depuis API from chosen destination
  function fetchPopularFrom(place) {
    fetch(`https://searchbarback.vercel.app/popular/${place}`)
      .then((response) => response.json())
      .then((data) => {
        setPopularFrom(data.result);
        setInput(" ");
        setPopularDestination([]);
        setAutoComplete([]);
      });
  }

  //recherche autocomplete, le résultat est envoyé dans state autocomplete
  async function recherche(value) {
    let cleanedInput = value.replace(/[^\w\s]/gi, "");
    cleanedInput = cleanedInput.trim();
    cleanedInput = cleanedInput.toLowerCase();
    cleanedInput = cleanedInput.replace(/\s+/g, "");

    const trips = await fetch(
      `https://searchbarback.vercel.app/autocomplete?q=${cleanedInput}`
    )
      .then((response) => response.json())
      .then((data) => {
        const result = data.result;
        const trips = result.map((item) => ({
          local_name: item.local_name,
          unique_name: item.unique_name,
          serviced: item.serviced,
        }));
        setAutoComplete(trips);
        console.log("autocomplete", autoComplete);
      });
  }

  //fonction pour montrer l'autocomplete au fur et a mesure
  const handleChange = (event) => {
    setInput(event.target.value);
    recherche(input);
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
    console.log("popular from state :", popularFrom);
  }, [popularFrom]);

  useEffect(() => {
    console.log("chosen destination :", chosenDestination);
  }, [chosenDestination]);

  useEffect(() => {
    console.log("formatdest :", formatDest);
  }, [formatDest]);

  return (
    <div className={styles.searchContainer} ref={wrapperRef}>
      <div className={styles.searchbar}>
        <input
          className={styles.input}
          type="text"
          placeholder="Une destination, demande..."
          onClick={handleClickInput}
          onChange={handleChange}
          value={input}
        />
        <div className={styles.searchIconContainer}>
          <FontAwesomeIcon
            className={styles.searchIcon}
            icon={faMagnifyingGlass}
          />
        </div>
      </div>
      <div className={styles.autosuggestContainer}>
        {popularDestination.length > 0 && input === "" && isClicked && (
          <div className={styles.resultContainer}>
            <div className={styles.city}>
              <p className={styles.titles}>Destinations populaires</p>

              {popularDestination.map((value, index) => {
                return (
                  <div
                    className={styles.resultText}
                    key={index}
                    onClick={() => handleDestinationClick(value.local_name)}
                  >
                    <FontAwesomeIcon
                      className={styles.houseIcon}
                      icon={faHouse}
                    />
                        <p>Ville</p>
                    {value.local_name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {input !== "" && autoComplete.length > 0 && (
          <div className={styles.resultContainer}>
            {autoComplete.map((suggestion, index) => (
              <div className={styles.result}>
                <FontAwesomeIcon className={styles.houseIcon} icon={faHouse} />
                <div className={styles.resultText}>
                <div
                  key={index}
                  onClick={() => {
                    handleDestinationClick(suggestion.local_name);
                  }}
                >
                  <p>Ville</p>
                  {suggestion.local_name}
                </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {input !== "" && popularFrom.length > 0 && (
          <div className={styles.resultContainer}>
            <p className={styles.titles}>
              Destinations populaires depuis {chosenDestination}
            </p>
            {popularFrom.map((suggestion, index) => (
              <div className={styles.result}>
                <FontAwesomeIcon className={styles.houseIcon} icon={faHouse} />
                <p>Ville</p>
                <div className={styles.resultText} key={index}>
                  {" "}
                  {suggestion.local_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Searchbar;
