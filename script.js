// Array de objetos que representa las cartas del juego, cada una tiene un 'id' único y la ruta de la imagen correspondiente.
const cards = [
    { id: 1, image: 'images/img1.jpg' },
    { id: 2, image: 'images/img2.jpg' },
    { id: 3, image: 'images/img3.jpg' },
    { id: 4, image: 'images/img4.jpg' },
    { id: 5, image: 'images/img5.jpg' },
    { id: 6, image: 'images/img6.jpg' }
];

// Duplicamos las cartas para crear parejas y las mezclamos aleatoriamente usando 'sort()' con una función que retorna un número aleatorio.
let gameCards = [...cards, ...cards].sort(() => 0.5 - Math.random());

let firstCard = null;  // Variable para almacenar la primera carta seleccionada.
let secondCard = null; // Variable para almacenar la segunda carta seleccionada.
let lockBoard = false; // Bandera que evita que el jugador voltee más de dos cartas a la vez.
let matches = 0;       // Contador de parejas encontradas.

// Selecciona el elemento del tablero del DOM y el texto de estado.
const gameBoard = document.getElementById('game-board');
const statusText = document.getElementById('status');

// Función que inicializa el tablero de juego, generando dinámicamente los elementos HTML para las cartas.
function initializeGame() {
    gameBoard.innerHTML = '';  // Limpia cualquier contenido anterior en el tablero.
    
    // Recorre cada carta en 'gameCards' y crea los elementos correspondientes en el DOM.
    gameCards.forEach(card => {
        const cardElement = document.createElement('div');  // Crea un div para cada carta.
        cardElement.classList.add('card');  // Agrega la clase 'card' al elemento.
        cardElement.dataset.id = card.id;   // Asigna el 'id' de la carta como un atributo de datos para identificarla.

        const imgElement = document.createElement('img');  // Crea el elemento img para la imagen.
        imgElement.src = card.image;  // Asigna la fuente de la imagen correspondiente.

        cardElement.appendChild(imgElement);  // Añade la imagen al div de la carta.
        cardElement.addEventListener('click', flipCard);  // Asigna el evento 'click' a cada carta para manejar su giro.
        gameBoard.appendChild(cardElement);  // Añade la carta al tablero.
    });
}

// Función que maneja el giro de las cartas cuando son clickeadas.
function flipCard() {
    if (lockBoard) return;  // Si el tablero está bloqueado (esperando que se complete una acción), no permite girar más cartas.
    if (this === firstCard) return;  // Si el jugador intenta seleccionar la misma carta dos veces, no hace nada.

    this.classList.add('flipped');  // Añade la clase 'flipped' para mostrar la imagen de la carta.

    if (!firstCard) {
        firstCard = this;  // Si no hay ninguna carta seleccionada previamente, asigna la carta actual como 'firstCard'.
        return;
    }

    secondCard = this;  // Si ya hay una carta seleccionada, esta es la segunda carta.
    lockBoard = true;   // Bloquea el tablero para evitar que se seleccionen más cartas mientras se verifica el match.

    checkForMatch();  // Llama a la función para verificar si las cartas coinciden.
}

// Función que compara las dos cartas seleccionadas.
function checkForMatch() {
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;  // Compara los 'id' de las dos cartas para ver si son iguales.

    if (isMatch) {
        disableCards();  // Si coinciden, se desactivan las cartas.
        matches++;  // Incrementa el contador de parejas encontradas.
        if (matches === cards.length) {
            statusText.textContent = '¡Ganaste! Has encontrado todas las parejas.';  // Si se han encontrado todas las parejas, muestra un mensaje de victoria.
        }
    } else {
        unflipCards();  // Si no coinciden, se voltean las cartas de nuevo.
    }
}

// Función que desactiva las cartas cuando se encuentra una pareja.
function disableCards() {
    firstCard.removeEventListener('click', flipCard);  // Desactiva el evento de clic en la primera carta.
    secondCard.removeEventListener('click', flipCard); // Desactiva el evento de clic en la segunda carta.

    firstCard.classList.add('matched');  // Añade la clase 'matched' para marcar las cartas como emparejadas.
    secondCard.classList.add('matched'); // Añade la clase 'matched' en la segunda carta.

    resetBoard();  // Reinicia las variables para permitir seguir jugando.
}

// Función que voltea las cartas si no coinciden.
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');  // Remueve la clase 'flipped' de la primera carta.
        secondCard.classList.remove('flipped'); // Remueve la clase 'flipped' de la segunda carta.
        resetBoard();  // Reinicia las variables para continuar el juego.
    }, 1000);  // Espera un segundo antes de voltear las cartas nuevamente.
}

// Función que reinicia las variables para poder seleccionar nuevas cartas.
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];  // Restablece las variables a sus valores iniciales.
}

// Inicializa el juego al cargar la página.
initializeGame();
