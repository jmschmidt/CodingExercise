/**
 * Fetch data from mlb api for yesterday.
 * @param {Function} callback 
 */

/*
 *  TODO: Previous date does not always return games data
 *  Possible alternative is to keep fetching the next previous day
 *  until return games array is not null
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
  
  return d.toISOString().substring(0, 10);
}
