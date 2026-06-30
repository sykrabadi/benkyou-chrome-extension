async function getKanji() {
  try {
    // replace with real HTTP API URL
    let baseURL = ""
    const response = await fetch(baseURL);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

let currentIndex = 0
let totalQuestions = 0
let intervals = 0
let answeredQuestions = 0
let cards = []

function showSettings() {
  const quizScreen = document.getElementById("quiz-screen")
  quizScreen.style.display = "none"

  const settingsScreen = document.getElementById("settings-screen")
  settingsScreen.style.display = "block"

  answeredQuestions = 0
}

async function startSession() {
  const quizScreen = document.getElementById("quiz-screen")
  quizScreen.style.display = "block"

  const settingsScreen = document.getElementById("settings-screen")
  settingsScreen.style.display = "none"

  currentIndex = 0

  // read inputs
  const iTotalQuestions = document.getElementById("total-questions")
  totalQuestions = parseInt(iTotalQuestions.value)

  const iIntervals = document.getElementById("intervals")
  intervals = parseInt(iIntervals.value)

  cards = []
  for (let i = 0; i < totalQuestions; i++) {
    let card = await getKanji();
    cards.push(card)
  }
  
  renderCard(cards[0])
}

function renderCard(card) {
  const feedback = document.getElementById("feedback")
  feedback.style.display = "none"

  const pertanyaan = document.getElementById("pertanyaan")

  pertanyaan.innerHTML = card["question"]

  const container = document.getElementById("answer-container")
  const answerOptionClass = 'answer-option'

  // clear container
  const parent = document.getElementById('answer-container');
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  card["options"].forEach(answer => {
    const button = document.createElement("button")

    button.type = 'button'
    button.innerText = answer["option"]

    button.className = answerOptionClass

    button.addEventListener('click', () => {
      if (!answer["answer"]) {
        button.setAttribute('disabled', 'disabled')
      } else {
        const answerButtons = document.getElementsByClassName(answerOptionClass)
        for (let answerButton of answerButtons) {
          answerButton.disabled = true
        }

        const correctReading = document.getElementById("correct-reading")
        correctReading.innerText = answer["option"]

        const meaning = document.getElementById("meaning")
        meaning.innerText = card["meaning"]

        const feedback = document.getElementById("feedback")
        feedback.style.display = "block"

        setTimeout(() => {
          answeredQuestions = answeredQuestions + 1

          if (answeredQuestions == totalQuestions) {
            showSettings()
          } else {
            currentIndex = (currentIndex + 1) % cards.length
            renderCard(cards[currentIndex])
          }

        }, 500);
      }
    });

    container.append(button)
  })
}

(async () => {
  document.getElementById("start-button").addEventListener("click", startSession)
  showSettings()
})();