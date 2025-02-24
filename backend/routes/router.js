/**
 * @fileoverview
 * Express router providing various routes for the Learn-English-App.
 */
require('dotenv').config();
const express = require("express");
const router = express.Router();
const database = require("../database/crudrepository");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @function GET /api/api/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.get("/", async (req, res) => {
    try {
        const allWords = await database.getAllWords();
        return res.status(200).json(allWords)
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch words", details: err.message });
    }
})
/**
 * @function GET /api/users/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.get("/users", async (req, res) => {
    try {
        const users = await database.getUsers();
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch words", details: err.message });
    }
})
/**
 * @function GET /api/tags/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.get("/tags", async (req, res) => {
    try {
        const tags = await database.getTags();
        return res.status(200).json(tags)
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch tags", details: err.message });
    }
})
/**
 * @function POST /api/register/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await database.insertPasswordAndUsername(username, hashedPassword)
        res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err });
    }
})
/**
 * @function POST /api/login/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await database.getUser(username);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY);

        res.json({ token, user: { username: user.username } });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @function POST /api/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.post("/", async (req, res) => {
    const { finnishWord, englishWord, tag } = req.body;

    try {
        await database.insertFinnishAndEnglish(finnishWord, englishWord, tag)
        res.status(201).json({ message: "Words added successfully" });
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err });
    }
})
/**
 * @function DELETE /api/:id/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    try {
        const result = await database.deleteWord(id);
        if (result === 0) {
            return res.status(404).json({ error: "No words found with the provided ID" });
        }
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete words", details: err.message });
    }
})
/**
 * @function DELETE /api/tags/:id/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.delete("/tags/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await database.deleteTag(id);
        if (result === 0) {
            return res.status(404).json({ error: "No tags found with the provided ID" });
        }
        return res.status(204).send();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete tag", details: err.message });
    }
})
/**
 * @function POST /api/tags/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.post("/tags", async (req, res) => {
    const { tag } = req.body;

    try {
        await database.insertTag(tag)
        res.status(201).json({ message: "Tag added successfully" });

    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err });
    }
});
/**
 * @function PUT /api/:id/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { finnishWord, englishWord } = req.body;
    try {
        await database.updateWords(finnishWord, englishWord, id);
        res.status(200).json({ message: "Word updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});
/**
 * @function PUT /api/tag/:id/
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The response object.
 */
router.put("/tag/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { tag } = req.body;
    try {
        await database.updateWordsTag(tag, id);
        res.status(200).json({ message: "Tag updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;