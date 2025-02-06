// ÄÖÜäöüß
function toggleMenu() {
  var navLinks = document.getElementById('nav-links');
  var burger = document.querySelector('.burger');
  // var overlay = document.querySelector('.overlay');
  navLinks.classList.toggle('active');
  burger.classList.toggle('open');
  // overlay.classList.toggle('popup');
}

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

// start sounds
// function playNumberSound(number) {
//   const audio = new Audio(`sounds/numbers/${number}.mp3`);
//   audio.play();
// }
// document.querySelectorAll(".units .numbers .number").forEach(number => {
//   number.addEventListener("click", function() {
//     playNumberSound(parseInt(this.innerHTML));
//   });
// });
// end sounds

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

