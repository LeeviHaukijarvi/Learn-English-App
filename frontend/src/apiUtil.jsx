/**
 * Fetches words from the API.
 *
 * @async
 * @function fetchWords
 * @returns {Promise<Object>} The data from the API.
 * @throws {Error} If the response is not ok or if there is a network error.
 */


export async function fetchWords() {
    try {
        const response = await fetch(`/api/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Fetches tags from the API.
 *
 * @async
 * @function fetchTags
 * @returns {Promise<Object>} The data from the API.
 * @throws {Error} If the response is not ok or if there is a network error.
 */
export async function fetchTags() {
    try {
        const response = await fetch(`/api/tags/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
