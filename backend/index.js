const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const path = require('path');
const database = require("./database/crudrepository");
const router = require("./routes/router");
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/api', router);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

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

app.listen(port, () => {
    console.log(`Learn English App listening on port ${port}`)
})