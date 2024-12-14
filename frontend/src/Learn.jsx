import { useEffect, useState } from 'react';
import './App.css';
import { useRef } from "react";
import { fetchWords } from "./apiUtil";

function Learn() {
  const [words, setWords] = useState([]);
  const inputRefs = useRef([]);
  const [inputColors, setInputColors] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [language, setLanguage] = useState("finnish");
  const [points, setPoints] = useState(0);
  const [disabledInputs, setDisabledInputs] = useState({});



  useEffect(() => {
    loadWords();
  }, []);

  // Load words from the database
  async function loadWords() {
    try {
      const fetchedWords = await fetchWords();
      setWords(fetchedWords);
    } catch (error) {
      console.error("Error loading words:", error);
    }
  }


  // Change the background color of the input based on the result
  const changeColor = (index, color) => {
    setInputColors((prevColors) => ({
      ...prevColors,
      [index]: color,
    }));
  };

  // Clear the input values, colors and enable the inputs
  const handleRefresh = () => {
    setInputValues({});
    setInputColors({});
    setDisabledInputs({});
    setPoints(0);
  };


  function listWords(words, language) {
    return words.map((word, index) => {
      let toBeTranslated = '';
      let translated = '';
      let placeholder = '';

      // Set the correct word to be translated and the correct translation
      if (language === "finnish") {
        toBeTranslated = word.finnish_word;
        translated = word.english_word;
        placeholder = "In English";
      } else if (language === "english") {
        toBeTranslated = word.english_word;
        translated = word.finnish_word;
        placeholder = "Suomeksi";
      }

      return (
        <div key={index}>
          <p>{toBeTranslated}</p>
          <input
            ref={(ref) => (inputRefs.current[index] = ref)} // Set the unique ref for each input
            type="text"
            placeholder={placeholder}
            value={inputValues[index] || ""}
            style={{ backgroundColor: inputColors[index]}}
            disabled={disabledInputs[index]}
            onChange={(e) => {
              const value = e.target.value;
              setInputValues((prevValues) => ({
                ...prevValues,
                [index]: value,
              }));
              // Reset background color when user types
              changeColor(index, "");
            }}
          />
          <button
            onClick={() => {
              // Check if the input value matches the English word
              // If it does, set the background color to green, otherwise red
              const inputValue = inputRefs.current[index].value;
              const formattedValue = inputValue.trim().toLowerCase();
              if (formattedValue === translated) {
                setPoints(points + 1);
                changeColor(index, "green");
                setDisabledInputs((prevDisabled) => ({
                  ...prevDisabled,
                  [index]: true,
                }));
              } else {
                changeColor(index, "red");
              }
            }}

            // Disable the button if the input is correct
            disabled={disabledInputs[index]}

          >
            Check
          </button>
        </div>
      );
    });
  }

  return (
    <>
      <h1>Learn English</h1>
      <p>Points: {points}</p>
      {listWords(words, language)}
      <button onClick={handleRefresh}>Clear</button>
      <button onClick={() => {
        if (language === "finnish") {
          setLanguage("english");
        } else if (language === "english") {
          setLanguage("finnish");
        }
        handleRefresh();
      }}>Flip</button>

    </>
  );
}

export default Learn;
