// ÄÖÜäöüß
function toggleMenu() {
  var navLinks = document.getElementById('nav-links');
  var burger = document.querySelector('.burger');
  navLinks.classList.toggle('active');
  burger.classList.toggle('open');
}
// ================================================

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
      if (article === "r") {
        theData.der.push(el);
      } else if (article === "s") {
        theData.das.push(el);
      } else if (article === "e") {
        theData.die.push(el);
      }
      if (pluralMarker === "s") {
        pluralData.s.push(el);
      } else if (pluralMarker === "-") {
        pluralData._.push(el);
      } else if (pluralMarker === "er") {
        pluralData.er.push(el);
      } else if (pluralMarker === "e") {
        pluralData.e.push(el);
      } else if (pluralMarker === "n") {
        pluralData.n.push(el);
      } else if (singular === "" && pluralMarker === "" && plural !== "") {
        onlyPluralData.push(el);
      }
    });
  }

  function addingTheTable() {
    const columns = document.querySelectorAll('.tables .the .column');
    const bodies = Array.from(columns).map(col => col.querySelector('.body'));
    bodies.forEach(body => body.innerHTML = ''); // Clear existing content
    const maxLength = Math.max(theData.der.length, theData.das.length, theData.die.length);

    // Add cells to each column
    [theData.der, theData.das, theData.die].forEach((arr, colIndex) => {
      const body = bodies[colIndex];
      for (let i = 0; i < maxLength; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (arr[i] && arr[i].length === 7) {
          cell.classList.add("note");
        }
        cell.textContent = arr[i] ? arr[i][3] : '';
        cell.dataset.id = arr[i] ? arr[i][0] : ''; // Store id for sorting
        body.appendChild(cell);
      }
    });
  }

  function addingPluralTable() {
    const columns = document.querySelectorAll('.tables .plural .column');
    const bodies = Array.from(columns).map(col => col.querySelector('.body'));
    bodies.forEach(body => body.innerHTML = ''); // Clear existing content
    const maxLength = Math.max(pluralData.s.length, pluralData._.length, pluralData.er.length, pluralData.e.length, pluralData.n.length);

    // Add cells to each column
    [pluralData.s, pluralData._, pluralData.er, pluralData.e, pluralData.n].forEach((arr, colIndex) => {
      const body = bodies[colIndex];
      for (let i = 0; i < maxLength; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (arr[i] && arr[i].length === 7) {
          cell.classList.add("note");
        }
        if (arr[i]) {
          cell.innerHTML = `<p><span class="arti">${arr[i][2]}</span><span>${arr[i][3]}</span></p> <p><span class="arti">e</span><span>${highlightDiff(arr[i][3], arr[i][5])}</span></p>`;
          cell.dataset.id = arr[i][0]; // Store id for sorting
        } else {
          cell.textContent = '';
        }
        body.appendChild(cell);
      }
    });
  }
});

function highlightDiff(singular, plural) {
  let result = '';
  const maxLength = Math.max(singular.length, plural.length);
  for (let i = 0; i < maxLength; i++) {
    if (singular[i] !== plural[i]) {
      result += `<span class="sp">${plural[i] || ''}</span>`;
    } else {
      result += plural[i] || '';
    }
  }
  return result;
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
      // Store original content in data attribute if not already stored
      if (!cell.dataset.original) {
        cell.dataset.original = cell.innerHTML;
      }
      const text = cell.textContent.toLowerCase();
      if (text.includes(searchValue)) {
        cell.innerHTML = cell.dataset.original; // Restore original content
        cell.style.display = 'block'; // Show matching cell
      } else {
        cell.style.display = 'none'; // Hide and collapse non-matching cell
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
  const colCount = bodies.length;

  // Convert columns to arrays of cell contents
  const columns = Array.from(bodies).map(body => {
    const cells = body.querySelectorAll('.cell');
    return Array.from(cells).map(cell => ({
      text: cell.dataset.original || cell.innerHTML, // Use original content if available
      id: cell.dataset.id || Infinity,
      currentHTML: cell.innerHTML // Store current displayed content
    }));
  });

  if (sortIcon.classList.contains('icon-sort-amount-asc')) {
    sortIcon.classList.remove('icon-sort-amount-asc');
    sortIcon.classList.add('icon-sort-alpha-asc');
    columns.forEach(col => col.sort((a, b) => {
      if (a.text === '' && b.text !== '') return 1; // Empty after non-empty
      if (a.text !== '' && b.text === '') return -1; // Non-empty before empty
      return a.text.localeCompare(b.text); // Alphabetical order
    }));
  } else {
    // Sort by ID (original order)
    sortIcon.classList.remove('icon-sort-alpha-asc');
    sortIcon.classList.add('icon-sort-amount-asc');
    columns.forEach(col => col.sort((a, b) => a.id - b.id));
  }

  // Rebuild the columns with sorted data
  bodies.forEach((body, colIndex) => {
    const cells = body.querySelectorAll('.cell');
    columns[colIndex].forEach((item, rowIndex) => {
      const cell = cells[rowIndex];
      cell.innerHTML = item.currentHTML; // Restore current content (post-search)
      cell.dataset.id = item.id;
      cell.dataset.original = item.text; // Update original content
      cell.style.display = item.currentHTML ? 'block' : 'none'; // Preserve visibility
    });
  });

  // Reapply search filter after sorting
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
  // timeStyle: 'short',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
});
}
updateDateTime(); 
setInterval(updateDateTime, 1000); 
// ================================================

