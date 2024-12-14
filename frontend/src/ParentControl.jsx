import { useState } from 'react';

function ParentControl() {
    const [statusMessage, setStatusMessage] = useState('');

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
            } else {
                setStatusMessage("Words added successfully");
            }
        } catch (error) {
            console.error(error);
            setStatusMessage("Failed to add words");
        }
    }

    async function deleteWords(id) {




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
        </div>
    )

}

export default ParentControl