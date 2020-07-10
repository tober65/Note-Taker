const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic route that sends the user first to the AJAX Page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});