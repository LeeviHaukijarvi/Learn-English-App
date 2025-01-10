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
