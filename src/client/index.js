import handleSubmit from './js/app';

import './styles/styles.scss';

const saveTripButton = document.querySelector('#save-trip');
saveTripButton.addEventListener('click', handleSubmit);
