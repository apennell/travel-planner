const fetch = require('node-fetch');
const dotenv = require('dotenv');
const express = require('express');

const app = express();

dotenv.config();

// TODO: Add or remove the below, from ephemeral-journal
/**
 * Use the out-of-the-box express.json() and express.urlencoded() methods over the outdated option
 * of adding body-parser middleware to handle POST requests
 */
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.text());

// // Enable CORS for all requests
// app.use(cors());
// ===== /add or remove the above

// Initialize application
app.use(express.static('dist'));

// Base route to retrieve webpage
app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

// Serves as "database" to saved submitted trip data
let tripData = {};

// GET route
app.get('/trips', (req, res) => {
  res.send(tripData);
});

// POST route
app.post('/trip', (req, res) => {
  tripData = req.body;

  res.send({ tripData, success: true, message: 'Success' });
});

module.exports = app;
