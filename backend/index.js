/**
 * @fileoverview Main entry point for the Learn English App backend.
 * Sets up the Express server, middleware, routes, and initializes the database.
 */
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const path = require('path');
const database = require("./database/crudrepository");
const router = require("./routes/router");

if (process.env.MODE === 'dev') {
    const cors = require('cors');
    app.use(cors());
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/api', router);

/**
 * Main function to initialize the database and insert initial data.
 * @async
 * @function
 */
const main = async () => {
    try {
        await database.initialize();
        await database.insertFinnishAndEnglish("kissa", "cat");
        await database.insertFinnishAndEnglish("mato", "worm");
        await database.insertFinnishAndEnglish("koira", "dog");
        await database.insertFinnishAndEnglish("hevonen", "horse");
        await database.insertFinnishAndEnglish("kala", "fish");
        await database.insertFinnishAndEnglish("sika", "pig");
        await database.insertFinnishAndEnglish("lehmä", "cow");

    } catch (err) {
        console.error(err)
    }
}

main();
/**
 * Starts the Express server and listens on the specified port.
 * Logs a message indicating the server is running.
 * @function
 */
app.listen(port, () => {
    if (process.env.MODE === 'dev') {
        console.log(`Learn English App listening on port ${port} in development mode`)
    } else {
        console.log(`Learn English App listening on port ${port}`)
    }
})