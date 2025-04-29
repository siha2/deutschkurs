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
      const navLinks = document.querySelector("#nav-links");
      if (!navLinks) throw new Error("Nav links element (#nav-links) not found");
      navLinks.innerHTML = `
        <li><a href="/index.html">Hauptseite</a></li>
        <li><a href="settings.html">Einstellungen</a></li>
      `;
    });

  // Load tables
  const loadTables = fetch("components/main_tables.html")
    .then(response => {
      if (!response.ok) throw new Error(`Failed to fetch main_tables.html: ${response.status}`);
      return response.text();
    })
    .then(data => {
      const content = document.querySelector(".tables .content");
      if (!content) throw new Error("Tables content element (.tables .content) not found");
      content.innerHTML = data;
    });

  // After both header and tables are loaded, initialize features and events
  Promise.all([loadHeader, loadTables])
    .then(() => {
      // Add toggle event listeners
      document.querySelectorAll('.toggle-header, .nested-toggle-header').forEach(header => {
        header.addEventListener('click', function() {
          if (typeof toggleContent === "function") {
            toggleContent(this);
          } else {
            console.error("toggleContent function not found");
          }
        });
      });

      // Add search/sort features
      if (typeof addFeatures === "function") {
        addFeatures();
      } else {
        console.error("addFeatures function not found");
      }

      // Add event listener for "Neues Wort" button
      const neuesWort = document.querySelector('.add-word');
      if (neuesWort) {
        neuesWort.addEventListener('click', () => {
          const overlay = document.createElement('div');
          overlay.classList.add('popup-overlay');
          document.body.appendChild(overlay);

          const popup = document.createElement('div');
          popup.classList.add('popup');
          popup.innerHTML = `
            <button class="popup-close">X</button>
            <div class="popup-content">
              لسه شغال عليها
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
        });
      } else {
        console.warn("Neues Wort element (.neues-wort) not found");
      }
    })
    .catch(error => {
      console.error("Error during initialization:", error);
    });
});