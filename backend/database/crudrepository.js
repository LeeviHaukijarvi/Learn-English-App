const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');


const connectionFunctions = {

    initialize: () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS Translations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    finnish_word VARCHAR(255) NOT NULL UNIQUE,
                    english_word VARCHAR(255) NOT NULL UNIQUE
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
                    resolve();
                });
            });
        });
    },

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
                db.run(
                    "INSERT INTO Translations (finnish_word, english_word) VALUES (?, ?)",
                    [finnishWord, englishWord],
                    (err) => {
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

    getAllWords: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT id, finnish_word, english_word FROM Translations", [], (err, rows) => {
                if (err) {
                    return reject("Failed to fetch english words.")
                }
                resolve(rows)
            })
        })
    },

    deleteWord: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM Translations WHERE id = ?", [id], function (err) {
                if (err) {
                    return reject("Failed to delete word")
                }
                resolve(this.changes)
            })
        })
    },

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

