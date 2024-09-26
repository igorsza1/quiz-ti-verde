const questions = [
    {
        question: "O que significa TI Verde?",
        options: ["Tecnologia da Informação Verde", "Tecnologia Interna", "Tecnologia de Inovação"],
        answer: 0
    },
    {
        question: "Qual é o objetivo principal da TI Verde?",
        options: ["Maximizar o lucro", "Minimizar o impacto ambiental", "Aumentar a produção"],
        answer: 1
    },
    {
        question: "Qual dessas práticas NÃO faz parte da TI Verde?",
        options: ["Reciclagem de equipamentos", "Uso de energias renováveis", "Aumentar o consumo de energia"],
        answer: 2
    },
    {
        question: "Qual é o primeiro princípio dos 5 Rs da sustentabilidade?",
        options: ["Reduzir", "Reciclar", "Recusar", "Reutilizar"],
        answer: 2
    },
    {
        question: "Qual dos seguintes exemplos é uma prática de 'Reduzir'?",
        options: ["Comprar produtos em grandes quantidades", "Usar sacolas plásticas", "Descarte de produtos eletrônicos", "Comprar produtos descartáveis"],
        answer: 0
    },
    {
        question: "Qual é o R relacionado a transformar algo usado em um novo produto?",
        options: ["Recusar", "Reutilizar", "Reciclar", "Repensar"],
        answer: 2
    },
    {
        question: "Qual das seguintes atitudes se refere ao conceito de 'Reutilizar'?",
        options: ["Reparar um objeto quebrado", "Jogar fora uma roupa velha", "Comprar produtos novos", "Desperdiçar água"],
        answer: 0
    },
    {
        question: "O que significa 'Repensar' no contexto dos 5 Rs?",
        options: ["Pensar em maneiras de reduzir o consumo", "Comprar sem pensar nas consequências", "Ignorar os impactos ambientais", "Aumentar a produção de lixo"],
        answer: 0
    },
    {
        question: "Qual dos Rs incentiva a evitar produtos que geram resíduos?",
        options: ["Reciclar", "Recusar", "Reutilizar", "Reduzir"],
        answer: 1
    },
    {
        question: "O que é uma atitude sustentável no cotidiano?",
        options: ["Usar transporte público", "Comprar garrafas plásticas", "Usar sacolas plásticas", "Deixar o lixo no ambiente"],
        answer: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let playerName = "";
let timer;
let timeLeft = 10;
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

function startQuiz() {
    const nameInput = document.getElementById('name').value;
    if (nameInput === "") {
        alert("Por favor, digite seu nome.");
        return;
    }
    playerName = nameInput;
    document.getElementById('name-entry').style.display = "none";
    document.getElementById('quiz-container').style.display = "block";
    loadQuestion();
    document.getElementById("next-btn").style.display = "none";
}

function loadQuestion() {
    resetTimer();
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question").textContent = currentQuestion.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });

    startTimer();
}

function checkAnswer(selectedOption, button) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll(".option-btn");

    // Para o temporizador
    clearInterval(timer);

    // Desabilita todos os botões após selecionar a resposta
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    if (selectedOption === currentQuestion.answer) {
        button.classList.add("correct");
        score++;
        correctSound.play();  // Toca o som de resposta correta
    } else {
        button.classList.add("wrong");
        wrongSound.play();  // Toca o som de resposta errada
        // Mostra a resposta correta
        buttons[currentQuestion.answer].classList.add("correct");
    }

    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        saveScore();
        showRanking();
    }
    document.getElementById("next-btn").style.display = "none";
}

function saveScore() {
    let rankings = JSON.parse(localStorage.getItem("rankings")) || [];
    rankings.push({ name: playerName, score: score });
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem("rankings", JSON.stringify(rankings));
}

function showRanking() {
    const quizContainer = document.getElementById("quiz-container");
    const rankingContainer = document.getElementById("ranking-container");
    quizContainer.style.display = "none";
    rankingContainer.style.display = "block";

    const rankings = JSON.parse(localStorage.getItem("rankings")) || [];
    const rankingBody = document.getElementById("ranking-body");
    rankingBody.innerHTML = "";

    if (rankings.length === 0) {
        rankingBody.innerHTML = "<tr><td colspan='2'>Nenhum jogador registrado ainda.</td></tr>";
    } else {
        rankings.forEach(rank => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.textContent = rank.name;
            const scoreCell = document.createElement("td");
            scoreCell.textContent = rank.score;
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            rankingBody.appendChild(row);
        });
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('name-entry').style.display = "block";
    document.getElementById('ranking-container').style.display = "none";
    document.getElementById('name').value = "";
    resetTimer();
}

/* Temporizador */
function startTimer() {
    timeLeft = 10;
    document.getElementById("time-left").textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeOut();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById("time-left").textContent = timeLeft;
}

function timeOut() {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(btn => {
        btn.disabled = true;
    });
    wrongSound.play();  // Toca o som de tempo esgotado (errado)
    buttons[questions[currentQuestionIndex].answer].classList.add("correct");
    document.getElementById("next-btn").style.display = "block";
}
