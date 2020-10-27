const formatDate = (date) => {
  const d = new Date(`${date}T00:00:00`);
  const options = {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  };

  return d.toLocaleString('en-us', options);
};

const createForecast = (weatherData) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('forecast');

  weatherData.forEach((data) => {
    const { high_temp, low_temp, valid_date } = data;
    const forecast = document.createElement('p');
    forecast.textContent = `${formatDate(valid_date)}:
      ${Math.floor(high_temp)}°F | ${Math.floor(low_temp)}°F`;
    wrapper.appendChild(forecast);
  });

  return wrapper;
};

const getWeather = async ({ destination, countdownDays }) => {
  const { lat, lng, name } = destination;

  const weather = await fetch('/weather', {
    method: 'POST',
    // credentials: 'same-origin',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error getting weather', error);
    });

  const weatherSection = document.createElement('div');
  weatherSection.classList.add('weather');

  if (weather.data && weather.data.length > 0) {
    if (countdownDays < 7) {
      // return next 7 days forecast
      const heading = document.createElement('h4');
      heading.textContent = `This Week's Weather Forecast in ${name}`;
      weatherSection.appendChild(heading);
      const forecast = createForecast(weather.data.slice(0, 7));
      weatherSection.appendChild(forecast);
    } else {
      // return the 7-13th forecasts
      const heading = document.createElement('h4');
      heading.textContent = `Next Week's Weather Forecast in ${name}`;
      weatherSection.appendChild(heading);
      const forecast = createForecast(weather.data.slice(7, 14));
      weatherSection.appendChild(forecast);
    }
  } else {
    const message = document.createElement('p');
    message.textContent = 'Weather data unavailable for this destination.';
    weatherSection.appendChild(message);
  }

  return weatherSection;
};

const renderTrip = async (destination, processedDate, imgSrc) => {
  const tripsSection = document.querySelector('#trips');
  const trip = document.createElement('div');
  trip.classList.add('trip');

  // Set location image
  const img = document.createElement('img');
  img.src = imgSrc;
  trip.appendChild(img);

  // Set location info
  const heading = document.createElement('h3');
  const { adminCode1, countryCode, countryName, name } = destination;
  heading.textContent =
    countryCode === 'US'
      ? `${name}, ${adminCode1}, USA`
      : `${name}, ${countryName}`;
  trip.appendChild(heading);

  const infoSection = document.createElement('div');
  infoSection.classList.add('container');

  // Set date and countdown
  const date = document.createElement('p');
  const { countdownDays } = processedDate;
  date.textContent = `${processedDate.formattedDate} - 
    ${countdownDays < 1 ? 'Less than 1' : countdownDays} 
    day${countdownDays > 1 ? 's' : ''} until trip`;
  infoSection.appendChild(date);

  // Get and set weather
  const weatherSection = await getWeather({
    destination,
    countdownDays,
  });
  infoSection.appendChild(weatherSection);
  trip.appendChild(infoSection);

  // Add all the elements created above to the document
  tripsSection.appendChild(trip);
};

export default renderTrip;
