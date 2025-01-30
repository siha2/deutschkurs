function toggleMenu() {
  var navLinks = document.getElementById('nav-links');
  var burger = document.querySelector('.burger');
  navLinks.classList.toggle('active');
  burger.classList.toggle('open');
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

// function playNumberSound(number) {
//   const audio = new Audio(`sounds/numbers/${number}.mp3`);
//   audio.play();
// }

// document.querySelectorAll(".units .numbers .number").forEach(number => {
//   number.addEventListener("click", function() {
//     playNumberSound(parseInt(this.innerHTML));
//   });
// });

