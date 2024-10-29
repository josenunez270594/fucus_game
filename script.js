// Array de objetos que contiene las imágenes y nombres de cada carta en el juego
const images = [
    { id: 1, name: 'Futuristic suits', image: 'images/img1.jpg.jpg' },
    { id: 2, name: 'Brain-Computer Interfaces', image: 'images/img2.jpg.jpg' },
    { id: 3, name: 'Taxi drone', image: 'images/img3.jpg.jpg' },
    { id: 4, name: 'Colonies on mars', image: 'images/img4.jpg.jpeg' },
    { id: 5, name: 'Assistant robots', image: 'images/img5.jpg.jpeg' },
    { id: 6, name: 'Futuristic cars', image: 'images/img6.jpg.jpeg' },
    { id: 7, name: 'Futuristic cities', image: 'images/img7.jpg.jpeg' },
    { id: 8, name: 'Advanced IA', image: 'images/img8.jpg.jpg' }
];

// Genera pares de cada imagen, uno que muestra la imagen y otro que muestra el nombre
let gameCards = images.flatMap(img => [
    { ...img, type: 'image' }, // Objeto con la imagen
    { ...img, type: 'text' } // Objeto con el nombre como texto
]).sort(() => 0.5 - Math.random()); // Mezcla aleatoriamente las cartas

// Variables para el manejo de la lógica del juego
let firstCard = null;  // Almacena la primera carta seleccionada
let secondCard = null; // Almacena la segunda carta seleccionada
let lockBoard = false; // Bloquea el tablero temporalmente mientras se verifica un match
let attempts = 10; // intentos
let score = 0; // puntaje
let matchesFound = 0; // Número de pares encontrados

// Referencias a elementos del DOM
const gameBoard = document.getElementById('game-board'); // Tablero de juego
const attemptsText = document.getElementById('attempts'); // Texto para mostrar intentos restantes
const scoreText = document.getElementById('score'); // Texto para mostrar la puntuación
const endMessage = document.getElementById('end-message'); // Mensaje de finalización
const endText = document.getElementById('end-text'); // Texto dentro del mensaje de finalización

// Inicializa el tablero de juego
function initializeGame() {
    gameBoard.innerHTML = ''; // Limpia el contenido del tablero

    // Crea cada carta y la añade al tablero
    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card'); // Clase 'card' para darle estilo
        cardElement.dataset.id = card.id; // Asigna el id de la carta
        cardElement.dataset.type = card.type; // Asigna el tipo (imagen o texto)

        if (card.type === 'image') {
            // Si la carta es de tipo imagen, añade la imagen al elemento
            const imgElement = document.createElement('img');
            imgElement.src = card.image;
            cardElement.appendChild(imgElement);
        } else {
             // Si la carta es de tipo texto, añade el nombre al elemento
            const textElement = document.createElement('span');
            textElement.textContent = card.name;
            cardElement.appendChild(textElement);
        }

        // Añade un evento de clic a cada carta para voltearla
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    // Reinicia los intentos, puntuación y contadores
    attempts = 10;
    score = 0;
    matchesFound = 0;
    updateScoreboard(); // Actualiza el marcador
    endMessage.classList.add('hidden'); // Oculta el mensaje de finalización
}

// Función para manejar el giro de las cartas
function flipCard() {
    if (lockBoard) return; // Si el tablero está bloqueado, no permite girar otra carta
    if (this === firstCard) return; // Evita que el jugador seleccione dos veces la misma carta

    this.classList.add('flipped'); // Añade la clase 'flipped' para mostrar la carta


    if (!firstCard) {
        // Si es la primera carta seleccionada
        firstCard = this;
        return;
    }

    // Si es la segunda carta seleccionada
    secondCard = this;
    lockBoard = true;// Bloquea el tablero temporalmente

    checkForMatch();// Verifica si las cartas coinciden
}

// Verifica si las cartas coinciden
function checkForMatch() {
    // Comprueba si las dos cartas tienen el mismo id y son de tipos diferentes (imagen y texto)
    const isMatch = firstCard.dataset.id === secondCard.dataset.id &&
                    firstCard.dataset.type !== secondCard.dataset.type;

    if (isMatch) {
        // Si coinciden, las deshabilita
        disableCards();
        score += 50;
        matchesFound++; // Aumenta el número de pares encontrados
    } else {
        // Si no coinciden, las voltea de nuevo y reduce los puntos e intentos
        unflipCards();
        score -= 10;
        attempts--;  // Resta un intento
    }

    updateScoreboard(); // Actualiza el marcador
    checkEndGame(); // Verifica si el juego ha terminado
}

// Deshabilita las cartas si coinciden
function disableCards() {
    // Remueve el evento de clic de las cartas emparejadas para que no puedan seleccionarse de nuevo
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('matched'); // Añade una clase que indica que la carta fue emparejada
    secondCard.classList.add('matched'); // Añade la misma clase a la segunda carta

    resetBoard(); // Reinicia las variables de selección de cartas
}

// Voltea las cartas si no coinciden
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard(); // Reinicia las variables de selección de cartas
    }, 1000); // Retraso de 1 segundo para que el jugador vea ambas cartas antes de voltearlas
}

// Actualiza el marcador
function updateScoreboard() {
    attemptsText.textContent = `Attempts: ${attempts}`; // Actualiza los intentos restantes
    scoreText.textContent = `Points ${score}`; // Actualiza la puntuación
}

// Verifica si el juego ha terminado
function checkEndGame() {
    if (matchesFound === images.length) {
        // Si se han encontrado todos los pares
        endText.textContent = `¡good job! you got ${score} points.`;
        endMessage.classList.remove('hidden'); // Muestra el mensaje de finalización
    } else if (attempts === 0) {
        // Si el jugador se queda sin intentos
        endText.textContent = `game over-Keep trying.`;
        endMessage.classList.remove('hidden'); // Muestra el mensaje de finalización
    }
}

// Reinicia el juego al hacer clic en el botón
function restartGame() {
    initializeGame(); // Llama a la función de inicialización para reiniciar el juego
}

// Reinicia las variables para continuar el juego
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false]; // Reinicia las variables y desbloquea el tablero
}

// Inicializamos el juego al cargar la página
initializeGame();
