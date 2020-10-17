import handleSubmit from './js/formHandler';

import './styles/styles.scss';

const saveTripButton = document.querySelector('#save-trip');
saveTripButton.addEventListener('click', handleSubmit);

// export { handleSubmit };
