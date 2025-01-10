import { useState, useEffect } from 'react';
import { fetchWords, fetchTags } from './apiUtil';


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



    async function loadWords() {
        try {
            const fetchedWords = await fetchWords();
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


    async function deleteWords(id) {
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

    function handleSaveAll() {
        Object.keys(changes).forEach((index) => {
            const word = words[index];
            const finnish = finnishWord[index] || word.finnish_word;
            const english = englishWord[index] || word.english_word;
            updateWords(finnish, english, word.id);
        });
        setChanges({});
    };


    function listWords(words) {
        return words.map((word, index) => (
                <div key={index}>
                <input
                    type="text"
                    defaultValue={word.finnish_word}
                    onChange={(e) => {
                        setFinnishWord({ ...finnishWord, [index]: e.target.value });
                        setChanges({ ...changes, [index]: true });
                    }}
                />
                <input
                    type="text"
                    defaultValue={word.english_word}
                    onChange={(e) => {
                        setEnglishWord({ ...englishWord, [index]: e.target.value });
                        setChanges({ ...changes, [index]: true });
                    }}
                />
                    <button onClick={() => deleteWords(word.id)}>X</button>
                    <select
                        onChange={(e) => {
                            const selectedTagId = e.target.value;
                            updateWordsTag(selectedTagId, word.id);
                        }}
                        value={word.tag || ""}
                    >
                        <option value="">No tag</option>
                        {tags.map((tag) => (
                            <option value={tag.id} key={tag.id}>
                                {tag.tag}
                            </option>
                        ))}
                    </select>
                </div>
            )
        )
    }

    async function handleAddTag(tagName) {
        if (!tagName.trim()) {
            setStatusMessage('Tag name cannot be empty');
            return;
        }
        await addTag(tagName);
        setTagName('');
        setStatusMessage('Tag added successfully');
    }

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
    };

    return (
        <div>
        <h1>Parent Control</h1>
        <p>Add new words</p>
        <form onSubmit={handleAddWords}>
            <label>
                Finnish:
                <input type="text" name="finnish" />
            </label>
            <label>
                English:
                <input type="text" name="english" />
            </label>
            <button type="submit">Add Words</button>
        </form>
            <input
                type='text'
                value={tagName}
                placeholder='Tag name'
                onChange={(e) => setTagName(e.target.value)}
            />
            <button onClick={() => handleAddTag(tagName)}>Add Tag</button>
            <p>{statusMessage}</p>

            {tags.length > 0 && <h2>Tags</h2>}
            {tags.map((tag) => (
                <div key={tag.id}>
                    <span>{tag.tag}</span>
                    <button onClick={() => handleDeleteTag(tag.id)}>X</button>
                </div>
            ))}
            <h2>All Words</h2>
            {listWords(words)}
            <button onClick={handleSaveAll} disabled={Object.keys(changes).length === 0}>
                Save
            </button>
        </div>
    )

}

export default ParentControl