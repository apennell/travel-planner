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

// Retrieve and return location information for destination input
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

// Retrieve and return
const fetchImages = async (query) => {
  const baseUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}`;
  const url = `${baseUrl}&q=${query}&image_type=photo&orientation=horizontal`;
  console.log({ url });
  // &category=places or travel
  const images = await fetch(url)
    .then((res) => res.json())
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error fetching images:', error));

  console.log(images);
  return images;
};

const getImage = async ({ name, adminName1, countryName }) => {
  const queries = [name, adminName1, countryName];
  let imgSrc = null;
  let i = 0;
  while (!imgSrc && i < queries.length) {
    console.log('QUERY', queries[i]);
    let searchResults = await fetchImages(queries[i].replace(/\s/g, '+'))
      // eslint-disable-next-line no-console
      .catch((error) => console.error('Error getting image:', error));

    if (searchResults && searchResults.total > 0) {
      imgSrc = searchResults.hits[0].largeImageURL;
    } else {
      i += 1;
    }
  }

  return imgSrc;
};

// POST new trip
app.post('/trip', async (req, res) => {
  const trip = { date: req.body.departureDate };
  const destination = await getDestination(
    req.body.destination
  ).catch((error) => res.status(500).json({ error: error.toString() }));

  if (destination) {
    trip.destination = destination;
    trip.imgSrc = await getImage(destination)
      // eslint-disable-next-line no-console
      .catch((error) =>
        console.error('Error getting destination image:', error)
      );

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

// Retrieve and return weather data for a given location
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

module.exports = app;
