/**
 * Fetch data from mlb api for yesterday.
 * @param {Function} callback 
 */
export function fetchData(callback) {
  // API Url for recap data for yesterdays games. - Using yesterdays date instead of todays
  // API does not always returning a recap object for todays games
  const dataUrl = `//statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=${getYesterdaysDate()}&sportId=1`;
  const init = { method: 'GET' };
  const request = new Request(dataUrl);

  // Fetch Request
  fetch(request, init)
    .then(response => response.text()
    .then(data => {
      return callback(data);
    }));
}

/**
 * Return yesterdays date in YYYY-MM-DD format
 * @returns Date
 */
function getYesterdaysDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);

  let month = (d.getMonth() + 1);
  let day = d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}
