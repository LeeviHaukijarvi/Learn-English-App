import { useEffect, useState } from 'react';
import './App.css';
import { useRef } from "react";

function Learn() {
  const [words, setWords] = useState([]);
  const inputRefs = useRef([]);
  const [inputColors, setInputColors] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [language, setLanguage] = useState("finnish");
  const [points, setPoints] = useState(0);
  const [disabledInputs, setDisabledInputs] = useState({});


  useEffect(() => {
    fetchWords();
  }, []);


  const changeColor = (index, color) => {
    setInputColors((prevColors) => ({
      ...prevColors,
      [index]: color,
    }));
  };

  const handleRefresh = () => {
    setInputValues({});
    setInputColors({});
    setDisabledInputs({});
    setPoints(0);
  };

  async function fetchWords() {
    try {
      const response = await fetch(`/api/`);
      const words = await response.json();
      setWords(words);
    } catch (error) {
      console.error(error);
    }
  }

  function listWords(words, language) {
    return words.map((word, index) => {
      let toBeTranslated = '';
      let translated = '';
      let placeholder = '';
      if (language === "finnish") {
        toBeTranslated = word.finnish_word;
        translated = word.english_word;
        placeholder = "In English";
      } else if (language === "english") {
        toBeTranslated = word.english_word;
        translated = word.finnish_word;
        placeholder = "In Finnish";
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
