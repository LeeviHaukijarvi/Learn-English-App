const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const path = require('path');
const database = require("./database/crudrepository");
const router = require("./routes/router");
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());
app.use('/api', router);



const main = async () => {
    try {
        await database.initialize();
        await database.insertFinnishAndEnglish("kissa", "cat");
        await database.insertFinnishAndEnglish("mato", "worm");

    } catch (err) {
        console.error(err)
    }
}

main();

app.listen(port, () => {
    console.log(`Learn English App listening on port ${port}`)
})