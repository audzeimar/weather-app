<script>
  import { createEventDispatcher } from 'svelte'

  export let loading = false
  export let suggestions = []
  export let placeholder = 'Search for a city'

  const dispatch = createEventDispatcher()
  let city = ''

  function submit() {
    const trimmed = city.trim()
    if (!trimmed || loading) return
    dispatch('search', trimmed)
  }

  function chooseSuggestion(location) {
    city = location.name
    dispatch('pick', location)
  }
</script>

<div class="search-shell">
  <label class="search-label" for="city-search">City</label>
  <div class="search-row">
    <input
      id="city-search"
      bind:value={city}
      placeholder={placeholder}
      autocomplete="off"
      on:keydown={(event) => event.key === 'Enter' && submit()}
    />

    <button on:click={submit} disabled={loading}>
      {#if loading}
        Loading...
      {:else}
        Search
      {/if}
    </button>
  </div>

  {#if suggestions.length > 0}
    <div class="suggestions">
      {#each suggestions as location}
        <button class="suggestion" on:click={() => chooseSuggestion(location)}>
          <span>{location.name}</span>
          <small>{location.admin1 ? `${location.admin1}, ` : ''}{location.country}</small>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .search-shell {
    display: grid;
    gap: 0.85rem;
  }

  .search-label {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.78);
  }

  .search-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.8rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  input,
  button,
  .suggestion {
    font: inherit;
  }

  input {
    min-width: 0;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 1rem;
    background: rgba(33, 8, 28, 0.4);
    color: white;
    padding: 0.95rem 1rem;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease,
      background 0.2s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.55);
    }

    &:focus {
      outline: none;
      border-color: rgba(252, 125, 224, 0.65);
      background: rgba(33, 8, 26, 0.55);
      transform: translateY(-1px);
    }
  }

  button {
    border: 0;
    border-radius: 1rem;
    padding: 0.95rem 1.2rem;
    color: #1f041b;
    font-weight: 700;
    background: linear-gradient(135deg, #fc7df1, #fdb5d1);
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      opacity 0.2s ease;

    &:hover:enabled {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(76, 166, 255, 0.25);
    }

    &:disabled {
      cursor: progress;
      opacity: 0.72;
    }
  }

  .suggestions {
    display: grid;
    gap: 0.65rem;
  }

  .suggestion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 0.95rem;
    text-align: left;
    color: white;
    background: rgba(255, 255, 255, 0.08);

    small {
      color: rgba(255, 255, 255, 0.65);
    }
  }
</style>
