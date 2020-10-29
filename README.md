# Travel Planner

A Node/Express app that uses the Geonames to access coordinates for a user-given location, the Weatherbit API to access weather for that location and given date, and the Pixabay API to get a photo for that location.

Technologies: Node, Express, JavaScript, HTML, Sass, Webpack, [Geonames API](https://www.geonames.org/export/web-services.html), [Weatherbit API](https://www.weatherbit.io/api), [Pixabay API](https://pixabay.com/api/docs/)

## Instructions

1. Clone the repo and `cd travel-planner`
2. Run `npm install` to install the node modules
3. Obtain API keys/username and add to a .env file:

- Add `.env` file to root directory
- Add your keys to the file as follows:

```
GEONAMES_USER=yourusername
PIXABAY_API_KEY=123yourkeyabc123
WEATHERBIT_API_KEY=123yourkeyabc123
```

### To run in development mode

1. Run `npm start` to start the server (running on http://localhost:3000/)
2. Run `npm run build:dev` to build and run the webpack dev server with hot reloading
3. This should automatically open http://localhost:8080/ in your browser to view the app, updating when code changes are made.

### To run in production mode

1. Run `npm run build:prod` to build the app in production mode
2. Run `npm start` to start the server
3. Open http://localhost:3000/ in your browser to view the app, which will serve the compiled frontend production code

## Bonuses

- Searches Pixabay for an image using the state and country name if no results are found for the destination city
- Includes one week of forecasts
- User can add multiple trips

## Future additions

With more time, I would like to:

- Improve the styling, in particular the display of the forecast and the date placeholder text
- Order the saved trips by date, and scroll to the newly added trip on save
- Save trips to local storage and render the previously saved trips on page load
- Collapse "Add Trip" form if there are saved trips, and expand on form click
- Build out tests further
