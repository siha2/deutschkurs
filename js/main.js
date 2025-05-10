document.addEventListener("DOMContentLoaded", () => {
  // Load header
  const loadHeader = fetch("components/header.html")
    .then(response => {
      if (!response.ok) throw new Error(`Failed to fetch header.html: ${response.status}`);
      return response.text();
    })
    .then(data => {
      const header = document.querySelector(".the-header");
      if (!header) throw new Error("Header element (.the-header) not found");
      header.innerHTML = data;
      updateTexts();
    });

  // Load tables
  const loadTables = fetch("components/main_tables.html")
    .then(response => {
      if (!response.ok) throw new Error(`Failed to fetch main_tables.html: ${response.status}`);
      return response.text();
    })
    .then(data => {
      const target = document.querySelector(".tables .heading");
      if (!target) throw new Error("Tables heading (.tables .heading) not found");
      const newEl = document.createElement("div");
      newEl.innerHTML = data;
      target.after(...newEl.childNodes);
      updateTexts();
    });

  // After both header and tables are loaded, initialize tables and features
  Promise.all([loadHeader, loadTables])
    .then(() => {
      // Add toggle event listeners
      document.querySelectorAll('.toggle-header, .nested-toggle-header').forEach(header => {
        header.addEventListener('click', function() {
          toggleContent(this); // Assumes toggleContent is globally available from main_tables.js
        });
      });

      // Initialize table data (from main_tables.js)
      if (typeof initializeTables === "function") {
        initializeTables(); // Call the exposed function from main_tables.js
      } else {
        console.error("initializeTables function not found in main_tables.js");
      }

      // Add search/sort features
      if (typeof addFeatures === "function") {
        addFeatures(); // Call the exposed function from main_tables.js
      } else {
        console.error("addFeatures function not found in main_tables.js");
      }
    })
    .catch(error => {
      console.error("Error during initialization:", error);
    });

  // Change Name
  const nameContainer = document.querySelector(".welcome span.n");
  if (nameContainer) {
    const full_name = JSON.parse(localStorage.getItem("user_name"));
    if (full_name !== null) {
      nameContainer.textContent = full_name[0] + " " + full_name[1];
    }
  }

  // Date and Time Update
  const today = document.querySelector('.landing table .today');
  const date = document.querySelector('.landing table .date');
  const time = document.querySelector('.landing table .time');

  function updateDateTime() {
    const todayDate = new Date();

    const lang = localStorage.getItem('lang') || 'de';

    let locale = 'de-DE';
    if (lang === 'ar') locale = 'ar-EG';
    else if (lang === 'en') locale = 'en-US';

    if (today) {
      today.innerHTML = todayDate.toLocaleDateString(locale, { weekday: 'long' });
    }
    if (date) {
      date.innerHTML = todayDate.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (time) {
      time.innerHTML = todayDate.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
    }
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
});