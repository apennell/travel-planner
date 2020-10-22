const fetch = require('node-fetch');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

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
  res.send(tripsData);
});

const getDestination = async (dest) => {
  const baseUrl = 'http://api.geonames.org/searchJSON';
  const url = `${baseUrl}?q=${dest}&maxRows=1&username=${process.env.GEONAMES_USER}`;
  const destination = await fetch(url)
    .then((res) => res.json())
    .then((res) => res.geonames[0] || null)
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error getting destination:', error));

  return destination;
};

app.post('/weather', async (req, res) => {
  const { lat, lng } = req.body;
  const baseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const url = `${baseUrl}?lat=${lat}&lon=${lng}&units=I&key=${process.env.WEATHERBIT_API_KEY}`;
  const weather = await fetch(url)
    .then((res) => res.json())
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error getting weather:', error));

  res.send({ data: weather.data, success: true, message: 'Success' });
});

// POST new trip route
app.post('/trip', async (req, res) => {
  const trip = { date: req.body.departureDate };
  const destination = await getDestination(
    req.body.destination
  ).catch((error) => res.status(500).json({ error: error.toString() }));

  if (destination) {
    trip.destination = destination;
    tripData = trip;
    res.send({ tripData, success: true, message: 'Success' });
  } else {
    /**
     * Geonames call can may not throw error but also not return destination results, so return server
     * error to client if that's the case
     */
    res.status(500).json({ success: false, message: 'Error' });
  }
});

module.exports = app;
