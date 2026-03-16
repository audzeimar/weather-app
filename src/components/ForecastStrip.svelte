<script>
  import {
    formatDayLabel,
    formatTemperature,
    formatTimeLabel,
    getWeatherMeta,
  } from '../lib/weather'

  export let hourly = []
  export let daily = []
  export let unit = 'c'
  export let isDay = true
</script>

<section class="forecast-grid">
  <article class="panel">
    <header>
      <h3>Next hours</h3>
      <p>Quick glance at the next 6 forecast steps</p>
    </header>

    <div class="hourly-list">
      {#each hourly as item}
        {@const meta = getWeatherMeta(item.code, isDay)}
        <div class="forecast-item">
          <span class="time">{formatTimeLabel(item.time)}</span>
          <span class="icon" aria-hidden="true">{meta.icon}</span>
          <span class="temp">{formatTemperature(item.temperature, unit)}</span>
        </div>
      {/each}
    </div>
  </article>

  <article class="panel">
    <header>
      <h3>5-day outlook</h3>
      <p>Daily highs, lows and precipitation chance</p>
    </header>

    <div class="daily-list">
      {#each daily as item}
        {@const meta = getWeatherMeta(item.code, true)}
        <div class="forecast-item daily-item">
          <div>
            <strong>{formatDayLabel(item.time)}</strong>
            <p>{meta.label}</p>
          </div>

          <div class="daily-meta">
            <span>{meta.icon}</span>
            <span>{formatTemperature(item.max, unit)} / {formatTemperature(item.min, unit)}</span>
            <small>{item.precipitationProbability ?? 0}% rain</small>
          </div>
        </div>
      {/each}
    </div>
  </article>
</section>

<style>
  .forecast-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1.05fr 1.25fr;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .panel {
    padding: 1.15rem;
    border-radius: 1.4rem;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(18px);
  }

  header {
    margin-bottom: 1rem;

    h3 {
      margin: 0 0 0.3rem;
      color: white;
      font-size: 1rem;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.68);
      font-size: 0.94rem;
    }
  }

  .hourly-list,
  .daily-list {
    display: grid;
    gap: 0.8rem;
  }

  .hourly-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .forecast-item {
    display: grid;
    gap: 0.35rem;
    align-items: center;
    padding: 0.95rem;
    border-radius: 1.1rem;
    background: rgba(40, 9, 27, 0.32);
    color: white;
  }

  .time {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.87rem;
  }

  .icon {
    font-size: 1.4rem;
  }

  .temp {
    font-weight: 700;
  }

  .daily-item {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;

    p,
    small {
      margin: 0;
      color: rgba(255, 255, 255, 0.65);
    }
  }

  .daily-meta {
    display: grid;
    justify-items: end;
    gap: 0.18rem;
    text-align: right;

    span:first-child {
      font-size: 1.4rem;
    }
  }
</style>
