<script>
  import { onMount } from 'svelte'
  import ErrorMessage from './components/ErrorMessage.svelte'
  import ForecastStrip from './components/ForecastStrip.svelte'
  import SearchBar from './components/SearchBar.svelte'
  import WeatherCard from './components/WeatherCard.svelte'
  import WeatherSkeleton from './components/WeatherSkeleton.svelte'
  import { buildLocationLabel, pickForecastSlices } from './lib/weather'

  const DEFAULT_CITY = 'Warsaw'
  const STORAGE_KEY = 'weather-recent-cities'

  let loading = false
  let error = ''
  let suggestions = []
  let unit = 'c'
  let recentCities = []
  let locationLabel = ''
  let data = null

  onMount(() => {
    recentCities = readStoredCities()
    if (recentCities.length > 0) {
      loadForecastForLocation(recentCities[0])
    } else {
      searchCity(DEFAULT_CITY)
    }
  })

  async function searchCity(query) {
    loading = true
    error = ''
    suggestions = []

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      )

      if (!response.ok) {
        throw new Error('Could not search locations right now.')
      }

      const payload = await response.json()

      if (!payload.results || payload.results.length === 0) {
        throw new Error('No matching city found. Try a different name.')
      }

      suggestions = payload.results.slice(1, 5)
      await loadForecastForLocation(payload.results[0])
    } catch (caughtError) {
      data = null
      locationLabel = ''
      error = caughtError.message || 'Something went wrong while fetching the forecast.'
    } finally {
      loading = false
    }
  }

  async function loadForecastForLocation(location) {
    loading = true
    error = ''

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,pressure_msl&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=6&wind_speed_unit=kmh`
      )

      if (!response.ok) {
        throw new Error('Could not load weather data right now.')
      }

      const forecast = await response.json()
      const slices = pickForecastSlices(forecast)

      data = {
        current: {
          temperature: forecast.current.temperature_2m,
          apparentTemperature: forecast.current.apparent_temperature,
          humidity: forecast.current.relative_humidity_2m,
          wind: forecast.current.wind_speed_10m,
          pressure: forecast.current.pressure_msl,
          precipitation: forecast.current.precipitation,
          code: forecast.current.weather_code,
          isDay: forecast.current.is_day === 1,
        },
        hourly: slices.hourly,
        daily: slices.daily,
      }

      locationLabel = buildLocationLabel(location)
      rememberCity(location)
    } catch (caughtError) {
      data = null
      locationLabel = ''
      error = caughtError.message || 'Something went wrong while fetching the forecast.'
    } finally {
      loading = false
    }
  }

  function readStoredCities() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  function rememberCity(location) {
    const compact = {
      name: location.name,
      country: location.country,
      country_code: location.country_code,
      admin1: location.admin1 || '',
      latitude: location.latitude,
      longitude: location.longitude,
    }

    recentCities = [compact, ...recentCities.filter((item) => !(item.name === compact.name && item.country_code === compact.country_code))].slice(0, 5)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCities))
  }

  function toggleUnit(nextUnit) {
    unit = nextUnit
  }
</script>

<svelte:head>
  <title>Skyglass Weather</title>
  <meta
    name="description"
    content="A polished Svelte weather dashboard with city search, current conditions and a short forecast."
  />
</svelte:head>

<div class="shell">
  <section class="app-card">
    <div class="intro">
      <div>
        <p class="tag">Skyglass Weather</p>
        <h1>Clean weather intel for the next few hours and days.</h1>
        <p class="lede">
          Search any city, switch temperature units instantly and keep your recent places close.
        </p>
      </div>

      <div class="unit-switch" aria-label="Temperature unit toggle">
        <button class:active={unit === 'c'} on:click={() => toggleUnit('c')}>°C</button>
        <button class:active={unit === 'f'} on:click={() => toggleUnit('f')}>°F</button>
      </div>
    </div>

    <SearchBar {loading} {suggestions} on:search={(event) => searchCity(event.detail)} on:pick={(event) => loadForecastForLocation(event.detail)} />

    {#if recentCities.length > 0}
      <section class="chips-section">
        <p class="section-label">Recent places</p>
        <div class="chips">
          {#each recentCities as city}
            <button class="chip" on:click={() => loadForecastForLocation(city)}>
              {city.name}
              <small>{city.country_code}</small>
            </button>
          {/each}
        </div>
      </section>
    {/if}

    {#if loading && !data}
      <WeatherSkeleton />
    {:else if error}
      <ErrorMessage title="Forecast unavailable" message={error} />
    {:else if data}
      <div class="results">
        <WeatherCard current={data.current} {locationLabel} {unit} />
        <ForecastStrip hourly={data.hourly} daily={data.daily} {unit} isDay={data.current.isDay} />
      </div>
    {/if}

    <footer>
      <span>Built with Svelte + Vite.</span>
      <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather data by Open-Meteo</a>
    </footer>
  </section>
</div>

<style>
  .shell {
    width: min(100%, 1080px);
  }

  .app-card {
    display: grid;
    gap: 1.25rem;
    padding: clamp(1.1rem, 2vw, 1.8rem);
    border-radius: 1.9rem;
    background: rgba(28, 3, 28, 0.62);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 28px 80px rgba(20, 4, 20, 0.32);
    backdrop-filter: blur(28px);
  }

  .intro {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;

    @media (max-width: 720px) {
      flex-direction: column;
    }
  }

  .tag {
    margin: 0 0 0.7rem;
    color: #fc7df3;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.82rem;
  }

  h1 {
    margin: 0;
    color: white;
    font-size: clamp(2rem, 5vw, 3.4rem);
    line-height: 1.05;
    max-width: 12ch;
  }

  .lede {
    margin: 0.9rem 0 0;
    max-width: 52ch;
    color: rgba(255, 255, 255, 0.75);
    font-size: 1.02rem;
  }

  .unit-switch {
    display: inline-grid;
    grid-auto-flow: column;
    gap: 0.35rem;
    padding: 0.35rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);

    button {
      border: 0;
      background: transparent;
      color: rgba(255, 255, 255, 0.82);
      border-radius: 999px;
      padding: 0.65rem 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s ease;

      &.active {
        color: #04111f;
        background: linear-gradient(135deg, #fc7de5, #fcb5fd);
      }
    }
  }

  .chips-section {
    display: grid;
    gap: 0.75rem;
  }

  .section-label {
    margin: 0;
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.83rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .chip {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: white;
    padding: 0.7rem 0.9rem;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    gap: 0.45rem;
    align-items: center;
    transition:
      transform 0.2s ease,
      background 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.11);
    }

    small {
      color: rgba(255, 255, 255, 0.62);
    }
  }

  .results {
    display: grid;
    gap: 1rem;
  }

  footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    color: rgba(255, 255, 255, 0.58);
    font-size: 0.92rem;

    a {
      color: #fdbad6;
      text-decoration: none;
    }
  }
</style>
