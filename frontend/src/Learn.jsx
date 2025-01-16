/**
 * This component fetches words and tags from the database and displays them for the user to translate.
 * Users can select a tag to filter words, input translations, and check their answers.
 * UI design is implemented using Material-UI components.
 * @component
 * @returns {JSX.Element} The Learn component.
 */

import { useEffect, useState } from 'react';
import './stylesheets/Learn.css';
import { useRef } from "react";
import { fetchWords, fetchTags} from "./apiUtil";
import { Container, MenuItem, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';


function Learn() {
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const inputRefs = useRef([]);
  const [inputColors, setInputColors] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [language, setLanguage] = useState("finnish");
  const [points, setPoints] = useState(0);
  const [disabledInputs, setDisabledInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');

  useEffect(() => {
    loadWords();
    loadTags();
  }, []);

  /**
   * Fetches words from the database and sets the states.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  async function loadWords() {
    try {
      const fetchedWords = await fetchWords();
      setAllWords(fetchedWords);
      setWords(fetchedWords);
    } catch (error) {
      console.error("Error loading words:", error);
    }
  }

  /**
   * Fetches tags from the database and sets the state.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  async function loadTags() {
    try {
      const fetchedTags = await fetchTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  }

  /**
   * Changes the background color of the input based on the result.
   * @function
   * @param {number} index - The index of the input field.
   * @param {string} color - The color to set.
   */
  const changeColor = (index, color) => {
    setInputColors((prevColors) => ({
      ...prevColors,
      [index]: color,
    }));
  };

  /**
   * Clears the input values, colors, and enables the inputs.
   * @function
   */
  const handleRefresh = () => {
    setInputValues({});
    setInputColors({});
    setDisabledInputs({});
    setPoints(0);
  };

  /**
   * Filters words by the selected tag.
   * @function
   * @param {string} tag - The selected tag.
   */
  function changeWordsByTag(tag) {
    if (!tag) {
      setWords(allWords); // Reset to the full list if no tag is selected
    } else {
      const filteredWords = allWords.filter((word) => word.tag === tag);
      setWords(filteredWords);
    }
    handleRefresh();
  }

  /**
   * Lists the words and creates the input fields.
   * @function
   * @param {Array} words - The array of words to display.
   * @param {string} language - The language to translate to.
   * @returns {JSX.Element[]} The list of word elements.
   */
  function listWords(words, language) {
    return words.map((word, index) => {
      let toBeTranslated = '';
      let translated = '';
      let placeholder = '';

      // Set the correct word to be translated and the correct translation
      if (language === "finnish") {
        toBeTranslated = word.finnish_word.charAt(0).toUpperCase() + word.finnish_word.slice(1);
        translated = word.english_word.charAt(0).toUpperCase() + word.english_word.slice(1);
      } else if (language === "english") {
        toBeTranslated = word.english_word.charAt(0).toUpperCase() + word.english_word.slice(1);
        translated = word.finnish_word.charAt(0).toUpperCase() + word.finnish_word.slice(1);
      }

      return (
        <div key={index}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: 'secondary.main' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Grid>
                <Typography
                  variant='h3'
                  sx={{ m: 1, textAlign: "center", color: "white" }}
                >
                  {toBeTranslated}
                </Typography>
              </Grid>

              <Grid>
                <input
                  ref={(ref) => (inputRefs.current[index] = ref)} // Set the unique ref for each input
                  type="text"
                  placeholder={placeholder}
                  value={inputValues[index] || ""}
                  style={{ backgroundColor: inputColors[index] }}
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
              </Grid>

              <Grid>
                <Button
                  sx={{ mt: 1, bgcolor: 'white' }}
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
                </Button>
              </Grid>
            </Box>
          </Paper>
        </div>
      );
    });
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h1" sx={{ my: 4, textAlign: "center", color: "primary.main" }}>
          Learn English
        </Typography>
        <Typography variant='h3'>
          Points: {points}
        </Typography>

        <Box>
          <FormControl sx={{ m: 3, minWidth: 80 }}>
            <InputLabel id="tag-select">Tag</InputLabel>
            <Select
              onChange={(e) => {
                const tagId = parseInt(e.target.value);
                changeWordsByTag(tagId);
                setSelectedTagId(tagId);
              }}
              autoWidth
              label="Tag"
              value={selectedTagId}
            >
              <MenuItem value={0}>All</MenuItem>
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {listWords(words, language)}
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={handleRefresh}
          sx={{ mr: 1, color: "white" }}
          variant="contained"
          color="secondary"
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            if (language === "finnish") {
              setLanguage("english");
            } else if (language === "english") {
              setLanguage("finnish");
            }
            handleRefresh();
          }}
          variant="contained"
          color="secondary"
          sx={{ m: 2, color: "white" }}
        >
          Flip
        </Button>
      </Box>
    </Container>
  );
}


export default Learn;
