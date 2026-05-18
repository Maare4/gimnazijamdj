/* ============================================================
   GIMNAZIJA SMEDEREVO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. HAMBURGER MENU
  // ----------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------------
  // 2. SEARCH BAR TOGGLE
  // ----------------------------------------------------------
  const searchBtn   = document.getElementById('search-btn');
  const searchBar   = document.getElementById('search-bar');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchBar) {
    searchBtn.addEventListener('click', function () {
      searchBar.classList.add('open');
      if (searchInput) searchInput.focus();
    });
  }

  if (searchClose && searchBar) {
    searchClose.addEventListener('click', function () {
      searchBar.classList.remove('open');
      if (searchInput) searchInput.value = '';
    });
  }

  // Close search on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchBar && searchBar.classList.contains('open')) {
      searchBar.classList.remove('open');
      if (searchInput) searchInput.value = '';
    }
  });

  // ----------------------------------------------------------
  // 3. RASPORED ČASOVA — TABS (Prepodne / Popodne)
  // ----------------------------------------------------------
  const tabs = document.querySelectorAll('.stab');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetId = 'tab-' + tab.dataset.tab;

      // Update active tab button
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      // Show/hide schedule lists
      document.querySelectorAll('.schedule-list').forEach(function (list) {
        if (list.id === targetId) {
          list.hidden = false;
        } else {
          list.hidden = true;
        }
      });
    });
  });

  // ----------------------------------------------------------
  // 4. MINI CALENDAR
  // ----------------------------------------------------------
  const calGrid   = document.getElementById('cal-grid');
  const calEvents = document.getElementById('cal-events');
  const calTitle  = document.getElementById('cal-title');

  // Events to highlight (day number → label)
  const EVENTS = {
    8:  '8. apr — Rok za prijave za prijemni ispit',
    17: '17. apr — Pisani ispit iz matematike (IV razred)',
    24: '24. apr — Takmičenje iz srpskog jezika',
  };

  const TODAY   = new Date();
  const CUR_MONTH = 3;  // April (0-indexed)
  const CUR_YEAR  = 2026;

  const MONTH_NAMES = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ];

  const DAY_NAMES = ['P', 'U', 'S', 'Č', 'P', 'S', 'N'];

  function buildCalendar(year, month) {
    if (!calGrid) return;

    calGrid.innerHTML = '';
    calEvents.innerHTML = '';

    // Title
    if (calTitle) {
      calTitle.textContent = MONTH_NAMES[month] + ' ' + year + '.';
    }

    // Day name headers
    DAY_NAMES.forEach(function (name) {
      const el = document.createElement('div');
      el.className = 'cal-day-name';
      el.textContent = name;
      calGrid.appendChild(el);
    });

    // First day of month (Monday = 0)
    const firstDay = new Date(year, month, 1).getDay();
    const offset   = (firstDay === 0) ? 6 : firstDay - 1; // ISO week: Mon first

    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Blank cells before first day
    for (let i = 0; i < offset; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day other-month';
      calGrid.appendChild(el);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      el.textContent = d;

      const isToday = (
        d === TODAY.getDate() &&
        month === TODAY.getMonth() &&
        year === TODAY.getFullYear()
      );

      if (isToday) el.classList.add('today');
      if (EVENTS[d]) el.classList.add('has-event');

      calGrid.appendChild(el);
    }

    // Events list
    const eventDays = Object.keys(EVENTS).map(Number).sort(function (a, b) { return a - b; });
    eventDays.forEach(function (day) {
      const item = document.createElement('div');
      item.className = 'cal-event';

      const dot = document.createElement('div');
      dot.className = 'cal-event-dot';

      const text = document.createElement('span');
      text.className = 'cal-event-text';
      text.textContent = EVENTS[day];

      item.appendChild(dot);
      item.appendChild(text);
      calEvents.appendChild(item);
    });
  }

  buildCalendar(CUR_YEAR, CUR_MONTH);

  // ----------------------------------------------------------
  // 5. STICKY HEADER — add shadow on scroll
  // ----------------------------------------------------------
  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // 6. ACTIVE NAV LINK — highlight current page
  // ----------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPath) {
      // Remove active from all first
      document.querySelectorAll('nav a').forEach(function (a) {
        a.classList.remove('active');
      });
      link.classList.add('active');
    }
  });

});
