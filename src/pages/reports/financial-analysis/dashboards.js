(() => {
  'use strict';
  const dashboards = {
    yuhan: {name:'유한양행',url:'https://jinawinwin.github.io/Dart_Yuhan/'},
    sdbio: {name:'에스디바이오센서',url:'https://jinawinwin.github.io/Dart_SDbio/'},
    samsung: {name:'삼성전자',url:'https://jinawinwin.github.io/Dart_Samsung/'},
    lges: {name:'LG에너지솔루션',url:'https://hsc-class01.github.io/JY_LGES/'},
    lge: {name:'LG전자',url:'https://hsc-class01.github.io/JY_LGE/'},
    hynix: {name:'SK hynix',url:'https://jinawinwin.github.io/Dart_hynix/'}
  };
  const tabs = Array.from(document.querySelectorAll('[data-company]'));
  const panel = document.getElementById('dashboard-panel');
  let frame = document.getElementById('dashboard-frame');
  const original = document.getElementById('dashboard-original');
  const fallback = document.getElementById('dashboard-fallback');
  const name = document.getElementById('dashboard-name');
  const source = document.getElementById('dashboard-source');
  let current = null;
  function selectCompany(key, updateHistory) {
    if (!Object.prototype.hasOwnProperty.call(dashboards, key)) key = 'yuhan';
    const selected = dashboards[key];
    tabs.forEach(tab => {
      const active = tab.dataset.company === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', 'tab-' + key);
    name.textContent = selected.name;
    source.textContent = new URL(selected.url).hostname;
    original.href = selected.url;
    original.setAttribute('aria-label', selected.name + ' 원본 대시보드 새 탭에서 보기');
    fallback.href = selected.url;
    frame.title = selected.name + ' 재무데이터 분석 대시보드';
    const frameUrl = selected.url;
    if (frame.getAttribute('src') !== frameUrl) {
      // A fresh frame avoids adding a second, nested browser-history entry.
      const nextFrame = frame.cloneNode(false);
      nextFrame.src = frameUrl;
      frame.replaceWith(nextFrame);
      frame = nextFrame;
    }
    document.title = selected.name + ' · 재무데이터 분석 · jinawinwin';
    if (updateHistory && key !== current) {
      const url = new URL(window.location.href);
      url.searchParams.set('company', key);
      window.history.pushState(null, '', url);
    }
    current = key;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCompany(tab.dataset.company, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectCompany(tabs[next].dataset.company, true);
    });
  });
  const fromLocation = () => selectCompany(new URL(window.location.href).searchParams.get('company'), false);
  window.addEventListener('popstate', fromLocation);
  fromLocation();
})();
