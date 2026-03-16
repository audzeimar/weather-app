<script>
  import { formatTemperature, formatWind, getWeatherMeta } from '../lib/weather'

  export let current = null
  export let locationLabel = ''
  export let unit = 'c'

  $: meta = current ? getWeatherMeta(current.code, current.isDay) : null
</script>

{#if current && meta}
  <section class="hero-card">
    <div class="copy">
      <p class="eyebrow">Current weather</p>
      <h2>{locationLabel}</h2>
      <div class="temperature-row">
        <span class="icon" aria-hidden="true">{meta.icon}</span>
        <span class="temp">{formatTemperature(current.temperature, unit)}</span>
      </div>
      <p class="summary">{meta.label} · feels like {formatTemperature(current.apparentTemperature, unit)}</p>
    </div>

    <dl class="metrics">
      <div>
        <dt>Humidity</dt>
        <dd>{current.humidity}%</dd>
      </div>
      <div>
        <dt>Wind</dt>
        <dd>{formatWind(current.wind, unit)}</dd>
      </div>
      <div>
        <dt>Pressure</dt>
        <dd>{Math.round(current.pressure)} hPa</dd>
      </div>
      <div>
        <dt>Rain</dt>
        <dd>{current.precipitation} mm</dd>
      </div>
    </dl>
  </section>
{/if}

<style>
  .hero-card {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
    gap: 1rem;
    padding: 1.35rem;
    border-radius: 1.6rem;
    background:
      radial-gradient(circle at top left, rgba(125, 211, 252, 0.24), transparent 35%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(20px);

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
    }
  }

  .copy {
    text-align: left;
  }

  .eyebrow {
    margin: 0 0 0.4rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.72);
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  h2 {
    margin: 0;
    color: white;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    line-height: 1.1;
  }

  .temperature-row {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin: 0.9rem 0 0.55rem;
  }

  .icon {
    font-size: 2.4rem;
  }

  .temp {
    font-size: clamp(2.7rem, 6vw, 4.6rem);
    font-weight: 800;
    line-height: 1;
    color: white;
  }

  .summary {
    margin: 0;
    color: rgba(255, 255, 255, 0.84);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
    margin: 0;
  }

  .metrics div {
    padding: 0.95rem;
    border-radius: 1.1rem;
    background: rgba(10, 17, 38, 0.3);
  }

  dt {
    margin-bottom: 0.35rem;
    font-size: 0.84rem;
    color: rgba(255, 255, 255, 0.68);
  }

  dd {
    margin: 0;
    color: white;
    font-weight: 700;
    font-size: 1.02rem;
  }
</style>
