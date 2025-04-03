// get colors
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
// ================================================
