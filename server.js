
const express = require("express");
const fs = require("fs");
const { get } = require("http");
const server = express();
const PORT_SERVER = process.env.PORT_SERVER|| 710;
const path = require("path");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static("public"));


//This is my static server
//////or////



//This is the file to the note html
server.get("/notes", function (req, res) {
  console.log(path.join(__dirname + '/public/assets/notes.html'))
  res.sendFile(__dirname + '/public/assets/notes.html');
});
//This is thae path to show the json files inside of db.json
server.get("/api/notes", (req, res) => {
  fs.readFile("public/assets/db/db.json", "utf8", function (error, data) {
    if (error) {
      console.log("There has been an error reading the json: ", error);
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});
//this is my post request
server.post("/api/notes", function (req, res) {
  try {
    const savedNotes = JSON.parse(
      fs.readFileSync("public/assets/db/db.json", "utf8")
    );
    const postNote = req.body;
    const uniqueID = savedNotes.length.toString();
    postNote.id = uniqueID;
    savedNotes.push(postNote);
    fs.writeFileSync("public/assets/db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", postNote);
    res.json(savedNotes);
  }catch(err){
    return `This is your error: ${err}`
  }
});
//Here is where I delete my note
server.delete("/api/notes/:id", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("public/assets/db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Note ID: ${noteID} has been deleted`);
  savedNotes = savedNotes.filter((currNote) => {
    return currNote.id != noteID;
  });
  for (currNote of savedNotes) {
    currNote.id = newID.toString();
    newID++;
  }
  fs.writeFileSync("public/assets/db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});
//This is my default page 
server.get("*", function (req, res) {
  res.sendFile(__dirname + '/public/assets/index.html');
});
//Here i am listening to the server
server.listen(PORT_SERVER, function () {
  console.log(`Whe are listening to port ${PORT_SERVER}`);
});
