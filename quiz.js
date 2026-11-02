const startButton = document.getElementById("start-quiz");
const quizForm = document.getElementById("quiz-form");

const timerDisplay = document.getElementById("timer");

let timerInterval = null;
let startedAt = null;
let quizFinished = false;

const timeLimit = 10 * 60 * 1000;

// Starts the timer and submits the quiz when time runs out.
startButton.addEventListener("click", function () {
    quizForm.hidden = false;
    startButton.disabled = true;
    quizFinished = false;
    startedAt = Date.now();
    timerDisplay.textContent = "10:00";

    timerInterval = setInterval(function () {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, timeLimit - elapsed);
        const secondsLeft = Math.ceil(remaining / 1000);
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        timerDisplay.textContent =
            minutes + ":" + String(seconds).padStart(2, "0");

        if (remaining === 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    quizForm.requestSubmit();
}
    }, 250);
});

const resetButton = document.getElementById("reset-quiz");
const resultsSection = document.getElementById("quiz-results");
const resultsSummary = document.getElementById("results-summary");
const questionResults = document.getElementById("question-results");

// Clears the quiz so the user can try again.
resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
    startedAt = null;
    quizFinished = false;
    timerDisplay.textContent = "10:00";

    quizForm.reset();

    quizForm.querySelectorAll("input").forEach(function (input) {
    input.disabled = false;

});

document.getElementById("submit-quiz").disabled = false;

resultsSummary.textContent = "";
questionResults.textContent = "";
resultsSection.hidden = true;
quizForm.hidden = true;
startButton.disabled = false;
startButton.focus();

});

// Stores the correct answers.
const answerKey = [
    {
        name: "q1",
        correct: ["hypertext transfer protocol"],
        answer: "Hypertext Transfer Protocol"
    },
    {
        name: "q2",
        correct: ["404"],
        answer: "404"
    },
    {
        name: "q3",
        correct: ["GET"],
        answer: "GET"
    },
    {
        name: "q4",
        correct: ["HTTP/3"],
        answer: "HTTP/3"
    },
    {
        name: "q5",
        correct: ["reuse"],
        answer: "Store resources so they can be reused."
    },
    {
        name: "q6",
        correct: ["encryption", "integrity", "authentication"],
        answer: "Encryption, data integrity, and server authentication."
    },
    {
        name: "q7",
        correct: ["request"],
        answer: "Sends requests for resources to a server."
    },
    {
        name: "q8",
        correct: ["200"],
        answer: "200 OK"
    },
    {
        name: "q9",
        correct: ["multiplexing"],
        answer: "Multiple streams sharing one connection through multiplexing."
    },
    {
        name: "q10",
        correct: ["independent"],
        answer: "Each request can be understood independently of earlier requests."
    }
];

// Checks the answers and shows the score and results.
quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (quizFinished || startedAt === null) {
        return;
    }

    quizFinished = true;
    clearInterval(timerInterval);
    timerInterval = null;

    const elapsed = Math.min(Date.now() - startedAt, timeLimit);
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeSpent = minutes + ":" + String(seconds).padStart(2, "0");

    const formData = new FormData(quizForm);
    let score = 0;

    questionResults.textContent = "";

    answerKey.forEach(function (question, index) {
        let userAnswers = formData.getAll(question.name);

        if (question.name === "q1" || question.name === "q2") {
            userAnswers = userAnswers.map(function (answer) {
                return answer.trim().toLowerCase().replace(/\s+/g, " ");
            });
        }

        const correct =
            userAnswers.length === question.correct.length &&
            question.correct.every(function (answer) {
                return userAnswers.includes(answer);
            });

        if (correct) {
            score++;
        }

        const feedback = document.createElement("p");
        feedback.className = correct ? "result-correct" : "result-incorrect";
        feedback.textContent =
            "Question " + (index + 1) + ": " +
            (correct ? "Correct" : "Incorrect") +
            " — " + (correct ? "1/1" : "0/1") +
            ". Correct answer: " + question.answer;

        questionResults.appendChild(feedback);
    });

    const passed = score >= 7;

    resultsSummary.className =
        passed ? "result-correct" : "result-incorrect";

    resultsSummary.textContent =
        (passed ? "PASS" : "FAIL") +
        " — Total score: " + score + "/10 (" + (score * 10) + "%)." +
        " Time spent: " + timeSpent + ".";

    quizForm.querySelectorAll("input").forEach(function (input) {
        input.disabled = true;
    });

    document.getElementById("submit-quiz").disabled = true;
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth" });
});