const formatDate = (date) => {
  const d = new Date(`${date}T00:00:00`);
  const options = {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  };

  return d.toLocaleString('en-us', options);
};

const createForecast = (weatherData, isCurrent) => {
  const wrapper = document.createDocumentFragment();
  const heading = document.createElement('h4');
  heading.textContent = `${
    isCurrent ? 'This' : 'Next'
  } Week's Weather Forecast`;
  wrapper.appendChild(heading);

  weatherData.forEach((data) => {
    const { high_temp, low_temp, valid_date } = data;
    const forecast = document.createElement('p');
    forecast.textContent = `
      ${formatDate(valid_date)}:
      ${Math.floor(high_temp)}°F | ${Math.floor(low_temp)}°F`;
    wrapper.appendChild(forecast);
  });

  return wrapper;
};

const getWeather = async ({ lat, lng, countdownDays }) => {
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
      const forecast = createForecast(weather.data.slice(0, 7), true);
      weatherSection.appendChild(forecast);
    } else {
      // return the 7-13th forecasts
      const forecast = createForecast(weather.data.slice(7, 14), false);
      weatherSection.appendChild(forecast);
    }
  } else {
    const message = document.createElement('p');
    message.textContent = 'Weather data unavailable for this destination.';
    weatherSection.appendChild(message);
  }

  return weatherSection;
};

const renderTrip = async (destination, processedDate) => {
  const tripsSection = document.querySelector('#trips');
  const trip = document.createElement('div');
  trip.classList.add('trip');

  // Set location info
  const heading = document.createElement('h3');
  const { adminCode1, countryCode, countryName, name } = destination;
  heading.textContent =
    countryCode === 'US'
      ? `${name}, ${adminCode1}, USA`
      : `${name}, ${countryName}`;
  trip.appendChild(heading);

  // Set date
  const date = document.createElement('p');
  date.textContent = processedDate.formattedDate;
  trip.appendChild(date);

  // Set countdown
  const countdown = document.createElement('p');
  const { countdownDays } = processedDate;
  countdown.textContent = `${
    countdownDays < 1 ? 'Less than 1' : countdownDays
  } day${countdownDays > 1 ? 's' : ''} until trip`;
  trip.appendChild(countdown);

  // Get and set weather
  const weatherSection = await getWeather({
    lat: destination.lat,
    lng: destination.lng,
    countdownDays,
  });
  trip.appendChild(weatherSection);

  tripsSection.appendChild(trip);
};

export default renderTrip;
