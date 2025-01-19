/**
 * @fileoverview This module provides functions to interact with an in-memory SQLite database.
 * It includes functions to initialize the database, insert and update records, and fetch data.
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');


const connectionFunctions = {

    /**
    * Initializes the database by creating necessary tables if they do not exist.
    * @returns {Promise<void>} A promise that resolves when the tables are created.
    */
    initialize: () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS Translations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    finnish_word VARCHAR(255) NOT NULL UNIQUE,
                    english_word VARCHAR(255) NOT NULL UNIQUE,
                    tag INTEGER
                )`, (err) => {
                    if (err) {
                        return reject(err);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )`, (err) => {
                    if (err) {
                        return reject(err);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS Tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tag VARCHAR(255) NOT NULL
                )`, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    },
    /**
        * Inserts a new user with the given username and password.
        * @param {string} username - The username of the user.
        * @param {string} password - The password of the user.
        * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
        */
    insertPasswordAndUsername: (username, password) => {
        return new Promise((resolve, reject) => {
            if (!username || !password) {
                return reject("Both fields are required");
            }

            db.serialize(() => {
                db.run(
                    "INSERT INTO Users (username, password) VALUES (?, ?)",
                    [username, password],
                    (err) => {
                        if (err) {
                            if (err.code === 'SQLITE_CONSTRAINT') {
                                return reject("User already exists");
                            }
                            return reject(`Error adding user: ${err}`)
                        }
                        resolve("User added succesfully")
                    }
                )
            });
        })
    },

    /**
     * Inserts a new tag.
     * @param {string} tag - The tag to be inserted.
     * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
     */
    insertTag: (tag) => {
        return new Promise((resolve, reject) => {
            if (!tag) {
                return reject("Tag is required");
            }
            db.serialize(() => {
                db.run(
                    "INSERT INTO Tags (tag) VALUES (?)",
                    [tag],
                    (err) => {
                        if (err) {
                            return reject(`Error adding tag: ${err}`)
                        }
                        resolve("Tag added succesfully")
                    }
                )
            });
        });
    },
    /**
         * Updates the tag of a word with the given id.
         * @param {number} tag - The new tag.
         * @param {number} id - The id of the word to be updated.
         * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
         */
    updateWordsTag: (tag, id) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE Translations SET tag = ? WHERE id = ?",
                [tag, id], (err) => {
                    if (err) {
                        return reject("Failed to update tag");
                    }
                    resolve("Tag updated successfully");
                });
        });
    },
    /**
       * Inserts a new translation with the given Finnish and English words.
       * @param {string} finnishWord - The Finnish word.
       * @param {string} englishWord - The English word.
       * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
       */
    insertFinnishAndEnglish: (finnishWord, englishWord) => {
        return new Promise((resolve, reject) => {
            if (!finnishWord || !englishWord) {
                return reject("Both words are required");
            }

            const hasNumbers = /\d/;
            if (hasNumbers.test(finnishWord) || hasNumbers.test(englishWord)) {
                return reject("Words should not contain numbers");
            }

            db.serialize(() => {
                const query = "INSERT INTO Translations (finnish_word, english_word) VALUES (?, ?)";
                const params = [finnishWord, englishWord];
                db.run(query, params, (err) => {
                    if (err) {
                        if (err.code === 'SQLITE_CONSTRAINT') {
                            return reject("Word already exists");
                        }
                        return reject(`Error adding words: ${err}`)
                    }
                    resolve("Words added succesfully")
                }
                )
            })
        })
    },
    /**
         * Fetches all tags from the database.
         * @returns {Promise<Array>} A promise that resolves with an array of tags or rejects with an error message.
         */
    getTags: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Tags", [], (err, rows) => {
                if (err) {
                    return reject("Failed to fetch tags.")
                }
                resolve(rows)
            })
        })
    },
    /**
         * Fetches a user with the given username.
         * @param {string} username - The username of the user to be fetched.
         * @returns {Promise<Object>} A promise that resolves with the user object or rejects with an error message.
         */
    getUser: (username) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE username = ?",
                [username],
                (err, row) => {
                    if (err) {
                        return reject("Failed to fetch user.")
                    }
                    resolve(row)
                })
        })
    },
    /**
        * Fetches all English words from the database.
        * @returns {Promise<Array>} A promise that resolves with an array of English words or rejects with an error message.
        */
    getAllEnglishWords: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT english_word FROM Translations", [], (err, rows) => {
                if (err) {
                    return reject("Failed to fetch English words.")
                }
                resolve(rows)
            })
        })
    },
    /**
        * Fetches all Finnish words from the database.
        * @returns {Promise<Array>} A promise that resolves with an array of Finnish words or rejects with an error message.
        */
    getAllFinnishWords: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT finnish_word FROM Translations", [], (err, rows) => {
                if (err) {
                    return reject("Failed to fetch Finnish words.")
                }
                resolve(rows)
            })
        })
    },
    /**
         * Fetches all data from Translations table.
         * @returns {Promise<Array>} A promise that resolves with an array of translations or rejects with an error message.
         */
    getAllWords: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT id, finnish_word, english_word, tag FROM Translations", [], (err, rows) => {
                if (err) {
                    return reject("Failed to fetch english words.")
                }
                resolve(rows)
            })
        })
    },
    /**
        * Deletes a word with the given id.
        * @param {number} id - The id of the word to be deleted.
        * @returns {Promise<number>} A promise that resolves with the number of rows affected or rejects with an error message.
        */
    deleteWord: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM Translations WHERE id = ?", [id], (err) => {
                if (err) {
                    return reject("Failed to delete word")
                }
                resolve(this.changes)
            })
        })
    },
    /**
        * Deletes a tag with the given id.
        * @param {number} id - The id of the tag to be deleted.
        * @returns {Promise<number>} A promise that resolves with the number of rows affected or rejects with an error message.
        */
    deleteTag: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM Tags WHERE id = ?", [id], (err) => {
                if (err) {
                    return reject("Failed to delete tag")
                }
                resolve(this.changes)
            })
        })
    },
    /**
         * Updates a translation with the given Finnish and English words and id.
         * @param {string} finnishWord - The new Finnish word.
         * @param {string} englishWord - The new English word.
         * @param {number} id - The id of the translation to be updated.
         * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
         */
    updateWords: (finnishWord, englishWord, id) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE Translations SET finnish_word = ?, english_word = ? WHERE id = ?",
                [finnishWord, englishWord, id], (err) => {
                    if (err) {
                        return reject("Failed to update word");
                    }
                    resolve("Word updated successfully");
                });
        });
    },
}


module.exports = connectionFunctions

