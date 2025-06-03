function updateExperienceClock() {


    let clock = document.getElementById("experience-time")

    let start = new Date(2020, 6, 1)
    let now = new Date()

    let diffMs = now - start;
    const totalSeconds = Math.floor(diffMs / 1000);


    const days = Math.floor(totalSeconds / (24 * 60 * 60));

    clock.innerText =
        `${days} dias`;
}





window.changeTheme = (e) => {
    const color = e.dataset.color;
    document.body.style.setProperty('--main-color', color);

    localStorage.setItem('mainColor', color);
    let previous = document.getElementsByClassName('selected')
    if (previous.length > 0) {
        previous[0].classList.remove('selected')
    }


    e.classList.add("selected")
    getHueFromHex(color);
}

const container = document.querySelector('#experience-box');
const fill = document.getElementById('fill');

function getWaterLevelPercent() {
    const now = new Date();
    const minutesPassed = now.getHours() * 60 + now.getMinutes();
    const totalMinutes = 24 * 60;
    return (minutesPassed / totalMinutes) * 100;
}

function updateWaterLevel() {
    const percent = getWaterLevelPercent();
    fill.style.height = `${percent}%`;
}

function resetWaterLevel() {
    fill.style.height = `0%`;
}

// Aplica quando entra
container.addEventListener('mouseenter', updateWaterLevel);

// Remove quando sai
container.addEventListener('mouseleave', resetWaterLevel);



function createMoreXp() {
    const box = document.querySelector("#experience-box")
    const xp = document.createElement("span")
    xp.classList.add("xp")
    xp.innerText = "+1xp"

    const randomX = Math.floor(Math.random() * (box.clientWidth - 20)) + "px";

    xp.style.setProperty('--pos-x', randomX);

    box.appendChild(xp)

    setTimeout(() => {
        xp.remove()
    }, 3100);
}

setInterval((e) => createMoreXp(), 1000)


document.addEventListener("DOMContentLoaded", () => {
    updateExperienceClock()

    const flipper = document.querySelector(".writer");
    const technologies = ["ReactJS", "Python", "Vanilla Web", "Node", "Fullstack"];
    let techIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentWord = "";

    const type = () => {
        const fullWord = technologies[techIndex];

        if (isDeleting) {
            currentWord = fullWord.substring(0, charIndex--);
        } else {
            currentWord = fullWord.substring(0, charIndex++);
        }

        flipper.innerText = currentWord;

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === fullWord.length + 1) {
            delay = 1500; // tempo de pausa depois de digitar tudo
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            techIndex = (techIndex + 1) % technologies.length;
            delay = 300;
        }

        setTimeout(type, delay);
    };

    type();

    const savedColor = localStorage.getItem('mainColor');
    if (savedColor) {
        document.body.style.setProperty('--main-color', savedColor);

        let previous = document.querySelectorAll('.color-selector')
        previous.forEach((e) => e.dataset.color === savedColor ? e.classList.add('selected') : e.classList.remove('selected'))

        getHueFromHex(savedColor);
    }

    // Make the DIV element draggable:
    dragElement(document.getElementById("pin"));

});

function hexToHSL(hex) {
    // Remove o "#" se estiver presente
    hex = hex.replace("#", "");

    // Converte a cor hexadecimal para RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Encontrar os valores de min e max
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (delta !== 0) {
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        if (max === r) {
            h = (g - b) / delta + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }

        h /= 6;
    }

    return h * 2 * Math.PI;
}

function getHueFromHex(hex) {
    const hue = hexToHSL(hex);
    const color = document.querySelector("color-grade-effect")
    const outlined = document.querySelector("outline-effect")
    color.hue = hue
    outlined.color = hex
}


const card = document.querySelector('#polaroid'); // supondo que a div tem classe .card

window.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // posição X relativa ao card

    // Calcular rotação no eixo Z baseado na posição X do mouse (centro é zero)
    const rotateZ = (x - rect.width / 2) / 500; // ajusta o divisor para sensibilidade

    card.style.transform = `rotateZ(${rotateZ}deg)`;
});



const el = document.getElementById("pin");
let offsetX = 0, offsetY = 0, isDown = false, move = false;

el.addEventListener("mousedown", function (e) {
    e.stopPropagation(); // evita propagação pra outros listeners
    isDown = true;
    move = false;

    document.getElementById('polaroid').classList.add('falling');

    offsetX = el.clientWidth / 2;
    offsetY = el.clientHeight / 2;

    el.style.position = 'absolute';
    el.style.margin = 0;

    // Previne seleção de texto ao arrastar
    document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", function (e) {
    if (!isDown) return;

    move = true;

    const parentRect = document.getElementById('featured-project').getBoundingClientRect();
    el.style.left = (e.clientX - parentRect.left - offsetX) + 'px';
    el.style.top = (e.clientY - parentRect.top - offsetY) + 'px';
});

el.addEventListener("mouseup", function () {
    console.log(isDown)
    if (!isDown) return;

    isDown = false;

    if (move) {
        el.classList.add('fall');
    } else {
        el.classList.add('throwing');
    }
});




let pin = document.getElementById("pin");
let polaroid = document.getElementById("polaroid");

pin.addEventListener("animationend", () => {
    pin.style.display = "none";
}, { once: true });

polaroid.addEventListener("animationend", () => {
    polaroid.style.display = "none";
}, { once: true });

const body = document.body;