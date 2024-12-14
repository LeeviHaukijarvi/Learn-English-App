import { useState, useEffect } from 'react';
import { fetchWords } from './apiUtil';


function ParentControl() {
    const [statusMessage, setStatusMessage] = useState('');
    const [words, setWords] = useState([]);

    useEffect(() => {
        loadWords();
    }, []);

    async function loadWords() {
        try {
            const fetchedWords = await fetchWords();
            setWords(fetchedWords);
        } catch (error) {
            console.error("Error loading words:", error);
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

    function listWords(words) {
        return words.map((word, index) => {
            return (
                <div key={index}>
                    <p>{word.finnish_word} - {word.english_word}</p>
                    <button onClick={() => deleteWords(word.id)}>Delete</button>
                </div>
            )
        })


    }

    return (
        <div>
        <h1>Parent Control</h1>
        <p>Add new words</p>
        <form onSubmit={(e) => {
            e.preventDefault();
            const finnish = e.target.finnish.value;
            const english = e.target.english.value;
            addWords(finnish, english);
        }}>
            <label>
                Finnish:
                <input type="text" name="finnish" />
            </label>
            <label>
                English:
                <input type="text" name="english" />
            </label>
            <button type="submit">Add</button>
            </form>
            <p>{statusMessage}</p>
            <h2>All Words</h2>
            {listWords(words)}
        </div>
    )

}

export default ParentControl