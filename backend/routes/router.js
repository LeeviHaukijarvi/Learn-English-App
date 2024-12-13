const express = require("express");
const router = express.Router();
const database = require("../database/crudrepository");

router.get("/", async (req, res) => {
    try {
        const allWords = await database.getAllWords();
        return res.status(200).json(allWords)
    } catch (err) {

        return res.status(500).json({ error: "Failed to fetch words", details: err.message });
    }

})

router.post("/", async (req, res) => {
    const { finnishWord, englishWord } = req.body;

    try {
        await database.insertFinnishAndEnglish(finnishWord, englishWord)
        res.status(201).json({ message: "Word added successfully" });

    } catch (err) {
        console.error(err)
        res.status(400).json({ error: "Failed to add words", details: err.message });
    }
})

router.delete("/:myId", async (req, res) => {
    const id = parseInt(req.params.myId);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const result = await database.deleteWord(id);
        if (result === 0) {
            return res.status(404).json({ error: "No word found with the provided ID" });
        }
        return res.status(204).send();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete word", details: err.message });
    }

})


module.exports = router;