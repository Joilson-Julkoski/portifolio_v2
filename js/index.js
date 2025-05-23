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
    getHueFromHex(color)
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

document.getElementById('pin').addEventListener('click', function () {
  const pin = this;
  pin.classList.add('throwing');

  document.getElementById('polaroid').classList.add('falling')

  // Remove do DOM após a animação
  setTimeout(() => {
    pin.remove();
  }, 800); // mesma duração da animação
});

const body = document.body;