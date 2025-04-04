// get header
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector(".settings-header").innerHTML = data;
      customizeHeader();
      let burger = document.querySelector(".burger");
      burger.classList.add("open");
    });
});

function customizeHeader() {
  document.querySelector("#nav-links").remove();
}

// ================================================
// switch tabs
document.querySelectorAll(".settings-sidebar li").forEach(item => {
  item.addEventListener("click", () => {
      document.querySelectorAll(".settings-sidebar li").forEach(li => li.classList.remove("active"));
      item.classList.add("active");

      document.querySelectorAll(".settings-section").forEach(section => section.classList.remove("active"));
      document.getElementById(item.dataset.section).classList.add("active");
  });
});
// ================================================
// change name

let nameInput1 = document.querySelector(".settings-section#profile input#first-name");
let nameInput2 = document.querySelector(".settings-section#profile input#last-name");
let button = document.querySelector(".settings-section#profile button");

button.addEventListener("click", () => {
  let fname = nameInput1.value;
  let lname = nameInput2.value;
  localStorage.setItem("user_name", JSON.stringify([fname, lname]));

  let nameSaved = document.createElement("div");
  nameSaved.className = "alert";
  nameSaved.innerHTML = `<p>Saved</p>`;
  document.querySelector(".settings-section#profile").appendChild(nameSaved);

  let progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  nameSaved.appendChild(progressBar);

  let progress = 0;
  let interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";
    
    if (progress >= 100) {
      clearInterval(interval);
      nameSaved.remove();
    }
  }, 30);
});
// ================================================
// print names in inputs
let full_name = JSON.parse(localStorage.getItem("user_name"));
if (full_name !== null) {
  nameInput1.value = full_name[0];
  nameInput2.value = full_name[1];
}

// ================================================
// set colors

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
// latest update date

const lastUpdateElement = document.querySelector('.settings-section#data .dates');
const toggleButton = document.getElementById('toggleButton');
let allDates = [];
let showingAll = false;

async function fetchLatestUpdateDates() {
  const response = await fetch('https://api.github.com/repos/siha2/deutschkurs/commits');
  const data = await response.json();

  allDates = data.map(commit => {
    const commitDate = new Date(commit.commit.committer.date);
    return commitDate.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  });
  renderDates();
}

function renderDates() {
  lastUpdateElement.innerHTML = ''; 
  const datesToShow = showingAll ? allDates : allDates.slice(0, 5);

  datesToShow.forEach(date => {
    const dateDiv = document.createElement('div');
    dateDiv.textContent = date;
    lastUpdateElement.appendChild(dateDiv);
  });

  toggleButton.style.display = allDates.length > 5 ? 'block' : 'none';
}

toggleButton.addEventListener('click', () => {
  showingAll = !showingAll;
  renderDates();
  toggleButton.textContent = showingAll ? 'Weniger anzeigen' : 'Mehr anzeigen';
});

fetchLatestUpdateDates();
