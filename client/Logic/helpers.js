export function validDates(startDate, endDate, maxRange = 15, cb) {
  var validPresentDate =
    moment().diff(startDate) >= 0 && moment().diff(endDate) >= 0;
  var validSD = moment(startDate, 'YYYY-MM-DD', true).isValid();
  var validED = moment(endDate, 'YYYY-MM-DD', true).isValid();
  var validRange = moment(startDate).isBefore(endDate);
  var validRangeLength = moment(endDate).diff(startDate, 'days') <= maxRange;

  if (
    validSD &&
    validED &&
    validRange &&
    validRangeLength &&
    validPresentDate
  ) {
    cb();
  } else if (!validSD || !validED) {
    Materialize.toast('Please input a valid start and end date.', 4000);
  } else if (!validPresentDate) {
    Materialize.toast("Marty! you can't choose a date in the future.", 4000);
  } else if (!validRangeLength) {
    Materialize.toast('Max date range is ' + maxRange + ' days.', 4000);
  } else {
    Materialize.toast('End date must be after start date.', 3000);
  }
}
