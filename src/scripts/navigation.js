(() => {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const setActive = (hash) => {
    for (const link of links) {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  window.addEventListener('hashchange', () => setActive(window.location.hash));
  setActive(window.location.hash);
})();
