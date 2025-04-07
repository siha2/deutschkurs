// ÄÖÜäöüß
// get header
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector(".the-header").innerHTML = data;
    });
});
// ================================================
// switch toggle
function toggleContent(element) {
  var content = element.nextElementSibling;
  var triangle = element.querySelector('.triangle');
  content.classList.toggle('active');
  triangle.classList.toggle('rotate');
}

// Attach toggleContent function to all toggle headers
document.querySelectorAll('.toggle-header, .nested-toggle-header').forEach(header => {
  header.addEventListener('click', function() {
    toggleContent(this);
  });
});

// ================================================
// change name
let nameContainer = document.querySelector(".welcome span.n");
let full_name = JSON.parse(localStorage.getItem("user_name"));
if (full_name !== null) {
  nameContainer.textContent = full_name[0] + " " + full_name[1];
}
// ================================================
// get data
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
    bodies.forEach(body => body.innerHTML = '');
    const maxLength = Math.max(theData.der.length, theData.das.length, theData.die.length);

    [theData.der, theData.das, theData.die].forEach((arr, colIndex) => {
      const body = bodies[colIndex];
      for (let i = 0; i < maxLength; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (arr[i] && arr[i].length === 7) {
          cell.classList.add("note");
          cell.dataset.singular = arr[i][3]; // Store the singular word
          cell.dataset.note = arr[i][6]; // Store the note
        }
        cell.textContent = arr[i] ? arr[i][3] : '';
        cell.dataset.id = arr[i] ? arr[i][0] : '';
        body.appendChild(cell);
      }
    });

    // Add click event listeners to note cells with data
    document.querySelectorAll('.tables .the .cell.note').forEach(cell => {
      if (cell.dataset.singular && cell.dataset.note) {
        cell.addEventListener('click', showPopup);
      }
    });
  }

  function addingPluralTable() {
    const columns = document.querySelectorAll('.tables .plural .column');
    const bodies = Array.from(columns).map(col => col.querySelector('.body'));
    bodies.forEach(body => body.innerHTML = '');
    const maxLength = Math.max(pluralData.s.length, pluralData._.length, pluralData.er.length, pluralData.e.length, pluralData.n.length);

    [pluralData.s, pluralData._, pluralData.er, pluralData.e, pluralData.n].forEach((arr, colIndex) => {
      const body = bodies[colIndex];
      for (let i = 0; i < maxLength; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (arr[i] && arr[i].length === 7) {
          cell.classList.add("note");
          cell.dataset.singular = arr[i][3]; // Store the singular word
          cell.dataset.note = arr[i][6]; // Store the note
        }
        if (arr[i]) {
          cell.innerHTML = `<p><span class="arti">${arr[i][2]}</span><span>${arr[i][3]}</span></p> <p><span class="arti">e</span><span>${highlightDiff(arr[i][3], arr[i][5])}</span></p>`;
          cell.dataset.id = arr[i][0];
        } else {
          cell.textContent = '';
        }
        body.appendChild(cell);
      }
    });

    // Add click event listeners to note cells with data
    document.querySelectorAll('.tables .plural .cell.note').forEach(cell => {
      if (cell.dataset.singular && cell.dataset.note) {
        cell.addEventListener('click', showPopup);
      }
    });
  }
});

function highlightDiff(singular, plural) {
  // If plural contains a "/", split it into two forms
  const pluralForms = plural.split('/');
  let result = '';

  // Function to compare and highlight differences between singular and a plural form
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

  // If there’s only one plural form
  if (pluralForms.length === 1) {
    result = compareAndHighlight(singular, pluralForms[0]);
  } 
  // If there are two plural forms
  else if (pluralForms.length === 2) {
    const firstPlural = compareAndHighlight(singular, pluralForms[0]);
    const secondPlural = compareAndHighlight(singular, pluralForms[1]);
    result = `${firstPlural} / ${secondPlural}`;
  }

  return result;
}

// Popup function (updated to check for data before showing)
function showPopup(event) {
  const cell = event.currentTarget;
  const singular = cell.dataset.singular;
  const note = cell.dataset.note;

  // Only show popup if both singular and note exist
  if (!singular || !note) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  // Create popup with singular and note
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
    <button class="popup-close">X</button>
    <div class="popup-content">
      <strong>Singular:</strong> ${singular}<br>
      <strong>Note:</strong> ${note}
    </div>
  `;
  document.body.appendChild(popup);

  // Close popup when "X" is clicked or overlay is clicked
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

// ================================================
// Features
let search1 = document.querySelector('.first .features input[type="search"]');
let sort1 = document.querySelector('.first .features .sort');

let search2 = document.querySelector('.second .features input[type="search"]');
let sort2 = document.querySelector('.second .features .sort');
let coloring = document.querySelector('.second .features .coloring input[type="checkbox"]');

// Event listeners
search1.addEventListener('input', searching);
sort1.addEventListener('click', sorting);

search2.addEventListener('input', searching);
sort2.addEventListener('click', sorting);
coloring.addEventListener('click', coloringArti);

function searching(e) {
  const searchValue = e.target.value.toLowerCase();
  const table = e.target.closest('.toggle-content').querySelector('.table');
  const bodies = table.querySelectorAll('.body');

  bodies.forEach(body => {
    const cells = body.querySelectorAll('.cell');
    cells.forEach(cell => {
      if (!cell.dataset.original) {
        cell.dataset.original = cell.innerHTML;
      }
      const text = cell.textContent.toLowerCase();
      if (text.includes(searchValue)) {
        cell.innerHTML = cell.dataset.original;
        cell.style.display = 'block';
      } else {
        cell.style.display = 'none';
      }
    });
  });
}

function sorting() {
  const sortButton = this;
  sortButton.classList.toggle("coloring");
  const sortIcon = sortButton.querySelector('i');
  const table = sortButton.closest('.toggle-content').querySelector('.table');
  const bodies = table.querySelectorAll('.body');

  const columns = Array.from(bodies).map(body => {
    const cells = body.querySelectorAll('.cell');
    return Array.from(cells).map(cell => ({
      text: cell.dataset.original || cell.innerHTML,
      id: cell.dataset.id || Infinity,
      currentHTML: cell.innerHTML,
      classes: Array.from(cell.classList),
      singular: cell.dataset.singular || '', // Preserve the singular word
      note: cell.dataset.note || '' // Preserve the note
    }));
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
      cell.dataset.original = item.text;
      cell.dataset.singular = item.singular; // Reapply the singular word
      cell.dataset.note = item.note; // Reapply the note
      // Only add listener if cell has both singular and note data
      if (cell.classList.contains('note')) {
        cell.removeEventListener('click', showPopup); // Remove old listener
        if (item.singular && item.note) {
          cell.addEventListener('click', showPopup); // Add listener only if data exists
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

// ================================================

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
// ================================================