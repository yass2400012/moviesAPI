/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Yassine Lebbar Student ID: 159804210 Date: 18/01/2023
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config(); 
const mongoose = require('mongoose');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

  
app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body).then(() => {
        res.status(201).send("New movie successfully added to database");
    }).catch((err) => {
        res.status(204).send(err);
    })
});
  
app.get('/api/movies/', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((movies) => {
        res.status(200).json(movies);
    }).catch((err) => {
        res.status(204).send(err);

    })
});
  
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id).then((movie) => {
        res.status(200).json(movie);
    }).catch((err) => {
        res.status(204).send(err);
    })
});
  
app.put('/api/movie/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id).then(() => {
        res.status(200).send('Movie updated successfully');
    }).catch((err) => {
        res.status(500).send(err);
    })
});
  
app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(200).send("Movie deleted :" + req.params.id);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  }).catch((err)=>{
    console.log(err);
});
   