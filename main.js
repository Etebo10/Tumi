/* Dubai Real Estate Services — shared behavior */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');

  /* ---------- Nav scroll state + mobile toggle ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Skyline Index draw-in ---------- */
  document.querySelectorAll('.skyline-line').forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });
  document.querySelectorAll('.skyline-index').forEach(section => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          e.target.querySelectorAll('.skyline-line').forEach(p => { p.style.strokeDashoffset = 0; });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(section);
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Hero gold particles ---------- */
  document.querySelectorAll('.particles').forEach(field => {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDuration = (10 + Math.random() * 12) + 's';
      span.style.animationDelay = (Math.random() * 12) + 's';
      span.style.width = span.style.height = (1.5 + Math.random() * 2.5) + 'px';
      field.appendChild(span);
    }
  });

  /* ---------- Property filter (properties page) ---------- */
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('[data-community]');
  if (chips.length && cards.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const f = chip.dataset.filter;
        cards.forEach(card => {
          const show = f === 'all' || card.dataset.community === f;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Contact / enquiry form ---------- */
  const form = document.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form-success');
      form.querySelectorAll('input,select,textarea').forEach(el => el.value = '');
      if (success) success.classList.add('show');
    });
  }

  /* ---------- Leaflet map ---------- */
  const mapEl = document.getElementById('map');
  if (mapEl && window.L) {
    const map = L.map('map', { scrollWheelZoom: false }).setView([25.1972, 55.2744], 11.5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    const goldIcon = L.divIcon({
      className: 'gold-pin',
      html: '<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;background:#C9A15C;border:2px solid #14110E;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,.4)"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 16]
    });

    const spots = JSON.parse(mapEl.dataset.spots || '[]');
    spots.forEach(s => {
      L.marker([s.lat, s.lng], { icon: goldIcon }).addTo(map)
        .bindPopup(`<strong>${s.name}</strong><br>${s.note}`);
    });
  }

});
