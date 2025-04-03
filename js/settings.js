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
lastUpdateElement = document.querySelector('.settings-section#data .dates');

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