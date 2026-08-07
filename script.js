(() => {
  const frame = document.getElementById('appFrame');
  const loading = document.getElementById('loading');

  function hideLoading() {
    if (!loading) return;
    loading.style.opacity = '0';
    window.setTimeout(() => {
      loading.style.display = 'none';
    }, 300);
  }

  frame.addEventListener('load', hideLoading);
  window.setTimeout(hideLoading, 8000);

  // Register the PWA service worker only when the site is served
  // from GitHub Pages/HTTPS. Local file:// testing is intentionally ignored.
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', {scope: './'})
        .then(reg => console.log('[RAIDALL] Service worker registered:', reg.scope))
        .catch(err => console.error('[RAIDALL] Service worker registration failed:', err));
    });
  }
})();
