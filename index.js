const express = require('express');
require("dotenv").config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express());


const toyGallery = require('./data/toy_img.json');

app.get('/' , (req,res) => {
    res.send('Toy Shop Server is Running.');
});

app.get('/gallery' , (req,res) => {
    res.send(toyGallery);
});


app.listen(port , () => {
    console.log(`Toy Shop Server Is Running On Port : ${port}`);
});