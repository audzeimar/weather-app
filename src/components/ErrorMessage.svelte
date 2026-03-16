<script>
  export let title = 'Something went wrong'
  export let message = 'Please try again in a moment.'
</script>

<section class="error-card" role="alert" aria-live="polite">
  <div class="icon">⚠️</div>
  <div>
    <h2>{title}</h2>
    <p>{message}</p>
  </div>
</section>

<style>
  .error-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    padding: 1rem 1.1rem;
    border-radius: 1.2rem;
    background: rgba(255, 99, 132, 0.14);
    border: 1px solid rgba(255, 99, 132, 0.35);
    color: white;
  }

  .icon {
    font-size: 1.5rem;
  }

  h2 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: white;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
  }
</style>
