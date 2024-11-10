const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log(`Listening on https://web2-lab2-frontend-bjt2.onrender.com`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/sql-injection-example', (req, res) => {
    res.sendFile(path.join(__dirname, "public/sql_injection.html"));
});

app.get('/broken-auth-example', (req, res) => {
    res.sendFile(path.join(__dirname, "public/broken_auth.html"));
});