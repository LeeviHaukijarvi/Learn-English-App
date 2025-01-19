/**
 * ParentControl component manages the state and UI for adding, updating, and deleting words and tags.
 * UI design is implemented using Material-UI components.
 *
 * @component
 * @returns {JSX.Element} The ParentControl component.
 */

import { useState, useEffect } from 'react';
import { fetchWords, fetchTags } from './apiUtil';
import { Container, MenuItem, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';


function ParentControl() {

    const [statusMessage, setStatusMessage] = useState('');
    const [words, setWords] = useState([]);
    const [finnishWord, setFinnishWord] = useState({});
    const [englishWord, setEnglishWord] = useState({});
    const [tagName, setTagName] = useState('')
    const [tags, setTags] = useState([]);
    const [changes, setChanges] = useState({});

    useEffect(() => {
        loadWords();
        loadTags();
    }, []);
    /**
     * Fetches words from the API and updates the state.
     * @async
     * @function
     */
    async function loadWords() {
        try {
            const fetchedWords = await fetchWords();
            setWords(fetchedWords);
        } catch (error) {
            console.error("Error loading words:", error);
        }
    }

    /**
     * Fetches tags from the API and updates the state.
     * @async
     * @function
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
     * Deletes a tag by its ID.
     * @async
     * @function
     * @param {number} tagId - The ID of the tag to delete.
     */

    async function deleteTag(tagId) {
        try {
            const response = await fetch(`/api/tags/${tagId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("Failed to delete tag");
            }
            loadTags();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Adds new words to the database.
     * @async
     * @function
     * @param {string} finnish - The Finnish word to add.
     * @param {string} english - The English word to add.
     */
    async function addWords(finnish, english) {
        try {
            const response = await fetch(`/api/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"finnishWord": finnish, "englishWord": english})
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setStatusMessage("Words added successfully");
            loadWords();
        } catch (error) {
            console.error(error);
            setStatusMessage(error.message);
        }
    }
    /**
     * Adds a new tag to the database.
     * @async
     * @function
     * @param {string} tag - The tag to add.
     */
    async function addTag(tag) {
        try {
            const response = await fetch(`/api/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"tag": tag})
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            loadTags();
            setStatusMessage("Tag added successfully");
        } catch (error) {
            console.error(error);
            setStatusMessage(error.message);
        }
    }
    /**
     * Updates the tag of a word by its ID.
     * @async
     * @function
     * @param {number} tagId - The ID of the tag to update.
     * @param {number} id - The ID of the word to update.
     */
    async function updateWordsTag(tagId, id) {
        try {
            const response = await fetch(`/api/tag/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"tag": tagId})
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            loadWords();
        } catch (error) {
            console.error(error);
            setStatusMessage(error.message);
        }
    }

    /**
     * Deletes a word by its ID.
     * @async
     * @function
     * @param {number} id - The ID of the word to delete.
     */

    async function handleDeleteWords(id) {
        try {
            const response = await fetch(`/api/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("Failed to delete word");
            }
            loadWords();
            setStatusMessage("Words deleted successfully");
        } catch (error) {
            console.error(error);
            setStatusMessage(error.message);
        }
    }
    /**
     * Updates the words in the database.
     * @async
     * @function
     * @param {string} finnish - The updated Finnish word.
     * @param {string} english - The updated English word.
     * @param {number} id - The ID of the words to update.
     */
    async function updateWords(finnish, english, id) {
        if (!finnish && !english) {
            return setStatusMessage("Cannot save empty words");
        }
        try {
            const response = await fetch(`/api/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"finnishWord": finnish, "englishWord": english})
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setStatusMessage("Words saved successfully");
            loadWords();
        } catch (error) {
            console.error(error);
            setStatusMessage(error.message);
        }
    }
    /**
     * Deletes a tag by its ID and updates the states.
     * @async
     * @function
     * @param {number} tagId - The ID of the tag to delete.
     */
    async function handleDeleteTag(tagId) {
        try {
            await deleteTag(tagId);
            setStatusMessage("Tag deleted successfully");
            loadTags();
        } catch (error) {
            console.error(error);
            setStatusMessage(error.message);
        }
    };
    /**
     * Saves all changes made to the words.
     * @function
     */
    function handleSaveAll() {
        Object.keys(changes).forEach((index) => {
            const word = words[index];
            const finnish = finnishWord[index] || word.finnish_word;
            const english = englishWord[index] || word.english_word;
            updateWords(finnish, english, word.id);
        });
        setChanges({});
    };

    /**
     * Renders a list of words with input fields for editing.
     * @function
     * @param {Array} words - The list of words to render.
     * @returns {JSX.Element[]} The rendered list of words.
     */

    function listWords(words) {
        return words.map((word, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            defaultValue={word.finnish_word}
                            onChange={(e) => {
                                setFinnishWord({ ...finnishWord, [index]: e.target.value });
                                setChanges({ ...changes, [index]: true });
                            }}
                            label="Finnish Word"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            defaultValue={word.english_word}
                            onChange={(e) => {
                                setEnglishWord({ ...englishWord, [index]: e.target.value });
                                setChanges({ ...changes, [index]: true });
                            }}
                            label="English Word"
                            variant="outlined"
                        />
                    </Grid>
                    {tags.length > 0 && (
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Tag</InputLabel>
                                <Select
                                    sx={{ minWidth: 70 }}
                                    onChange={(e) => {
                                        const selectedTagId = e.target.value;
                                        updateWordsTag(selectedTagId, word.id);
                                    }}
                                    value={word.tag || ""}
                                    label="Tag"
                                >
                                    {tags.map((tag) => (
                                        <MenuItem value={tag.id} key={tag.id}>
                                            {tag.tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12} md={2}>
                        <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteWords(word.id)}
                            color="secondary"
                            fullWidth
                            sx={{ color: 'white' }}

                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        ));
    }
    /**
     * Handles adding a new tag.
     * @async
     * @function
     * @param {string} tagName - The name of the tag to add.
     */
    async function handleAddTag(tagName) {
        if (!tagName.trim()) {
            setStatusMessage('Tag name cannot be empty');
            return;
        }
        await addTag(tagName);
        setTagName('');
    }
    /**
     * Handles adding new words.
     * @async
     * @function
     * @param {Event} e - The form submission event.
     */
    async function handleAddWords(e) {
        e.preventDefault();
        const finnish = e.target.finnish.value;
        const english = e.target.english.value;
        if (!finnish || !english) {
            setStatusMessage("Words cannot be empty");
            return;
        }
        addWords(finnish, english);
        loadWords();
    }

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Typography sx={{ m: 2, fontSize: '2rem', fontWeight: 500 }}>
                    Parent Control
                </Typography>

                <Typography sx={{ m: 2 }} variant='h3'>Add new words</Typography>
                <Box sx={{ alignItems: 'left', justifyContent: 'left' }}>
                    <form onSubmit={handleAddWords}>
                        <Grid container spacing={2} alignItems="left">
                            <Grid item xs={12} md={6}>
                                <TextField variant="outlined" label="Finnish" name="finnish" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="outlined" label="English" name="english" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button type="submit" color="secondary" sx={{ color: 'white' }}>
                                        Add Words
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                            <TextField variant="outlined" label="Tag Name" name="tagName"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button type="submit" color="secondary"
                                onClick={() => handleAddTag(tagName)}
                                sx={{ color: 'white'}}
                            >
                                Add Tag
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Typography variant='h3' sx={{ mt: 2 }}>{statusMessage} </Typography>

                {tags.length > 0 && <Typography sx={{ mt: 2 }} variant='h2'>Tags</Typography>}
                <Box sx={{ mb: 2, mt: 2, display: 'flex', flexDirection: 'column', }}>
                    {tags.map((tag) => (
                        <Box key={tag.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant='h4'>{tag.tag}</Typography>
                            <Button sx={{ ml: 2, color: 'white' }} startIcon={<DeleteIcon />} onClick={() => handleDeleteTag(tag.id)}>DELETE</Button>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {listWords(words)}
                <Button
                    onClick={handleSaveAll}
                    sx={{ color: 'white' }}
                    disabled={Object.keys(changes).length === 0}
                >
                    Save
                </Button>
            </Box>
        </Container>
    )
}

export default ParentControl