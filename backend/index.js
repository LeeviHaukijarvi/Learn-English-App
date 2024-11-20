const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const path = require('path');

app.use(express.static(path.join(__dirname, "public")));


db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, latitude DECIMAL, longitude DECIMAL)");

    db.run('INSERT INTO locations (latitude, longitude) VALUES (?, ?)', ['10', '20']);
    db.run('INSERT INTO locations (latitude, longitude) VALUES (?, ?)', ['22', '30']);
    db.run('INSERT INTO locations (latitude, longitude) VALUES (?, ?)', ['1', '66']);
});

app.get('/api/locations', (req, res) => {
    db.all('SELECT * FROM locations', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.json(rows);
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})