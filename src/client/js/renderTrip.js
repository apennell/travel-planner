// <div class="trip">
//   <h3>Destination</h3>
//   <p>departure date</p>
// </div>

const renderTrip = ({ destination, departureDate }) => {
  console.log('renderTrip');
  const tripsSection = document.querySelector('#trips');
  const trip = document.createElement('div');
  trip.classList.add('trip');

  const heading = document.createElement('h3');
  heading.textContent = destination;
  trip.appendChild(heading);

  const date = document.createElement('p');
  date.textContent = departureDate;
  trip.appendChild(date);

  tripsSection.appendChild(trip);
};

export default renderTrip;
