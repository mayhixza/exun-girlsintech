if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const dbURI = process.env.DB_URL;
const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const Grid = require("gridfs-stream");
// const http = require("http");
const jwt = require("jsonwebtoken");

// DB CONNECTION
async function connectDB() {
    await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
connectDB();

// SETTINGS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use("/public", express.static(__dirname + "/public"));
// app.use(cors());

// GRIDFS SETTINGS
// const conn = mongoose.connection;
// let gfs;
// conn.once("open", () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("fs");
// });

// ROUTES

app.get("/", (req, res) => {
    let authed = false;
    if (req.query.username) authed = true;
    res.render("index", { authed });
});

app.get("/about", (req, res) => {
    let authed = false;
    if (req.query.username) authed = true;
    res.render("about", { authed });
});

app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
