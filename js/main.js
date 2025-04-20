// Header Loading
// =============
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector(".the-header").innerHTML = data;
    });
});

// Toggle Content
// =============
function toggleContent(element) {
  var content = element.nextElementSibling;
  var triangle = element.querySelector('.triangle');
  content.classList.toggle('active');
  triangle.classList.toggle('rotate');
}

document.querySelectorAll('.toggle-header, .nested-toggle-header').forEach(header => {
  header.addEventListener('click', function() {
    toggleContent(this);
  });
});

// Change Name
// =============
let nameContainer = document.querySelector(".welcome span.n");
let full_name = JSON.parse(localStorage.getItem("user_name"));
if (full_name !== null) {
  nameContainer.textContent = full_name[0] + " " + full_name[1];
}

// Get Data
// =============
let theData = { der: [], das: [], die: [] };
let pluralData = { s: [], _: [], er: [], e: [], n: [] };
let onlyPluralData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('words.json')
    .then(response => response.json())
    .then(data => {
      processData(data);
      addingTheTable();
      addingPluralTable();
      addingOnlyPluralTable();
    })
    .catch(error => console.error('Error fetching data:', error));

  function processData(data) {
    data.forEach(el => {
      const [id, groupId, article, singular, pluralMarker, plural] = el;
      if (article.startsWith("r")) {
        theData.der.push(el);
      } else if (article.startsWith("s")) {
        theData.das.push(el);
      } else if (article.startsWith("e")) {
        theData.die.push(el);
      }
      if (pluralMarker.startsWith("s")) {
        pluralData.s.push(el);
      } else if (pluralMarker.startsWith("-")) {
        pluralData._.push(el);
      } else if (pluralMarker.startsWith("er")) {
        pluralData.er.push(el);
      } else if (pluralMarker.startsWith("e")) {
        pluralData.e.push(el);
      } else if (pluralMarker.startsWith("n")) {
        pluralData.n.push(el);
      } else if (pluralMarker === "(pl)") {
        onlyPluralData.push(el);
      }
    });
  }

  function addingTheTable() {
    const columns = document.querySelectorAll('.tables .the .column');
    const bodies = Array.from(columns).map(col => col.querySelector('.body'));
    const headerNums = Array.from(columns).map(col => col.querySelector('.header .num'));
    const toggleNum = document.querySelector('.toggle.first .toggle-header .num');
    bodies.forEach(body => body.innerHTML = '');
    const maxLength = Math.max(theData.der.length, theData.das.length, theData.die.length);

    let totalCount = 0;
    [theData.der, theData.das, theData.die].forEach((arr, colIndex) => {
      const body = bodies[colIndex];
      let columnCount = 0;
      for (let i = 0; i < maxLength; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (arr[i] && arr[i].length === 7) {
          cell.classList.add("note");
          cell.dataset.singular = arr[i][3];
          cell.dataset.note = arr[i][6];
        }
        cell.textContent = arr[i] ? arr[i][3] : '';
        cell.dataset.id = arr[i] ? arr[i][0] : '';
        if (arr[i] && arr[i][3]) {
          columnCount++;
          totalCount++;
        }
        body.appendChild(cell);
      }
      headerNums[colIndex].textContent = columnCount;
    });

    toggleNum.textContent = totalCount;

    document.querySelectorAll('.tables .the .cell.note').forEach(cell => {
      if (cell.dataset.singular && cell.dataset.note) {
        cell.addEventListener('click', showPopup);
      }
    });
  }

  function addingPluralTable() {
    const columns = document.querySelectorAll('.tables .plural .column');
    const bodies = Array.from(columns).map(col => col.querySelector('.body'));
    const headerNums = Array.from(columns).map(col => col.querySelector('.header .num'));
    const toggleNum = document.querySelector('.toggle.second .toggle-header .num');
    bodies.forEach(body => body.innerHTML = '');
    const maxLength = Math.max(pluralData.s.length, pluralData._.length, pluralData.er.length, pluralData.e.length, pluralData.n.length);

    let totalCount = 0;
    [pluralData.s, pluralData._, pluralData.er, pluralData.e, pluralData.n].forEach((arr, colIndex) => {
      const body = bodies[colIndex];
      let columnCount = 0;
      for (let i = 0; i < maxLength; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (arr[i] && arr[i].length === 7) {
          cell.classList.add("note");
          cell.dataset.singular = arr[i][3];
          cell.dataset.note = arr[i][6];
        }
        if (arr[i]) {
          cell.innerHTML = `<p><span class="arti">${arr[i][2]}</span><span>${arr[i][3]}</span></p> <p><span class="arti">e</span><span>${highlightDiff(arr[i][3], arr[i][5])}</span></p>`;
          cell.dataset.id = arr[i][0];
          columnCount++;
          totalCount++;
        } else {
          cell.textContent = '';
        }
        body.appendChild(cell);
      }
      headerNums[colIndex].textContent = columnCount;
    });

    toggleNum.textContent = totalCount;

    document.querySelectorAll('.tables .plural .cell.note').forEach(cell => {
      if (cell.dataset.singular && cell.dataset.note) {
        cell.addEventListener('click', showPopup);
      }
    });
  }

  function addingOnlyPluralTable() {
    const body = document.querySelector('.tables .only-plural .body');
    const toggleNum = document.querySelector('.toggle.fourth .toggle-header .num');
    body.innerHTML = '';
    let totalCount = 0;
    onlyPluralData.forEach(el => {
      const cell = document.createElement('div');
      cell.classList.add('cell-only-plural', 'cell');
      cell.textContent = el[5];
      cell.dataset.id = el[0];
      cell.dataset.original = el[5];
      if (el[5]) {
        totalCount++;
      }
      body.appendChild(cell);
    });

    toggleNum.textContent = totalCount;
  }
});

// Highlight Difference
// =============
function highlightDiff(singular, plural) {
  const pluralForms = plural.split('/');
  let result = '';

  function compareAndHighlight(singular, pluralForm) {
    let highlighted = '';
    const maxLength = Math.max(singular.length, pluralForm.length);
    for (let i = 0; i < maxLength; i++) {
      if (singular[i] !== pluralForm[i]) {
        highlighted += `<span class="sp">${pluralForm[i] || ''}</span>`;
      } else {
        highlighted += pluralForm[i] || '';
      }
    }
    return highlighted;
  }

  if (pluralForms.length === 1) {
    result = compareAndHighlight(singular, pluralForms[0]);
  } else if (pluralForms.length === 2) {
    const firstPlural = compareAndHighlight(singular, pluralForms[0]);
    const secondPlural = compareAndHighlight(singular, pluralForms[1]);
    result = `${firstPlural} / ${secondPlural}`;
  }

  return result;
}

// Show Popup
// =============
function showPopup(event) {
  const cell = event.currentTarget;
  const singular = cell.dataset.singular;
  const note = cell.dataset.note;

  if (!singular || !note) return;

  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
    <button class="popup-close">X</button>
    <div class="popup-content">
      <strong>${singular}</strong><br>${note}
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.popup-close');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(popup);
    document.body.removeChild(overlay);
  });
  overlay.addEventListener('click', () => {
    document.body.removeChild(popup);
    document.body.removeChild(overlay);
  });
}

// Features
// =============
let search1 = document.querySelector('.first .features input[type="search"]');
let sort1 = document.querySelector('.first .features .sort');

let search2 = document.querySelector('.second .features input[type="search"]');
let sort2 = document.querySelector('.second .features .sort');
let coloring = document.querySelector('.second .features .coloring input[type="checkbox"]');

let search3 = document.querySelector('.fourth .features input[type="search"]');
let sort3 = document.querySelector('.fourth .features .sort');

search1.addEventListener('input', searching);
sort1.addEventListener('click', sorting);

search2.addEventListener('input', searching);
sort2.addEventListener('click', sorting);
coloring.addEventListener('click', coloringArti);

search3.addEventListener('input', searching);
sort3.addEventListener('click', sorting);

function searching(e) {
  const searchValue = e.target.value.toLowerCase();
  const toggleContent = e.target.closest('.toggle-content');
  const table = toggleContent.querySelector('.table');
  const bodies = table.querySelectorAll('.body');
  const toggleNum = toggleContent.closest('.toggle').querySelector('.toggle-header .num');
  let totalCount = 0;

  if (table.classList.contains('the') || table.classList.contains('plural')) {
    const headerNums = Array.from(table.querySelectorAll('.column .header .num'));
    bodies.forEach((body, colIndex) => {
      const cells = body.querySelectorAll('.cell');
      let columnCount = 0;
      cells.forEach(cell => {
        if (!cell.dataset.original) {
          cell.dataset.original = cell.innerHTML;
        }
        const text = cell.textContent.toLowerCase();
        if (text.includes(searchValue)) {
          cell.innerHTML = cell.dataset.original;
          cell.style.display = 'block';
          if (cell.textContent.trim()) {
            columnCount++;
            totalCount++;
          }
        } else {
          cell.style.display = 'none';
        }
      });
      headerNums[colIndex].textContent = columnCount;
    });
    toggleNum.textContent = totalCount;
  } else if (table.classList.contains('only-plural')) {
    const cells = bodies[0].querySelectorAll('.cell');
    cells.forEach(cell => {
      if (!cell.dataset.original) {
        cell.dataset.original = cell.innerHTML;
      }
      const text = cell.textContent.toLowerCase();
      if (text.includes(searchValue)) {
        cell.innerHTML = cell.dataset.original;
        cell.style.display = 'block';
        if (cell.textContent.trim()) {
          totalCount++;
        }
      } else {
        cell.style.display = 'none';
      }
    });
    toggleNum.textContent = totalCount;
  }
}

function sorting() {
  const sortButton = this;
  sortButton.classList.toggle("coloring");
  const sortIcon = sortButton.querySelector('i');
  const table = sortButton.closest('.toggle-content').querySelector('.table');
  const bodies = table.querySelectorAll('.body');

  const columns = Array.from(bodies).map(body => {
    const cells = body.querySelectorAll('.cell');
    return Array.from(cells).map(cell => {
      let sortText = cell.dataset.singular || '';
      if (!sortText) {
        const spans = cell.querySelectorAll('span');
        if (spans.length > 1) {
          sortText = spans[1].textContent;
        } else {
          sortText = cell.textContent;
        }
      }
      return {
        text: sortText,
        id: cell.dataset.id || Infinity,
        currentHTML: cell.innerHTML,
        classes: Array.from(cell.classList),
        singular: cell.dataset.singular || '',
        note: cell.dataset.note || ''
      };
    });
  });

  if (sortIcon.classList.contains('icon-sort-amount-asc')) {
    sortIcon.classList.remove('icon-sort-amount-asc');
    sortIcon.classList.add('icon-sort-alpha-asc');
    columns.forEach(col => col.sort((a, b) => {
      if (a.text === '' && b.text !== '') return 1;
      if (a.text !== '' && b.text === '') return -1;
      return a.text.localeCompare(b.text);
    }));
  } else {
    sortIcon.classList.remove('icon-sort-alpha-asc');
    sortIcon.classList.add('icon-sort-amount-asc');
    columns.forEach(col => col.sort((a, b) => a.id - b.id));
  }

  bodies.forEach((body, colIndex) => {
    const cells = body.querySelectorAll('.cell');
    columns[colIndex].forEach((item, rowIndex) => {
      const cell = cells[rowIndex];
      cell.className = 'cell';
      item.classes.forEach(cls => {
        if (cls !== 'cell') cell.classList.add(cls);
      });
      cell.innerHTML = item.currentHTML;
      cell.dataset.id = item.id;
      cell.dataset.original = item.currentHTML;
      cell.dataset.singular = item.singular;
      cell.dataset.note = item.note;
      if (cell.classList.contains('note')) {
        cell.removeEventListener('click', showPopup);
        if (item.singular && item.note) {
          cell.addEventListener('click', showPopup);
        }
      }
    });
  });

  const searchInput = table.closest('.toggle-content').querySelector('input[type="search"]');
  if (searchInput.value) {
    searching({ target: searchInput });
  }
}

function coloringArti() {
  const artis = document.querySelectorAll('.tables .plural .cell .arti');
  artis.forEach(arti => {
    if (arti.textContent === 's') {
      arti.classList.toggle('s');
    } else if (arti.textContent === 'r') {
      arti.classList.toggle('r');
    } else if (arti.textContent === 'e') {
      arti.classList.toggle('e');
    }
  });
}

// Date and Time Update
// =============
today = document.querySelector('.landing table .today');
date = document.querySelector('.landing table .date');
time = document.querySelector('.landing table .time');
function updateDateTime() {
  let todayDate = new Date();
  today.innerHTML = todayDate.toLocaleDateString('de-DE', {
    weekday: 'long'
  });
  date.innerHTML = todayDate.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  time.innerHTML = todayDate.toLocaleTimeString('de-DE', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
}
updateDateTime();
setInterval(updateDateTime, 1000);