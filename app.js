//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { error } from "console";

const app = express();
const port = 3000;


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "userDB",
    password: "6932",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs")
});

app.get("/login", (req, res) => {
    res.render("login.ejs")
});

app.get("/register", (req, res) => {
    res.render("register.ejs")
});

app.post("/login", async (req, res) => {
    const username1 = req.body.username
    const password1 = req.body.password
    const username = await db.query("SELECT email from users WHERE email = $1",
    [username1]
    );
    const password = await db.query("SELECT password from users WHERE password = $1",
    [password1]
    );
    if(username1 === username.rows[0].email && password1 === password.rows[0].password){
    res.render("secrets.ejs")
    } else { console.log("Account does not exist")}
});

app.post("/register", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const newLogin = await db.query("INSERT INTO users (email, password) values ($1, $2)",
    [username, password]
    );
    try {
        newLogin
    } catch (error){
        console.error(error);
    };
    res.render("secrets.ejs")
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});