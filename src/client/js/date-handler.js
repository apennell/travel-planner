export const validateDate = (dateInput) => {
  // Expected format from HTML date input: "YYYY-MM-DD"
  const dateFormat = /\d{4}-\d{1,2}-\d{1,2}/;

  if (dateFormat.test(dateInput)) {
    // zero-out the time for each date to compare date only and to avoid timezone conversion issues
    const tripDate = new Date(`${dateInput}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /**
     * `+tripDate` will evaluate to a number if it's a valid date, otherwise NaN if not, so
     * `Boolean(+tripDate)` will return true or false for valid or invalid date, respectively,
     * then we compare against the current date to ensure departure date is today or later
     */
    return Boolean(+tripDate) && tripDate >= today
      ? { isValid: true, dateObj: tripDate }
      : { isValid: false, errorMsg: 'Please enter a valid future date' };
  } else {
    return { isValid: false, errorMsg: 'Please enter a valid date' };
  }
};

const getCountdown = (tripDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countdown = tripDate - today; // returns seconds between two dates
  const secondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(countdown / secondsPerDay);
};

const handleDate = (dateInput) => {
  const dateData = dateInput
    ? validateDate(dateInput)
    : { isValid: false, errorMsg: 'Please enter a valid date' };

  if (dateData.isValid) {
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    dateData.formattedDate = dateData.dateObj.toLocaleString('en-us', options);
    dateData.countdownDays = getCountdown(dateData.dateObj);
  }

  return dateData;
};

export default handleDate;
