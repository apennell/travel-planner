import renderTrip from './renderTrip';

const destinationInput = document.querySelector('#destination-input');
const departureInput = document.querySelector('#departure-input');
const saveTripButton = document.querySelector('#save-trip');

const saveTrip = async (trip) => {
  const resp = await fetch('/trip', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(trip),
  })
    .then((res) => res.json())
    .catch((error) => {
      Object.assign(errorMessage, {
        textContent: `Error retrieving results: ${error}`,
        classList: 'error',
      });
    });

  return resp;
};

// Update UI to indicate loading status on submit and when results are complete
const setLoading = (isLoading) => {
  saveTripButton.textContent = isLoading ? 'Saving...' : 'Save Trip';
  saveTripButton.disabled = isLoading;
};

// Base handler for save trip button submit
const handleSubmit = async (e) => {
  e.preventDefault();

  const trip = {
    destination: destinationInput.value,
    departureDate: departureInput.value,
  };

  setLoading(true);

  // TODO: run validations
  const isValid = true;

  if (isValid) {
    // errorMessage.classList.add('hidden');
    const results = await saveTrip(trip);
    destinationInput.value = '';
    departureInput.value = '';

    if (results) {
      renderTrip(results.tripData);
    }
  } else {
    // Object.assign(errorMessage, {
    //   textContent: 'Please enter a valid url.',
    //   classList: 'error',
    // });
  }

  setLoading(false);
};

export default handleSubmit;
