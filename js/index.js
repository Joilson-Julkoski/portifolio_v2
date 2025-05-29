function updateExperienceClock() {


    let clock = document.getElementById("experience-clock")

    let start = new Date(2020, 6, 1)
    let now = new Date()

    let diffMs = now - start;
    const totalSeconds = Math.floor(diffMs / 1000);


    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    // let rest = totalSeconds % (24 * 60 * 60);

    // const hours = Math.floor(rest / 3600);
    // rest %= 3600;

    // const minutes = Math.floor(rest / 60);
    // const seconds = rest % 60;

    // // Formata com zeros à esquerda
    // const pad = (n) => n.toString().padStart(2, "0");

    clock.innerText =
        `${days} dias`;

}



window.changeTheme = (e) => {
    const color = e.dataset.color;
    document.body.style.setProperty('--main-color', color);

    // Salva a cor no localStorage
    localStorage.setItem('mainColor', color);
    let previous = document.getElementsByClassName('selected')
    if (previous.length > 0) {
        previous[0].classList.remove('selected')
    }


    e.classList.add("selected")
    getHueFromHex(color);
}


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
    isDown = true;
    document.getElementById('polaroid').classList.add('falling')

    offsetX = el.clientWidth / 2;
    offsetY = el.clientHeight / 2;

    el.style.position = 'absolute';
    el.style.margin = 0;

});

document.addEventListener("mouseup", function () {
    pin.classList.add('throwing');
    if (move) {
        pin.classList.remove('throwing');
        pin.classList.add('fall');
    }
    isDown = false;
    document.body.style.userSelect = ""; // reativa seleção de texto
});

document.addEventListener("mousemove", function (e) {
    // console.log("offsetX "  + offsetX)
    // console.log(e.clientX )
    if (isDown)
        move = true
    console.log("MOVU")

    let a = document.getElementById('featured-project').getBoundingClientRect();
    console.log()
    if (!isDown) return;

    el.style.left = (e.clientX - a.left - offsetX) + 'px';
    el.style.top = (e.clientY - a.top - offsetY) + 'px';
});



const body = document.body;