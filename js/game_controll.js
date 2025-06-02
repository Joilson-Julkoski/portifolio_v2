import { firebaseSaveUpdate, firebaseListening } from './firebase_controll.js';

let peer, dataChannel;
let left = 0
const allGames = document.querySelectorAll(".game-column")
const game = [...allGames].filter((e) => window.getComputedStyle(e).display !== "none")[0]
let gLoop = null
let aLoop = null


async function generateConnection(offer) {
    let id = await firebaseSaveUpdate({ "offer": offer })
    generateQRcode(id)
    firebaseListening(id, setRemoteDescription)
}

function generateQRcode(id) {
    let link = `${window.location.href}connect?id=${id}`

    let qrcodeContainer = document.createElement("div")
    qrcodeContainer.id = "qrcode"
    console.log(game)
    game.innerHTML = ""
    game.appendChild(qrcodeContainer)

    new QRCode(document.getElementById("qrcode"), link, {
        colorDark: "#000000",
        colorLight: window.getComputedStyle(document.body).getPropertyValue('--main-color'),
    });

    let alternativeLink = document.createElement("a")
    alternativeLink.id = "alternative-link"
    alternativeLink.target = "_blank"
    alternativeLink.innerHTML = "Ou clique aqui! <span>(mais chato)</span>"
    alternativeLink.onclick = (e) => {
        e.preventDefault();
        window.open(link, "controlador", "width=600,height=300,toolbar=no,location=no,menubar=no");
    };

    document.getElementById("qrcode").parentElement.appendChild(alternativeLink)
}


function setLoadingScreen() {
    document.querySelectorAll(".start-button").forEach(e => e.innerHTML = '<span class="loader"></span>   Carrengando')
}


window.createOffer = async () => {
    peer = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    });
    dataChannel = peer.createDataChannel("controle");
    dataChannel.onopen = startGame;
    dataChannel.onmessage = e => move(e.data);
    setLoadingScreen()
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    peer.onicecandidate = e => {
        if (e.candidate === null) {
            return generateConnection(peer.localDescription);
        }
    };
}


async function startGame() {
    console.log("Canal aberto!")

    game.innerHTML = ""

    let ship = document.createElement("div")
    ship.id = "game-ship"

    ship.innerHTML = shipSvg

    game.appendChild(ship)

    aLoop = setInterval(createAsteroid, 1000)
    gLoop = setInterval(gameLoop, 10)
}

function gameLoop() {

    const currentLeft = parseInt(document.querySelector("#game-ship").style.left) || parseInt(document.querySelector(".game-column").clientWidth / 2);

    let ship = document.querySelector("#game-ship")
    ship.style.left = `${currentLeft + left}px`

    document.querySelectorAll(".game-asteroid").forEach((e) => {
        checkColision(e, ship)

        const currentTop = parseInt(e.style.top) || 0;
        e.style.top = `${currentTop + 1}px`;
    });
}



function checkColision(asteroid, ship) {
    if (
        asteroid.getBoundingClientRect().top + asteroid.getBoundingClientRect().height >= ship.getBoundingClientRect().top &&
        asteroid.getBoundingClientRect().top <= ship.getBoundingClientRect().top + ship.getBoundingClientRect().height &&
        asteroid.getBoundingClientRect().left + asteroid.getBoundingClientRect().width >= ship.getBoundingClientRect().left &&
        asteroid.getBoundingClientRect().left <= ship.getBoundingClientRect().left + ship.getBoundingClientRect().width
    ) {
        game.innerHTML = ""

        const lose = document.createElement('h2')
        lose.classList.add("lose-text")
        lose.innerHTML = "Game Over"
        const restartButton = document.createElement('button')
        restartButton.classList.add("restart-button")
        restartButton.innerHTML = "Reiniciar"
        restartButton.onclick = () => startGame()

        game.appendChild(lose)
        game.appendChild(restartButton)
        clearInterval(gLoop)
        clearInterval(aLoop)
        asteroid.remove()
    }
}

async function createAsteroid() {
    let asteroid = document.createElement("div")
    asteroid.classList.add("game-asteroid")
    asteroid.innerHTML = asteroidSvg
    asteroid.style.left = `${Math.floor(Math.random() * game.clientWidth)}px`;
    game.appendChild(asteroid)
    setTimeout(() => asteroid.remove(), 10000);
}


function move(dir) {
    if (dir == "left") {
        left = -1

    } else if (dir == "right") {
        left = 1
    }
    else {
        left = 0
    }
}

async function setRemoteDescription(answer) {
    await peer.setRemoteDescription(answer);
}




const shipSvg = `<svg viewBox="0 0 100 100" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M10,90 L50,10 L90,90 L50,60 Z" fill="currentColor" opacity="0.2" />
  <polyline points="10,90 50,10 90,90" />
  <polyline points="10,90 50,60 90,90" />
</svg>
`

const asteroidSvg = `<svg viewBox="0 0 100 100" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2">
  <polygon points="30,20 70,15 85,40 75,70 50,85 25,75 15,50" fill="currentColor" opacity="0.15" />
  <polygon points="30,20 70,15 85,40 75,70 50,85 25,75 15,50" />
</svg>
`