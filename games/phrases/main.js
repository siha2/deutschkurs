const phrases = [
  "Wie geht es dir? 😊",
  "Das Wetter ist schön heute. ☀️",
  "Hast du Hunger? 🍽️",
  "Ich trinke gerne Kaffee. ☕",
  "Was hast du gestern gemacht? ❓",
  "Ich war zu Hause. 🏠",
  "Ich habe eine Frage. 🙋‍♂️",
  "Kannst du mir helfen? 🆘",
  "Wo ist der Bahnhof? 🚉",
  "Wie spät ist es? ⏰",
  "Ich verstehe nicht. 🤔",
  "Können Sie das bitte wiederholen? 🔁",
  "Alles klar! 👍"
];



const button = document.getElementById("showPhrase");
const display = document.getElementById("phraseDisplay");

button.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  display.textContent = phrases[randomIndex];
});
