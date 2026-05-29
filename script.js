/* ============================================================
   GIMNAZIJA SMEDEREVO — script.js
   Jedinstven JS za sve stranice sajta.

   Sadržaj:
   1.  ZAJEDNIČKI  — hamburger meni, pretraga, header shadow, active nav link
   2.  INDEX.HTML  — sidebar tabovi raspored, mini kalendar
   3.  RASPORED.HTML — smena, prikaz učenici/nastavnici, tabela časova
   4.  UCENICI.HTML — tabovi sekcija, udžbenici, kriterijumi accordion
   5.  UPIS.HTML   — tabovi sekcija, FAQ accordion, countdown
   6.  O-SKOLI.HTML — tabovi sekcija
   7.  VESTI.HTML  — filter dugmad
   8.  VEST.HTML   — učitavanje i prikaz vesti po URL ?id=
   9.  KONTAKT.HTML — validacija i slanje forme
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

/* ============================================================
   1. ZAJEDNIČKI — svi fajlovi
   ============================================================ */

  // ── HAMBURGER MENI ───────────────────────────────────────
  var hamburger   = document.getElementById('hamburger');
  var mainNav     = document.getElementById('main-nav');
  var siteHeader  = document.getElementById('site-header');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── PRETRAGA ─────────────────────────────────────────────
  var searchBtn   = document.getElementById('search-btn');
  var searchBar   = document.getElementById('search-bar');
  var searchClose = document.getElementById('search-close');
  var searchInput = document.getElementById('search-input');

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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchBar && searchBar.classList.contains('open')) {
      searchBar.classList.remove('open');
      if (searchInput) searchInput.value = '';
    }
  });

  // ── HEADER SHADOW NA SCROLL ───────────────────────────────
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.style.boxShadow = window.scrollY > 10
        ? '0 2px 12px rgba(0,0,0,0.10)'
        : 'none';
    }, { passive: true });
  }

  // ── ACTIVE NAV LINK (automatski po URL-u) ─────────────────
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    var href = link.getAttribute('href').split('/').pop().split('?')[0];
    if (href === currentPage) {
      document.querySelectorAll('nav a').forEach(function (a) { a.classList.remove('active'); });
      link.classList.add('active');
    }
  });

/* ============================================================
   2. INDEX.HTML — sidebar tabovi + mini kalendar
   ============================================================ */

  // ── TABOVI PREPODNE/POPODNE (sidebar widget) ──────────────
  document.querySelectorAll('.stab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = 'tab-' + tab.dataset.tab;
      document.querySelectorAll('.stab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.schedule-list').forEach(function (list) {
        list.hidden = (list.id !== targetId);
      });
    });
  });

  // ── MINI KALENDAR ─────────────────────────────────────────
  var calGrid   = document.getElementById('cal-grid');
  var calEvents = document.getElementById('cal-events');
  var calTitle  = document.getElementById('cal-title');

  if (calGrid) {
    var CAL_EVENTS = {
      8:  '8. апр — Рок за пријаве за пријемни испит',
      17: '17. апр — Пријемни испит из математике',
      24: '24. апр — Такмичење из српског језика',
    };
    var TODAY      = new Date();
    var CUR_MONTH  = 3;   // April (0-indexed)
    var CUR_YEAR   = 2026;
    var MONTH_NAMES = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];
    var DAY_NAMES   = ['P','U','S','Č','P','S','N'];

    if (calTitle) calTitle.textContent = MONTH_NAMES[CUR_MONTH] + ' ' + CUR_YEAR + '.';

    DAY_NAMES.forEach(function (name) {
      var el = document.createElement('div');
      el.className = 'cal-day-name';
      el.textContent = name;
      calGrid.appendChild(el);
    });

    var firstDay   = new Date(CUR_YEAR, CUR_MONTH, 1).getDay();
    var offset     = (firstDay === 0) ? 6 : firstDay - 1;
    var daysInMonth = new Date(CUR_YEAR, CUR_MONTH + 1, 0).getDate();

    for (var i = 0; i < offset; i++) {
      var blank = document.createElement('div');
      blank.className = 'cal-day other-month';
      calGrid.appendChild(blank);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;
      if (d === TODAY.getDate() && CUR_MONTH === TODAY.getMonth() && CUR_YEAR === TODAY.getFullYear())
        cell.classList.add('today');
      if (CAL_EVENTS[d]) cell.classList.add('has-event');
      calGrid.appendChild(cell);
    }

    if (calEvents) {
      Object.keys(CAL_EVENTS).map(Number).sort(function (a, b) { return a - b; }).forEach(function (day) {
        var item = document.createElement('div');
        item.className = 'cal-event';
        var dot  = document.createElement('div');  dot.className = 'cal-event-dot';
        var text = document.createElement('span'); text.className = 'cal-event-text'; text.textContent = CAL_EVENTS[day];
        item.appendChild(dot); item.appendChild(text);
        calEvents.appendChild(item);
      });
    }
  }

/* ============================================================
   3. RASPORED.HTML — tabela časova
   ============================================================ */

  if (document.getElementById('timetable-container')) {

    var DAYS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak'];

    var PERIODS = [
      { num: 1, time: '07:00–07:45' },
      { num: 2, time: '07:50–08:35' },
      { num: 3, time: '09:00–09:45' },
      { num: 4, time: '09:50–10:35' },
      { num: 5, time: '10:45–11:30' },
      { num: 6, time: '11:35–12:20' },
      { num: 7, time: '12:25–13:10' },
    ];

    var PERIODS_POP = [
      { num: 1, time: '13:30–14:15' },
      { num: 2, time: '14:20–15:05' },
      { num: 3, time: '15:25–16:10' },
      { num: 4, time: '16:15–17:00' },
      { num: 5, time: '17:10–17:55' },
      { num: 6, time: '18:00–18:45' },
      { num: 7, time: '18:50–19:35' },
    ];

    var COLOR = {
      'Српски језик': 'lang', 'Енглески језик': 'lang',
      'Немачки језик': 'lang', 'Француски језик': 'lang',
      'Математика': 'math',
      'Физика': 'sci', 'Хемија': 'sci', 'Биологија': 'sci', 'Информатика': 'sci',
      'Историја': 'soc', 'Географија': 'soc', 'Социологија': 'soc',
      'Филозофија': 'soc', 'Психологија': 'soc',
      'Музичка култура': 'art', 'Ликовна култура': 'art',
      'Физичко васпитање': 'sport',
    };

    var SCHEDULE = {
      pre: {
        'I/1': [
          [{s:'Српски језик',t:'Милић С.',r:'Кабинет 12'},{s:'Математика',t:'Петровић M.',r:'Кабинет 5'},{s:'Енглески језик',t:'Јовић A.',r:'Кабинет 8'},{s:'Физика',t:'Станић Р.',r:'Кабинет F'},{s:'Историја',t:'Лукић П.',r:'Кабинет 3'},{s:'Физичко васпитање',t:'Ђорђић Н.',r:'Сала 10'},{s:''}],
          [{s:'Математика',t:'Петровић M.',r:'Кабинет 5'},{s:'Биологија',t:'Марић T.',r:'Кабинет B'},{s:'Српски језик',t:'Милић С.',r:'Кабинет 12'},{s:'Хемија',t:'Илић K.',r:'Кабинет H'},{s:'Енглески језик',t:'Јовић A.',r:'Кабинет 8'},{s:'Географија',t:'Савић Л.',r:'Кабинет 6'},{s:''}],
          [{s:'Физика',t:'Станић Р.',r:'Кабинет F'},{s:'Српски језик',t:'Милић С.',r:'Кабинет 12'},{s:'Математика',t:'Петровић M.',r:'Кабинет 5'},{s:'Музичка култура',t:'Ковач Б.',r:'Кабинет 14'},{s:'Историја',t:'Лукић П.',r:'Кабинет 3'},{s:'Хемија',t:'Илић K.',r:'Кабинет H'},{s:''}],
          [{s:'Енглески језик',t:'Јовић A.',r:'Кабинет 8'},{s:'Информатика',t:'Тошић В.',r:'Кабинет IT'},{s:'Биологија',t:'Maрић T.',r:'Кабинет B'},{s:'Српски језик',t:'Милић С.',r:'Кабинет 12'},{s:'Математика',t:'Петровић M.',r:'Кабинет 5'},{s:''},{s:''}],
          [{s:'Географија',t:'Савић Л.',r:'Кабинет 6'},{s:'Физика',t:'Станић Р.',r:'Кабинет F'},{s:'Енглески језик',t:'Јовић A.',r:'Кабинет 8'},{s:'Ликовна култура',t:'Нешић Д.',r:'Кабинет 15'},{s:'Физичко васпитање',t:'Ђорђић Н.',r:'Сала 10'},{s:'Информатика',t:'Тошић В.',r:'Кабинет IT'},{s:''}],
        ],
        'I/2': [
          [{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Биологија',t:'Marić T.',r:'Кабинет B'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:''},{s:''}],
          [{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Историја',t:'Lukić P.',r:'Кабинет 3'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:''}],
          [{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Географија',t:'Savić L.',r:'Кабинет 6'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Музичка култура',t:'Kovač B.',r:'Кабинет 14'},{s:''}],
          [{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Информатика',t:'Tošić V.',r:'Кабинет IT'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Биологија',t:'Marić T.',r:'Кабинет B'},{s:''},{s:''}],
          [{s:'Историја',t:'Lukić P.',r:'Кабинет 3'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Географија',t:'Savić L.',r:'Кабинет 6'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Ликовна култура',t:'Nešić D.',r:'Кабинет 15'},{s:'Информатика',t:'Tošić V.',r:'Кабинет IT'},{s:''}],
        ],
        'III/1': [
          [{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:''}],
          [{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:''}],
          [{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Психологија',t:'Vasić G.',r:'Кабинет 7'},{s:''},{s:''}],
          [{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:''}],
          [{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:''},{s:''}],
        ],
        'III/2': [
          [{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:''},{s:''}],
          [{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:''}],
          [{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Психологија',t:'Vasić G.',r:'Кабинет 7'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:''}],
          [{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:''},{s:''}],
          [{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:''}],
        ],
      },
      pop: {
        'II/2': [
          [{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Биологија',t:'Marić T.',r:'Кабинет B'},{s:'Историја',t:'Lukić P.',r:'Кабинет 3'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:''}],
          [{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Географија',t:'Savić L.',r:'Кабинет 6'},{s:''}],
          [{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Музичка култура',t:'Kovač B.',r:'Кабинет 14'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:''},{s:''}],
          [{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Биологија',t:'Marić T.',r:'Кабинет B'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Информатика',t:'Tošić V.',r:'Кабинет IT'},{s:'Историја',t:'Lukić P.',r:'Кабинет 3'},{s:''}],
          [{s:'Географија',t:'Savić L.',r:'Кабинет 6'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Ликовна култура',t:'Nešić D.',r:'Кабинет 15'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:''}],
        ],
        'II/2': [
          [{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Историја',t:'Lukić P.',r:'Кабинет 3'},{s:''},{s:''}],
          [{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Биологија',t:'Marić T.',r:'Кабинет B'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:''}],
          [{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Географија',t:'Savić L.',r:'Кабинет 6'},{s:'Музичка култура',t:'Kovač B.',r:'Кабинет 14'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:''}],
          [{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Информатика',t:'Tošić V.',r:'Кабинет IT'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Биологија',t:'Marić T.',r:'Кабинет B'},{s:'Историја',t:'Lukić P.',r:'Кабинет 3'},{s:''}],
          [{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Географија',t:'Savić L.',r:'Кабинет 6'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Ликовна култура',t:'Nešić D.',r:'Кабинет 15'},{s:'Информатика',t:'Tošić V.',r:'Кабинет IT'},{s:''}],
        ],
        'IV/1': [
          [{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:''},{s:''}],
          [{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:''}],
          [{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Психологија',t:'Vasić G.',r:'Кабинет 7'},{s:''}],
          [{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:''},{s:''}],
          [{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Математика',t:'Petrović M.',r:'Кабинет 5'},{s:'Српски језик',t:'Milić S.',r:'Кабинет 12'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Енглески језик',t:'Jović A.',r:'Кабинет 8'},{s:''}],
        ],
        'IV/2': [
          [{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:''}],
          [{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:''}],
          [{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Психологија',t:'Vasić G.',r:'Кабинет 7'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:''}],
          [{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Физичко васпитање',t:'Đorđić N.',r:'Сала 10'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Енглески језик',t:'Nikolić S.',r:'Кабинет 9'},{s:'Физика',t:'Stanić R.',r:'Кабинет F'},{s:''}],
          [{s:'Хемија',t:'Ilić K.',r:'Кабинет H'},{s:'Српски језик',t:'Ćirić E.',r:'Кабинет 11'},{s:'Математика',t:'Jovanović R.',r:'Кабинет 4'},{s:'Социологија',t:'Ristić M.',r:'Кабинет 1'},{s:'Филозофија',t:'Bogić I.',r:'Кабинет 2'},{s:''},{s:''}],
        ],
      }
    };

    var TEACHER_SCHEDULE = {
      pre: {
        'Петровић М. (Математика)': [
          [{s:'I/1 — Математика',r:'Кабинет 5'},{s:'I/1 — Математика',r:'Кабинет 5'},{s:''},{s:'III/1 — Математика',r:'Кабинет 5'},{s:'III/1 — Математика',r:'Кабинет 5'},{s:''},{s:''}],
          [{s:'I/1 — Математика',r:'Кабинет 5'},{s:''},{s:'I/1 — Математика',r:'Кабинет 5'},{s:''},{s:'III/1 — Математика',r:'Кабинет 5'},{s:'III/1 — Математика',r:'Кабинет 5'},{s:''}],
          [{s:''},{s:'I/1 — Математика',r:'Кабинет 5'},{s:'I/1 — Математика',r:'Кабинет 5'},{s:''},{s:''},{s:''},{s:''}],
          [{s:''},{s:''},{s:''},{s:'I/1 — Математика',r:'Кабинет 5'},{s:'I/1 — Математика',r:'Кабинет 5'},{s:''},{s:''}],
          [{s:''},{s:''},{s:''},{s:''},{s:'III/1 — Математика',r:'Кабинет 5'},{s:''},{s:''}],
        ],
        'Милић С. (Српски језик)': [
          [{s:'I/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:'I/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:'III/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''}],
          [{s:''},{s:'I/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''},{s:'III/1 — Српски језик',r:'Кабинет 12'},{s:''}],
          [{s:''},{s:'I/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:'III/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''}],
          [{s:''},{s:''},{s:'I/1 — Српски језик',r:'Кабинет 12'},{s:'III/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''}],
          [{s:''},{s:'III/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''},{s:''},{s:''}],
        ],
      },
      pop: {
        'Петровић М. (Математика)': [
          [{s:'II/1 — Математика',r:'Кабинет 5'},{s:'II/1 — Математика',r:'Кабинет 5'},{s:''},{s:''},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:''},{s:''}],
          [{s:'II/1 — Математика',r:'Кабинет 5'},{s:''},{s:'II/1 — Математика',r:'Кабинет 5'},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:''},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:''}],
          [{s:''},{s:''},{s:'II/1 — Математика',r:'Кабинет 5'},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:''},{s:''},{s:''}],
          [{s:''},{s:'II/1 — Математика',r:'Кабинет 5'},{s:''},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:''},{s:''},{s:''}],
          [{s:''},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:'IV/1 — Математика',r:'Кабинет 5'},{s:''},{s:''},{s:'II/1 — Математика',r:'Кабинет 5'},{s:''}],
        ],
        'Милић С. (Српски језик)': [
          [{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:'IV/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''}],
          [{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:'IV/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''}],
          [{s:''},{s:''},{s:'IV/1 — Српски језик',r:'Кабинет 12'},{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''}],
          [{s:'IV/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''},{s:''}],
          [{s:''},{s:'IV/1 — Српски језик',r:'Кабинет 12'},{s:'II/1 — Српски језик',r:'Кабинет 12'},{s:''},{s:''},{s:''},{s:''}],
        ],
      }
    };

    var currentShift   = 'pre';
    var currentView    = 'ucenici';
    var currentClass   = null;
    var currentTeacher = null;

    window.setShift = function (shift) {
      currentShift = shift;
      document.getElementById('btn-pre').classList.toggle('active', shift === 'pre');
      document.getElementById('btn-pop').classList.toggle('active', shift === 'pop');
      var note = document.getElementById('shift-note-text');
      if (note) note.textContent = shift === 'pre'
        ? 'Преподневна смена — I и III разред похађају наставу преподне.'
        : 'Поподневна смена — I и III разред похађају наставу поподне.';
      currentClass = null; currentTeacher = null;
      renderView();
    };

    window.setView = function (view) {
      currentView = view;
      document.getElementById('btn-ucenici').classList.toggle('active', view === 'ucenici');
      document.getElementById('btn-nastavnici').classList.toggle('active', view === 'nastavnici');
      currentClass = null; currentTeacher = null;
      renderView();
    };

    function renderView() {
      var classTabs = document.getElementById('class-tabs');
      var classWrap = document.getElementById('class-tabs-wrap');

      if (currentView === 'ucenici') {
        classWrap.style.display = 'block';
        var classes = Object.keys(SCHEDULE[currentShift]).sort();
        classTabs.innerHTML = '';
        classes.forEach(function (cls) {
          var btn = document.createElement('button');
          btn.className = 'class-tab' + (cls === currentClass ? ' active' : '');
          btn.textContent = cls.toUpperCase();
          btn.addEventListener('click', function () {
            currentClass = cls;
            document.querySelectorAll('.class-tab').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderTimetable(SCHEDULE[currentShift][cls], DAYS, currentShift === 'pre' ? PERIODS : PERIODS_POP);
          });
          classTabs.appendChild(btn);
        });
        if (!currentClass) {
          currentClass = classes[0];
          classTabs.querySelector('.class-tab').classList.add('active');
        }
        renderTimetable(SCHEDULE[currentShift][currentClass], DAYS, currentShift === 'pre' ? PERIODS : PERIODS_POP);
      } else {
        classWrap.style.display = 'block';
        var teachers = Object.keys(TEACHER_SCHEDULE[currentShift]).sort();
        classTabs.innerHTML = '';
        teachers.forEach(function (t) {
          var btn = document.createElement('button');
          btn.className = 'class-tab' + (t === currentTeacher ? ' active' : '');
          btn.textContent = t.split(' ')[0] + ' ' + t.split(' ')[1];
          btn.title = t;
          btn.addEventListener('click', function () {
            currentTeacher = t;
            document.querySelectorAll('.class-tab').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderTimetable(TEACHER_SCHEDULE[currentShift][t], DAYS, currentShift === 'pre' ? PERIODS : PERIODS_POP, true);
          });
          classTabs.appendChild(btn);
        });
        if (!currentTeacher) {
          currentTeacher = teachers[0];
          classTabs.querySelector('.class-tab').classList.add('active');
        }
        renderTimetable(TEACHER_SCHEDULE[currentShift][currentTeacher], DAYS, currentShift === 'pre' ? PERIODS : PERIODS_POP, true);
      }
    }

    function renderTimetable(data, days, periods, isTeacher) {
      var container = document.getElementById('timetable-container');
      var html = '<table class="timetable"><thead><tr><th>Час</th>';
      days.forEach(function (d) { html += '<th>' + d + '</th>'; });
      html += '</tr></thead><tbody>';
      periods.forEach(function (p, pi) {
        html += '<tr><td class="period-cell"><span class="period-num">' + p.num + '.</span><span class="period-time">' + p.time + '</span></td>';
        days.forEach(function (d, di) {
          var lesson = (data[di] && data[di][pi]) ? data[di][pi] : {};
          if (!lesson.s) {
            html += '<td><div class="lesson-empty">—</div></td>';
          } else {
            var cc = COLOR[lesson.s] || '';
            html += '<td><div class="lesson-cell ' + cc + '">';
            html += '<span class="lesson-subject">' + lesson.s + '</span>';
            if (!isTeacher && lesson.t) html += '<span class="lesson-teacher">' + lesson.t + '</span>';
            if (lesson.r) html += '<span class="lesson-room">' + lesson.r + '</span>';
            html += '</div></td>';
          }
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }

    renderView();
  } // end raspored

/* ============================================================
   4. UCENICI.HTML — tabovi, udžbenici, kriterijumi accordion
   ============================================================ */

  // ── UDŽBENICI FILTER ─────────────────────────────────────
  if (document.getElementById('udzbenici-content')) {
    var UDZBENICI = {
      1: [
        ['Српски језик 1','Живковић, Марковић','Клет','978-86-7762-XXX'],
        ['Математика 1','Ковачевић, Станић','Клет','978-86-7762-XXX'],
        ['Енглески језик 1','Богдановић','Оксфорд','978-01-9478-XXX'],
        ['Физика 1','Маринковић, Ђорђић','Завод','978-86-1705-XXX'],
        ['Хемија 1','Петронић','Клет','978-86-7762-XXX'],
        ['Биологија 1','Пауновић, Милић','Клет','978-86-7762-XXX'],
        ['Историја 1','Ђурић, Павловић','Завод','978-86-1705-XXX'],
        ['Географија 1','Савић, Лукић','Клет','978-86-7762-XXX'],
      ],
      2: [
        ['Српски језик 2','Живковић, Марковић','Клет','978-86-7762-XXX'],
        ['Математика 2','Ковачевић, Станић','Клет','978-86-7762-XXX'],
        ['Енглески језик 2','Богдановић','Оксфорд','978-01-9478-XXX'],
        ['Физика 2','Маринковић, Ђорђић','Завод','978-86-1705-XXX'],
        ['Хемија 2','Петронић','Клет','978-86-7762-XXX'],
        ['Биологија 2','Пауновић, Милић','Клет','978-86-7762-XXX'],
        ['Историја 2','Ђурић, Павловић','Завод','978-86-1705-XXX'],
        ['Информатика и рачунарство','Тошић, Илић','Клет','978-86-7762-XXX'],
      ],
      3: [
        ['Српски језик 3','Живковић, Марковић','Клет','978-86-7762-XXX'],
        ['Математика 3','Ковачевић, Станић','Клет','978-86-7762-XXX'],
        ['Енглески језик 3','Богдановић','Оксфорд','978-01-9478-XXX'],
        ['Физика 3','Маринковић, Ђорђић','Завод','978-86-1705-XXX'],
        ['Хемија 3','Петронић','Клет','978-86-7762-XXX'],
        ['Филозофија','Богић, Ђорђевић','Клет','978-86-7762-XXX'],
        ['Социологија','Ристић','Завод','978-86-1705-XXX'],
        ['Психологија','Васић','Завод','978-86-1705-XXX'],
      ],
      4: [
        ['Српски језик 4','Живковић, Марковић','Клет','978-86-7762-XXX'],
        ['Математика 4','Ковачевић, Станић','Клет','978-86-7762-XXX'],
        ['Енглески језик 4','Богдановић','Оксфорд','978-01-9478-XXX'],
        ['Физика 4','Маринковић, Ђорђић','Завод','978-86-1705-XXX'],
        ['Хемија 4','Петронић','Клет','978-86-7762-XXX'],
        ['Филозофија 2','Богић, Ђорђевић','Клет','978-86-7762-XXX'],
        ['Социологија 2','Ристић','Завод','978-86-1705-XXX'],
      ],
    };

    function renderUdzbenici(razred) {
      var rows = UDZBENICI[razred].map(function (u) {
        return '<tr><td>' + u[0] + '</td><td>' + u[1] + '</td><td>' + u[2] + '</td><td style="font-size:11px;color:var(--gray-300)">' + u[3] + '</td></tr>';
      }).join('');
      document.getElementById('udzbenici-content').innerHTML =
        '<table class="udz-table"><thead><tr><th>Назив</th><th>Аутори</th><th>Издавач</th><th>ISBN</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }
    renderUdzbenici(1);

    document.querySelectorAll('.udz-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.udz-filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderUdzbenici(parseInt(btn.dataset.razred));
      });
    });
  }

  // ── KRITERIJUMI ACCORDION ─────────────────────────────────
  window.toggleKrit = function (header) {
    var body    = header.nextElementSibling;
    var chevron = header.querySelector('.krit-chevron');
    var isOpen  = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (chevron) chevron.classList.toggle('open', !isOpen);
  };

/* ============================================================
   5. UPIS.HTML & O-SKOLI.HTML — switchSection, FAQ, countdown
   ============================================================ */

  // ── SECTION TABS (upis + o-skoli) ────────────────────────
  window.switchSection = function (name) {
    document.querySelectorAll('.sec-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.content-section').forEach(function (s) { s.classList.remove('active'); });
    var tab = document.querySelector('[data-section="' + name + '"]');
    if (tab) { tab.classList.add('active'); tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
    var sec = document.getElementById('sec-' + name);
    if (sec) sec.classList.add('active');
    var sn = document.querySelector('.section-nav');
    if (sn) window.scrollTo({ top: sn.offsetTop - 80, behavior: 'smooth' });
  };

  // Registruj sec-tab klikove (koriste switchSection ili direktan click)
  document.querySelectorAll('.sec-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Pokušaj switchSection ako postoji; inače direktan click handler
      if (typeof switchSection === 'function' && tab.dataset.section) {
        switchSection(tab.dataset.section);
      } else {
        document.querySelectorAll('.sec-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.content-section').forEach(function (s) { s.classList.remove('active'); });
        tab.classList.add('active');
        var sec = document.getElementById('sec-' + tab.dataset.section);
        if (sec) sec.classList.add('active');
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  // Obradi URL hash (npr. upis.html#bodovanje)
  var urlHash = window.location.hash.replace('#', '');
  if (urlHash) {
    if (document.getElementById('sec-' + urlHash)) {
      switchSection(urlHash);
    } else {
      var hashTarget = document.querySelector('[data-section="' + urlHash + '"]');
      if (hashTarget) hashTarget.click();
    }
  }

  // ── FAQ ACCORDION ─────────────────────────────────────────
  window.toggleFaq = function (header) {
    var body    = header.nextElementSibling;
    var chevron = header.querySelector('.faq-chevron');
    var isOpen  = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (chevron) chevron.classList.toggle('open', !isOpen);
  };

  // ── COUNTDOWN (upis.html) ─────────────────────────────────
  var cdDays  = document.getElementById('cd-days');
  var cdHours = document.getElementById('cd-hours');
  var cdMins  = document.getElementById('cd-mins');

  if (cdDays && cdHours && cdMins) {
    function updateCountdown() {
      var deadline = new Date('2026-04-08T16:00:00');
      var diff     = deadline - new Date();
      if (diff <= 0) { cdDays.textContent = '0'; cdHours.textContent = '00'; cdMins.textContent = '00'; return; }
      cdDays.textContent  = Math.floor(diff / 86400000);
      cdHours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      cdMins.textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 30000);
  }

/* ============================================================
   6. UCENICI.HTML — direktni sec-tab (bez switchSection)
   ============================================================ */
  // Već pokriveno gore — sec-tab forEach registruje i direktan klik

/* ============================================================
   7. VESTI.HTML — filter dugmad
   ============================================================ */
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      document.querySelectorAll('.full-news-card').forEach(function (card) {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
      });
    });
  });

/* ============================================================
   8. VEST.HTML — učitavanje i prikaz vesti po ?id=
   ============================================================ */
  var articleMain = document.getElementById('article-main');
  if (articleMain) {

    var NEWS = {
      1: {
        title: 'Пријаве за пријемне испите за специјализована одељења Гимназије у Смедереву',
        date: '14. април 2026.', category: 'urgent', categoryLabel: 'Важно обавештење',
        body: '<p>Електронско пријављивање кандидата за полагање пријемног испита путем портала <strong>www.mojasrednjaskola.gov.rs</strong> је од среде 1. априла 2026. до среде 8. априла 2026. до 16:00.</p><p>Пријављивање кандидата за пријемни испит непосредно у матичним основним школама и у Гимназији је у уторак и среду 7. и 8. априла 2026. године од 09:00 до 16:00.</p><p>У Гимназији се организују пријемни испити за упис у <strong>филолошко</strong> и <strong>информатичко одељење</strong>.</p><h3>За филолошко одељење</h3><p>Полажу се пријемни испити из <strong>енглеског језика</strong> и <strong>српског језика и књижевности</strong>. Сваки испит носи максимално 20 бодова.</p><h3>За информатичко одељење</h3><p>Полаже се пријемни испит из <strong>математике</strong>. Испит носи максимално 40 бодова и траје 60 минута.</p><p>За пријављене кандидате организује се <strong>бесплатна припремна настава</strong> од 8. априла до дана полагања испита.</p><p>За додатне информације обратите се секретаријату школе на број <strong>026/617-383</strong>.</p>'
      },
      2: {
        title: 'Резултати републичког такмичења из математике — април 2026.',
        date: '10. април 2026.', category: 'info', categoryLabel: 'Такмичења',
        body: '<p>Ученици Гимназије Смедерево остварили су изванредне резултате на овогодишњем републичком такмичењу из математике.</p><h3>Награђени ученици</h3><ul><li><strong>Ана Јовановић (IV-a)</strong> — прво место, категорија старији узраст</li><li><strong>Стефан Ђорђевић (III-a)</strong> — треће место, категорија средњи узраст</li><li><strong>Никола Петровић (III-a)</strong> — похвала комисије</li></ul><p>Школа захваљује проф. Марији Петровић и проф. Радославу Јовановићу на припреми ученика.</p>'
      },
      3: {
        title: 'Завршна свечаност матураната — термин и организација',
        date: '7. април 2026.', category: 'event', categoryLabel: 'Догађај',
        body: '<p>Завршна свечаност матураната Гимназије Смедерево генерације 2025/2026. биће одржана у <strong>Дому културе у Смедереву</strong>.</p><p>Позивају се сви матуранти и њихови родитељи да присуствују овом свечаном догађају.</p><h3>Организационе напомене</h3><ul><li>Тачан термин биће накнадно објављен на овом сајту</li><li>Матуранти се моле да прате обавештења разредних старешина</li></ul>'
      },
      4: {
        title: 'Примери тестова са решењима — филолошко и информатичко одељење',
        date: '3. април 2026.', category: 'urgent', categoryLabel: 'Важно обавештење',
        body: '<p>Објављени су примери тестова са решењима за пријемне испите у филолошко и информатичко одељење Гимназије Смедерево.</p><h3>Филолошко одељење</h3><p>Примери тестова доступни су на сајту Министарства просвете. Кликом на линк отворите „Пробни тест".</p><h3>Информатичко одељење</h3><p>Примери тестова за рачунарски смер такође су доступни на сајту Министарства просвете.</p>'
      },
      5: {
        title: 'Распоред писаних задатака и вежби за април 2026.',
        date: '28. март 2026.', category: 'info', categoryLabel: 'Информација',
        body: '<p>Објављен је распоред писаних задатака и контролних вежби за април 2026. годину.</p><ul><li><strong>10. април</strong> — Математика, IV разред</li><li><strong>14. април</strong> — Српски језик, III разред</li><li><strong>17. април</strong> — Физика, II разред</li><li><strong>22. април</strong> — Хемија, I разред</li><li><strong>24. април</strong> — Енглески језик, II разред</li><li><strong>28. април</strong> — Математика, II разред</li></ul>'
      },
      6: {
        title: 'Обавештење о слободним активностима — пријаве до 30. марта',
        date: '21. март 2026.', category: 'event', categoryLabel: 'Активности',
        body: '<p>Ученици заинтересовани за слободне активности у школи могу се пријавити до <strong>30. марта 2026.</strong></p><ul><li>Секција за математику и физику</li><li>Литерарна секција</li><li>Драмска секција</li><li>Спортске секције (кошарка, одбојка, атлетика)</li><li>Информатичка секција</li></ul>'
      },
      7: {
        title: 'Планови наставе и учења за школску 2025/2026. годину',
        date: '15. март 2026.', category: 'info', categoryLabel: 'Информација',
        body: '<p>Објављени су планови наставе и учења за све предмете и разреде за школску 2025/2026. годину. Планови су доступни у секретаријату школе и на страни <a href="upis.html">Упис → Планови наставе</a>.</p>'
      },
      8: {
        title: 'Обавештење о осигурању ученика за 2025/2026. годину',
        date: '8. март 2026.', category: 'info', categoryLabel: 'Информација',
        body: '<p>Сви ученици Гимназије Смедерево осигурани су за школску 2025/2026. годину.</p><h3>У случају повреде</h3><p>Потребно је <strong>одмах обавестити разредног старешину</strong> који ће покренути поступак за исплату осигурања. Све повреде морају бити пријављене најкасније у року од 8 дана.</p>'
      }
    };

    var params  = new URLSearchParams(window.location.search);
    var vestId  = params.get('id') || '1';
    var article = NEWS[vestId] || NEWS['1'];

    document.title = article.title + ' — Гимназија Смедерево';
    var bcTitle = document.getElementById('bc-title');
    if (bcTitle) bcTitle.textContent = article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title;

    articleMain.innerHTML =
      '<div class="article-meta">' +
        '<span class="news-date">' + article.date + '</span>' +
        '<span class="news-category ' + article.category + '">' + article.categoryLabel + '</span>' +
      '</div>' +
      '<h1 class="article-title">' + article.title + '</h1>' +
      '<div class="article-body">' + article.body + '</div>' +
      '<div class="article-footer">' +
        '<a href="vesti.html" class="link-arrow">← Назад на сва обавештења</a>' +
        '<span style="font-size:12px;color:var(--gray-300)">Објављено: ' + article.date + '</span>' +
      '</div>';

    var sidebarLinks = document.getElementById('sidebar-links');
    if (sidebarLinks) {
      var otherIds = Object.keys(NEWS).filter(function (k) { return k !== vestId; }).slice(0, 5);
      sidebarLinks.innerHTML = otherIds.map(function (k) {
        var n = NEWS[k];
        var t = n.title.length > 48 ? n.title.substring(0, 48) + '...' : n.title;
        return '<a class="qlink" href="vest.html?id=' + k + '"><div class="qlink-left"><div class="qlink-dot"></div><span class="qlink-text">' + t + '</span></div></a>';
      }).join('') +
      '<a class="qlink" href="vesti.html" style="border-top:1px solid var(--gray-100)">' +
        '<div class="qlink-left"><div class="qlink-dot" style="background:var(--gray-300)"></div>' +
        '<span class="qlink-text" style="color:var(--red);font-weight:600">Сва обавештења →</span></div></a>';
    }
  }

/* ============================================================
   9. KONTAKT.HTML — validacija i slanje forme
   ============================================================ */
  window.submitForm = function () {
    var ime        = document.getElementById('ime') ? document.getElementById('ime').value.trim() : '';
    var prezime    = document.getElementById('prezime') ? document.getElementById('prezime').value.trim() : '';
    var email      = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    var tema       = document.getElementById('tema') ? document.getElementById('tema').value : '';
    var poruka     = document.getElementById('poruka') ? document.getElementById('poruka').value.trim() : '';
    var saglasnost = document.getElementById('saglasnost') ? document.getElementById('saglasnost').checked : false;

    if (!ime || !prezime || !email || !tema || !poruka) {
      alert('Молимо попуните сва обавезна поља означена звездицом (*).');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('Молимо унесите исправну е-пошту.');
      return;
    }
    if (!saglasnost) {
      alert('Молимо потврдите сагласност за обраду личних података.');
      return;
    }

    var btn = document.getElementById('submit-btn');
    if (btn) { btn.textContent = 'Слање...'; btn.disabled = true; }

    setTimeout(function () {
      var fc = document.getElementById('form-container');
      var fs = document.getElementById('form-success');
      if (fc) fc.style.display = 'none';
      if (fs) fs.style.display = 'block';
    }, 800);
  };

  window.resetForm = function () {
    ['ime','prezime','email','telefon','poruka'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var tema = document.getElementById('tema'); if (tema) tema.value = '';
    var sag  = document.getElementById('saglasnost'); if (sag) sag.checked = false;
    var btn  = document.getElementById('submit-btn');
    if (btn) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" style="stroke:white;fill:none;stroke-width:2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Пошаљи поруку';
      btn.disabled = false;
    }
    var fc = document.getElementById('form-container');
    var fs = document.getElementById('form-success');
    if (fc) fc.style.display = 'block';
    if (fs) fs.style.display = 'none';
  };

  // Ctrl+Enter za slanje forme
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter' && document.getElementById('poruka')) {
      window.submitForm();
    }
  });

}); // end DOMContentLoaded
