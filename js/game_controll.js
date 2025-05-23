import { firebaseSaveUpdate, firebaseListening } from './firebase_controll.js';

let peer, dataChannel;
let left = 0
const game = document.querySelector("#game-column")


async function generateConnection(offer) {
    let id = await firebaseSaveUpdate({ "offer": offer })
    generateQRcode(id)
    firebaseListening(id, setRemoteDescription)
}

function generateQRcode(id) {
    let link = `http://${window.location.hostname}:5500/connect.html?id=${id}`


    let qrcodeContainer = document.createElement("div")
    qrcodeContainer.id = "qrcode"

    game.innerHTML = ""
    game.appendChild(qrcodeContainer)

    new QRCode(document.getElementById("qrcode"), link);

    let alternativeLink = document.createElement("a")
    alternativeLink.id = "alternative-link"
    alternativeLink.target = "_blank"
    alternativeLink.innerText = "Ou clique aqui!"
    alternativeLink.onclick = (e) => {
            e.preventDefault(); // impede o link de abrir do jeito padrão
            window.open(link, "controlador", "width=600,height=300,toolbar=no,location=no,menubar=no");
        };

    document.getElementById("qrcode").parentElement.appendChild(alternativeLink)
}


function setLoadingScreen() {
    document.getElementById("start-button").innerHTML = '<span class="loader"></span>   Carrengando'
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

    setInterval(createAsteroid, 1000)
    setInterval(gameLoop, 10)
}

function gameLoop() {
    document.querySelectorAll(".game-asteroid").forEach((e) => {
        const currentTop = parseInt(e.style.top) || 0; 
        e.style.top = `${currentTop + 1}px`;
    });
}



async function createAsteroid() {
    let asteroid = document.createElement("div")
    asteroid.classList.add("game-asteroid")
    asteroid.innerHTML = asteroidSvg
    asteroid.style.left = `${Math.floor(Math.random() * game.clientWidth)}px`;
    game.appendChild(asteroid)
}


function move(dir) {
    console.log(left)
    if (dir == "cima") {
        // TODO: add velocity system

        document.getElementById("game-ship").style.left = `${left}px`
        left += 10

    } else {
        document.getElementById("game-ship").style.left = `${left}px`
        left -= 10
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