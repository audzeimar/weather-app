<section class="skeleton-card" aria-hidden="true">
  <div class="skeleton headline"></div>
  <div class="skeleton hero"></div>
  <div class="grid">
    <div class="skeleton box"></div>
    <div class="skeleton box"></div>
    <div class="skeleton box"></div>
    <div class="skeleton box"></div>
  </div>
</section>

<style>
  .skeleton-card {
    display: grid;
    gap: 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .skeleton {
    border-radius: 1.3rem;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.09));
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
  }

  .headline {
    height: 2.5rem;
    width: 50%;
  }

  .hero {
    min-height: 240px;
  }

  .box {
    height: 120px;
  }

  @keyframes shimmer {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }
</style>
