const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

let notes = [];

function readNotesFromFile() {
    fs.readFile("db/db.json", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        // console.log("Reading: ", data);
        notes = JSON.parse(data);
    });
}

function writeNotesToFile() {
    fs.writeFile("db/db.json", JSON.stringify(notes), function (error) {
        if (error) {
            return console.log(error);
        }
        // console.log("Writing", JSON.stringify(notes));
    });
}

function getNextId() {
    let i = 0;
    while (!isUniqueId(i)) {
        i++;
    }

    return i;
}

function isUniqueId(id) {
    for (let i = 0; i < notes.length; i++) {
        if (id === notes[i].id) {
            return false;
        }
    }

    return true;
}

// Displays the notes
app.get("/api/notes", (req, res) => {
    readNotesFromFile();

    return res.json(notes);
});

app.post("/api/notes", (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    let newNote = req.body;
    newNote.id = getNextId();

    // console.log("Pushing", newNote);

    notes.push(newNote);

    writeNotesToFile();
});

app.delete("/api/notes/:id", (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    let id = parseInt(req.params.id);

    // console.log("Deleting note " + id);

    notes = notes.filter((elem) => {return elem.id !== id});

    writeNotesToFile();
});

// Basic route that sends the user first to the AJAX Page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});