# Weather App

This is a simple weather app made in **Svelte** 5 with **Vite**.
The user can search for a city and check the current weather, short hourly forecast and the next few days.

## Main functions

- search for cities
- show current weather
- show short hourly forecast
- show 5-day forecast
- switch between Celsius and Fahrenheit
- save recently searched places in localStorage

## How to run the project

First install dependencies:
npm install

Then start the development server:
npm run dev

After that open the address shown in the terminal, usually:
http://localhost:5173/

## Production build

To create the production version:
npm run build

To preview it:
npm run preview

## How CSS is transformed

This project uses Vite as a bundler and Svelte as the framework.

The CSS is written in:

- src/app.css – global styles
- <style> sections inside Svelte components

During build, CSS is processed and transformed:

1. Vite collects CSS from the project.
2. Svelte processes component styles.
3. PostCSS transforms the CSS.
4. autoprefixer adds prefixes if needed.
5. Final CSS is generated in the build output.

Because of this, the final CSS used by the browser is not exactly the same as the original source files and does not match them 1-to-1.

## Generated CSS and source maps

After running:
npm run build

the generated files can be found in:
- dist/assets/ – generated CSS files
- dist/assets/*.css.map – CSS source maps

CSS source maps are enabled in vite.config.js.

## Data source

The app uses the Open-Meteo API for weather and location data.