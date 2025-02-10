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
  var gearicon = document.querySelector('.gear > img');
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
// start sounds
function playNumberSound(number) {
  const audio = new Audio(`sounds/numbers/${number}.mp3`);
  audio.play();
}
document.querySelectorAll(".units .numbers .number").forEach(number => {
  number.addEventListener("click", function() {
    playNumberSound(parseInt(this.innerHTML));
  });
});
// end sounds
// ================================================
// dynamically generate table content from data.json
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      populateTheTable(data.the);
      populatePluralTable(data.plural);
    });

  function populateTheTable(theData) {
    const tbody = document.querySelector('.tables .the tbody');
    const keys = Object.keys(theData);
    const maxLength = Math.max(...keys.map(key => theData[key].length));

    for (let i = 0; i < maxLength; i++) {
      const row = document.createElement('tr');
      keys.forEach(key => {
        const cell = document.createElement('td');
        cell.textContent = theData[key][i] || '';
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    }
  }

  function populatePluralTable(pluralData) {
    const tbody = document.querySelector('.tables .plural tbody');
    const keys = Object.keys(pluralData);
    const maxLength = Math.max(...keys.map(key => pluralData[key].length));

    for (let i = 0; i < maxLength; i++) {
      const row = document.createElement('tr');
      keys.forEach(key => {
        const cell = document.createElement('td');
        const pair = pluralData[key][i] || [["",""], ["",""]];
        cell.innerHTML =  `<p><span class="arti">${pair[0][0]}</span><span>${pair[0][1]}</span></p> <p><span class="arti">${pair[1][0]}</span><span>${highlightDiff(pair[0][1],pair[1][1])}</span></p>`;
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

lastUpdateElement = document.querySelector('.updateDate .latestupdate');

async function fetchLatestUpdateDate() {
  const response = await fetch('https://api.github.com/repos/siha2/deutschkurs/commits');
  const data = await response.json();
  const latestCommit = data[0];
  const latestUpdateDate = new Date(latestCommit.commit.committer.date);
  const formattedDate = latestUpdateDate.toLocaleDateString('en-US', {
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