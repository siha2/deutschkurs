let currentLang = localStorage.getItem("lang") || "de";
let translations = {};

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  localStorage.setItem("lang", lang);
  const langSelect = document.getElementById("langSelector");
  if (langSelect) {
    langSelect.value = lang;
  }
  updateTexts();
}

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.innerText = translations[key];
    }
  });
  document.body.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
}

window.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
});
