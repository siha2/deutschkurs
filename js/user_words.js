// get header
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector(".the-header").innerHTML = data;
      document.querySelector("#nav-links").innerHTML = `
        <li><a href="index.html">Hauptseite</a></li>
        <li><a href="settings.html">Einstellungen</a></li>
      `;
    });
});
// ================================================