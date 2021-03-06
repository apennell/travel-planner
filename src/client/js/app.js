import renderTrip from './render-trip';
import handleDate from './date-handler';

const destinationInput = document.querySelector('#destination-input');
const destinationError = document.querySelector(
  '#destination-field label.error'
);
const departureInput = document.querySelector('#departure-input');
const departureError = document.querySelector('#departure-field label.error');
const saveTripButton = document.querySelector('#save-trip');
const formError = document.querySelector('#form-error');

let trips = [];

// Update UI to indicate loading status on submit and when results are complete
const setLoading = (isLoading) => {
  saveTripButton.textContent = isLoading ? 'Saving...' : 'Save Trip';
  saveTripButton.disabled = isLoading;
};

// Submit trip to backend and retrieve additional info about destination/date
const saveTrip = async (tripData) => {
  const trip = await fetch('/trip', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(tripData),
  })
    .then((res) => res.json())
    .catch((error) => {
      triggerErrorResults(formError, 'Error retrieving results');
      setLoading(false);
    });

  return trip;
};

// Process error results and add to UI
const triggerErrorResults = (targetEl, copy) => {
  Object.assign(targetEl, {
    textContent: copy,
    classList: 'error',
  });
};

// Base handler for save trip button submit
const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  destinationError.classList.add('hidden');
  departureError.classList.add('hidden');
  formError.classList.add('hidden');

  const trip = {
    destination: destinationInput.value,
    departureDate: departureInput.value,
  };

  const processedDate = handleDate(trip.departureDate);

  // Save trip and render results in UI (or error message, if no results)
  if (trip.destination && processedDate.isValid) {
    trip.departureDate = processedDate;
    const results = await saveTrip(trip);

    if (results && results.tripData) {
      destinationInput.value = '';
      departureInput.value = '';
      trips.push(results.tripData);
      const { destination, imgSrc } = results.tripData;
      renderTrip(destination, processedDate, imgSrc);
    } else {
      triggerErrorResults(
        formError,
        'Unable to find that destination location'
      );
    }
  } else {
    if (!trip.destination) {
      triggerErrorResults(destinationError, 'Please enter a destination');
    }

    if (processedDate.errorMsg) {
      triggerErrorResults(departureError, processedDate.errorMsg);
    }
  }

  setLoading(false);
};

export default handleSubmit;
