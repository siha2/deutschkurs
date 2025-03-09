// ÄÖÜäöüß
function toggleMenu() {
  var navLinks = document.getElementById('nav-links');
  var burger = document.querySelector('.burger');
  navLinks.classList.toggle('active');
  burger.classList.toggle('open');
}
// ================================================
// color settings

let mainColors = JSON.parse(localStorage.getItem("color_option"));
if (mainColors !== null) {
  document.documentElement.style.setProperty("--dark-main", mainColors[0]);
  document.documentElement.style.setProperty("--light-main", mainColors[1]);

  document.querySelectorAll(".colors-list span").forEach(element => {
    element.classList.remove("active");

    if (element.dataset.dark === mainColors[0] && element.dataset.light === mainColors[1]) {
      element.classList.add("active");
    }
  })
}

function toggleSettings() {
  var settings = document.querySelector('.settings');
  var gearicon = document.querySelector('.gear > i');
  settings.classList.toggle('show');
  gearicon.classList.toggle('spin');
}

const colorsoptions = document.querySelectorAll(".colors-list span");
colorsoptions.forEach(op => {
  op.addEventListener("click", (e) => {

    // set color on root
    document.documentElement.style.setProperty("--dark-main", e.target.dataset.dark);
    document.documentElement.style.setProperty("--light-main", e.target.dataset.light);

    localStorage.setItem("color_option", JSON.stringify([e.target.dataset.dark, e.target.dataset.light]));

    handleActive(e);
  });
});

function handleActive(ev) {
  ev.target.parentElement.querySelectorAll(".active").forEach(element => {
    element.classList.remove("active");
  });
  ev.target.classList.add("active");
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

// Global variables to store processed data once
let theData = { der: [], das: [], die: [] };
let pluralData = { s: [], _: [], er: [], e: [], n: [] };

// Dynamically generate table content from data.json
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      processData(data); // Process data into global variables
      addingTheTable();
      addingPluralTable();
    })
    .catch(error => console.error('Error fetching data:', error));

  // Process data into global objects once
  function processData(data) {
    data.forEach(el => {
      const [id, groupId, article, singular, pluralMarker, plural] = el;
      // Populate theData for "der", "das", "die" table
      if (article === "r") {
        theData.der.push(el);
      } else if (article === "s") {
        theData.das.push(el);
      } else if (article === "e") {
        theData.die.push(el);
      }
      // Populate pluralData for plural table
      if (pluralMarker === "s") {
        pluralData.s.push(el);
      } else if (pluralMarker === "-") {
        pluralData._.push(el);
      } else if (pluralMarker === "r") {
        pluralData.er.push(el);
      } else if (pluralMarker === "e") {
        pluralData.e.push(el);
      } else if (pluralMarker === "n") {
        pluralData.n.push(el);
      }
    });
  }

  function addingTheTable() {
    const tbody = document.querySelector('.tables .the tbody');
    tbody.innerHTML = ''; // Clear existing content
    const maxLength = Math.max(theData.der.length, theData.das.length, theData.die.length);

    for (let i = 0; i < maxLength; i++) {
      const row = document.createElement('tr');
      [theData.der, theData.das, theData.die].forEach(arr => {
        const cell = document.createElement('td');
        cell.textContent = arr[i] ? arr[i][3] : ''; // Use singular (index 3)
        cell.dataset.id = arr[i] ? arr[i][0] : ''; // Store id for sorting
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    }
  }

  function addingPluralTable() {
    const tbody = document.querySelector('.tables .plural tbody');
    tbody.innerHTML = ''; // Clear existing content
    const maxLength = Math.max(pluralData.s.length, pluralData._.length, pluralData.er.length, pluralData.e.length, pluralData.n.length);

    for (let i = 0; i < maxLength; i++) {
      const row = document.createElement('tr');
      [pluralData.s, pluralData._, pluralData.er, pluralData.e, pluralData.n].forEach(arr => {
        const cell = document.createElement('td');
        if (arr[i]) {
          cell.innerHTML = `<p><span class="arti">${arr[i][2]}</span><span>${arr[i][3]}</span></p> <p><span class="arti">e</span><span>${highlightDiff(arr[i][3], arr[i][5])}</span></p>`;
          cell.dataset.id = arr[i][0]; // Store id for sorting
        } else {
          cell.textContent = '';
        }
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    }
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
  const tbody = e.target.closest('.toggle-content').querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
      const text = cell.textContent.toLowerCase(); // Get text including nested spans
      if (text.includes(searchValue)) {
        cell.style.visibility = 'visible'; // Show matching cell (default display)
      } else {
        cell.style.visibility = 'hidden'; // Hide non-matching cell and collapse space
      }
    });
  });
}

function sorting() {
  const sortButton = this; // 'this' refers to the clicked sort button
  sortButton.classList.toggle("coloring");
  const sortIcon = sortButton.querySelector('i');
  const tbody = sortButton.closest('.toggle-content').querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');
  const colCount = rows[0].querySelectorAll('td').length;

  // Convert rows to a 2D array of cell contents by column
  const columns = Array.from({ length: colCount }, () => []);
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, index) => {
      columns[index].push({
        text: cell.innerHTML, // Preserve HTML structure
        id: cell.dataset.id || Infinity // Use id or Infinity for empty cells
      });
    });
  });

  // Toggle between alphabetical and ID sorting based on icon class
  if (sortIcon.classList.contains('icon-sort-amount-asc')) {
    // Sort alphabetically (ascending), empty cells last
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
  
  // Rebuild the table with sorted column data
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, colIndex) => {
      cell.innerHTML = columns[colIndex][rowIndex]?.text || '';
      cell.dataset.id = columns[colIndex][rowIndex]?.id || '';
    });
  });
}

function coloringArti() {
  const artis = document.querySelectorAll('.tables .plural tbody .arti');
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
// latest update date
lastUpdateElement = document.querySelector('.updateDate .latestupdate');

async function fetchLatestUpdateDate() {
  const response = await fetch('https://api.github.com/repos/siha2/deutschkurs/commits');
  const data = await response.json();
  const latestCommit = data[0];
  const latestUpdateDate = new Date(latestCommit.commit.committer.date);
  const formattedDate = latestUpdateDate.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
  });
  lastUpdateElement.textContent = formattedDate;
}
fetchLatestUpdateDate();
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

