const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const pool = new Pool({
    connectionString: process.env.DB_URL,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8000, () => {
    console.log(`Listening on 8000`);
})

app.post("/sql-injection", async (req, res) => {
    const { username, password, enabled } = req.body;

    let query;
    if (enabled) {
        query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    }
    else {
        query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    }

    try {
        const result = enabled
            ? await pool.query(query)
            : await pool.query(query, [username, password]);

        const users = result.rows;

        return res.status(200).send(
            {
                users: users,
                query: query
            }
        )
    }
    catch (error) {
        return res.status(400).send({ err: "Greška prilikom slanja upita" });
    }
})

app.post("/broken-authentication", async (req, res) => {
    const { username, password, enabled, captchaResponse } = req.body;

    let response;
    if (enabled) {
        response = await fetch("https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                body: new URLSearchParams(
                    {
                        secret: "6LdHjXoqAAAAAAaJWOmrh8z2niGCU-T2RdPiPD_p",
                        response: captchaResponse
                    }
                )
            }
        );

        const data = await response.json();

        if (!data.success) {
            return res.status(200).send({ message: "Validacija captche je neuspješna" })
        }
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        )

        if (result.rows.length > 0) {
            return res.status(200).send({ message: "Korisnik je uspješno ulogiran" });
        }
        else {
            return res.status(200).send({ message: "Korisnik nije pronađen" });
        }
    }
    catch (error) {
        return res.status(400).send({ err: "Greška prilikom slanja upita" });
    }
})