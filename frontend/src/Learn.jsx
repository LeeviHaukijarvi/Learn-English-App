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

  // Load words from the database
  async function loadWords() {
    try {
      const fetchedWords = await fetchWords();
      setAllWords(fetchedWords);
      setWords(fetchedWords);
    } catch (error) {
      console.error("Error loading words:", error);
    }
  }


  // Load tags from the database
  async function loadTags() {
    try {
      const fetchedTags = await fetchTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error loading tags:", error);
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

  function changeWordsByTag(tag) {
    if (!tag) {
      setWords(allWords); // Reset to the full list if no tag is selected
    } else {
      const filteredWords = allWords.filter((word) => word.tag === tag);
      setWords(filteredWords);
    }
    handleRefresh();
  }

  // List the words and create the input fields
  function listWords(words, language) {
    return words.map((word, index) => {
      let toBeTranslated = '';
      let translated = '';
      let placeholder = '';

      // Set the correct word to be translated and the correct translation
      if (language === "finnish") {
        toBeTranslated = word.finnish_word;
        translated = word.english_word;
      } else if (language === "english") {
        toBeTranslated = word.english_word;
        translated = word.finnish_word;
      }

      return (
        <div key={index}>

            <Paper elevation={3}
                  sx={{ p: 2 }}
                >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                  <Grid>
                    <Typography variant='h3'
                      sx={{ m: 1, textAlign: "center", color: "primary.main" }}
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
                  </Grid>

                  <Grid>
                    <Button
                      sx={{ mt: 1 }}
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

          <Grid container spacing={2}
            sx={{justifyContent: 'center'}}
          >
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
          sx={{ mr: 1 }}
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
            sx={{ m: 2 }}
          >
            Flip
          </Button>
      </Box>
    </Container>
  );
}


export default Learn;
