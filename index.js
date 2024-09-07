const inputs = document.querySelector(".word"),
  hintTag = document.querySelector(".hint span"),
  guessLeft = document.querySelector(".guess span"),
  mistakes = document.querySelector(".wrong span"),
  resetBtn = document.querySelector(".reset"),
  hintBtn = document.querySelector(".showhint"),
  hintElement = document.querySelector(".hint"),
  typeInput = document.querySelector(".type-input");
  

  const wordCounter = document.querySelector(".word-counter"); // Получаем элемент счетчика слов
// Инициализация переменных игры
let gameCount = 0; // Счетчик угаданных слов
let correctWordCount = 0; // Переменная для отслеживания угаданных слов
let maxWordCount = 15; // Количество отгадываемых слов

let currentWordCount = 1; // Счетчик текущего слова

let savedGame = null;

let word,
  incorrectLetters = [],
  correctLetters = [],
  maxGuesses;

let usedWords = [];

// Добавление функции для обновления счетчика слов
function updateWordCounter() {
  wordCounter.innerText = `Слово: ${currentWordCount}/${maxWordCount}`;
  currentWordCount++;
}

// Функция сохранения текущего состояния игры
function saveGame() {
  savedGame = {
    word: word, // Сохраняем загаданное слово
    incorrectLetters: incorrectLetters,  // Сохраняем неправильно введенные буквы
    correctLetters: correctLetters,  // Сохраняем правильно угаданные буквы
    maxGuesses: maxGuesses,  // Сохраняем максимальное количество попыток
    gameCount: gameCount,  // Сохраняем счетчик общего количества слов
    correctWordCount: correctWordCount  // Сохраняем счетчик правильно угаданных слов
  };
}
// Функция загрузки последнего состояния игры
function loadLastGame() {
    // Проверяем, есть ли сохраненные данные об игре
  if (savedGame) {
     // Восстоновление состояние игры из сохраненных данных
    word = savedGame.word;
    incorrectLetters = savedGame.incorrectLetters;
    correctLetters = savedGame.correctLetters;
    maxGuesses = savedGame.maxGuesses;
    guessLeft.innerText = maxGuesses;
    mistakes.innerText = incorrectLetters.join(", ");
    for (let i = 0; i < word.length; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.disabled = true;
      input.value = correctLetters.includes(word[i]) ? word[i] : "";
      inputs.appendChild(input);
    }
    gameCount = savedGame.gameCount;
    correctWordCount = savedGame.correctWordCount;
  }
}
// Выброр случайного слова из списка слов и начало игры
function startNewGame() {
    if (gameCount < maxWordCount) {
      gameCount++;
      updateWordCounter(); // Обновляем счетчик текущего слова
        // Показать элемент подсказки сразу после начала игры
      hintElement.style.display = "block";
      hintElement.style.opacity = "1";
      
      let ranWord = null;
      
      // Пока не найдём слово, которое ещё не использовалось, продолжаем искать
      do {
        ranWord = wordList[Math.floor(Math.random() * wordList.length)];
      } while (usedWords.includes(ranWord.word));
  
      // Добавляем найденное слово к использованным словам
      usedWords.push(ranWord.word);
  
      word = ranWord.word;
      maxGuesses = word.length >= 5 ? 8 : 6;
      incorrectLetters = [];
      correctLetters = [];
      hintTag.innerText = ranWord.hint;
      guessLeft.innerText = maxGuesses;
      mistakes.innerText = "";
    //  Ввод для каждой буквы слова
      inputs.innerHTML = "";
      for (let i = 0; i < word.length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.disabled = true;
        inputs.appendChild(input);
      }
    } else {
   // Очистка всех элементов, кроме результата
   document.querySelector(".word").innerHTML = ""; // очистить отображение букв
   document.querySelector(".info").innerHTML = ""; // очистить информацию о попытках и подсказке
   document.querySelector(".buttons").innerHTML = ""; // очистить кнопки
      
// Отображение результата
const resultText = `Вы отгадали ${correctWordCount} слов из ${maxWordCount}\n Обновите страницу для начала новой игры`;
const resultElement = document.createElement("div");
resultElement.classList.add("result");
resultElement.innerText = resultText;
document.body.appendChild(resultElement);

correctWordCount = 0; // Сброс счётчика угаданных слов
document.getElementById("correctWordCount").innerText = correctWordCount; // Обновление отображения счетчика
gameCount = 0; // Сброс счётчика общих попыток угадывания
usedWords = []; // Очистка массива использованных слов
}
}
  // Обрабатывать ввод пользователя и обновлять игровую статистику
function handleInput(e) {
  saveGame();
  // Игнорировать небуквенный ввод и буквы, которые уже угаданы
  const key = e.target.value.toLowerCase();
  if (key.match(/^[a-z]+$/i) && !incorrectLetters.includes(key) && !correctLetters.includes(key)) {
      // Проверить, есть ли буква в слове
    let letterFound = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === key) {
        inputs.querySelectorAll("input")[i].value = key;
        correctLetters.push(key);
        letterFound = true;
      }
    }

    if (!letterFound) {
      maxGuesses--;
      incorrectLetters.push(key);
      mistakes.innerText = incorrectLetters.join(", ");
    }
  }

  guessLeft.innerText = maxGuesses;
  if (correctLetters.length === word.length) {
    correctWordCount++; // Увеличиваем счетчик угаданных слов
    document.getElementById("correctWordCount").innerText = correctWordCount; // Отображаем счетчик угаданных слов в HTML

    startNewGame();
  } else if (maxGuesses < 1) {
    alert("Ты не смог отгадать это слово, надеюсь ты сможешь угадать следующее!");
    for (let i = 0; i < word.length; i++) {
      inputs.querySelectorAll("input")[i].value = word[i];
    }
  }
 // Очистить поле ввода
  typeInput.value = "";
}
// Показать элемент подсказки
function showHintElement() {
  hintElement.style.display = "block";
  hintElement.style.opacity = "1";
}
// Настройка прослушивателей событий
resetBtn.addEventListener("click", startNewGame);
hintBtn.removeEventListener("click", showHintElement);
typeInput.addEventListener("input", handleInput);
inputs.addEventListener("click", () => typeInput.focus());
document.addEventListener("keydown", () => typeInput.focus());

document.addEventListener('DOMContentLoaded', () => {
  loadLastGame();
  if (!savedGame) {
    startNewGame();
  }
});
``  