import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { error } from "console";
import bcrypt from 'bcrypt';
// import md5 from 'md5'; if it was just hashing

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const port = 3000;
const saltRounds = 10;

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

    const username1 = req.body.username;
    // const password1 = md5(req.body.password); if this was just md5
    const password1 = req.body.password;
    const username = await db.query("SELECT email from users1 WHERE email = $1",
    [username1]
    );
    const password = await db.query("SELECT password from users1 WHERE password = $1",
    [password1]
    );

    //bcrypt use to compare 
    // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    //     // result == true
    // });

    if (username1 === username.rows[0] && password1 === password.rows[0]){
    res.render("secrets.ejs")
    } else { console.log("Account does not exist")}
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    // const password = md5(req.body.password); if you used md5
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // The general code to push the login info goes inside of the bcrypt function
        const newLogin = db.query("INSERT INTO users1 (email, password) values ($1, $2)",
        [username, hash]
        );
        try {
            newLogin
        } catch (error){
            console.error(error);
        };
        res.render("secrets.ejs")
    });
});

app.get("/logout", (req, res) => {
    res.redirect("/")
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});