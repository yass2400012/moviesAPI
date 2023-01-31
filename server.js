/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Yassine Lebbar Student ID: 159804210 Date: 19/01/2023
*  Cyclic Link: https://dull-gold-foal-suit.cyclic.app
*
********************************************************************************/ 


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv").config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


app.get("/", function (req, res) {
  res.json({ message: "API Listening" });
});

// routes /api/movies
app.post("/api/movies", function (req, res) {
  db.addNewMovie(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to Add Movie" });
    });
});

app.get("/api/movies", function (req, res) {
  let queryPromise = null;

  if (req.query.title) {
    queryPromise = db.getAllMovies(
      req.query.page,
      req.query.perPage,
      req.query.title
    );
  } else {
    queryPromise = db.getAllMovies(req.query.page, req.query.perPage);
  }

  queryPromise
    .then((data) => {
      if (data) res.json(data);
      else res.json({ errorMessage: "No Movies" });
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err });
    });
});

app.get("/api/movies/:id", function (req, res) {
  db.getMovieById(req.params.id)
    .then((data) => {
      if (data) res.json(data);
      else res.json({ errorMessage: "Movie Not Found" });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to Get Movie" });
    });
});

app.put("/api/movies/:id", function (req, res) {
  db.updateMovieById(req.body, req.params.id)
    .then(() => {
      res.json({ successMessage: "Movie Updated" });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to Update Movie" });
    });
});

app.delete("/api/movies/:id", function (req, res) {
  db.deleteMovieById(req.params.id)
    .then(() => {
      res.status(200).json({ successMessage: "Movie Deleted" });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to Delete Movie" });
    });
});

app.use((req, res) => {
  res.status(404).send("Resource not found");
});
  
  //initialize
  db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
      app.listen(HTTP_PORT, function () {
        console.log(`Server listening on port ${HTTP_PORT}`);
      });
    })
    .catch(function (err) {
      console.log(err.message);
    });
  
