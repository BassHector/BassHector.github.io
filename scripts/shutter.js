const backwardsBtn   = document.getElementById("backward");
const forwardsBtn = document.getElementById("forward");
const indent0 = document.getElementById("indent0");
const indent1 = document.getElementById("indent1");
const indent2 = document.getElementById("indent2");
const indent3 = document.getElementById("indent3");

let currentPanel = 0;
let layer = 0;
const slides = 10
const slidesHeight = window.innerHeight / slides;
const slidesWidth = window.innerWidth / slides;
let canvasVertical = document.getElementById("canvasVertical")
canvasVertical.width = slidesWidth
canvasVertical.height = window.innerHeight
let canvasHorizontal = document.getElementById("canvasHorizontal")
canvasHorizontal.width = window.innerWidth
canvasHorizontal.height = slidesHeight

let ctxH,ctxV;
ctxV = canvasVertical.getContext("2d");
ctxH = canvasHorizontal.getContext("2d");

let imageArray =[]
let slidesArray = []
const textArray = ["Spring", "Summer", "Fall", "Winter"]

let panning;



function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

for(let i = 0; i < 4; i++) {
    let image = new Image();
    switch (i) {
        case 0:
            image.src = "../images/Seasons/spring.png";
            break;
        case 1:
            image.src = "../images/Seasons/summer.png";
            break;
        case 2:
            image.src = "../images/Seasons/fall.png";
            break;
        case 3:
            image.src = "../images/Seasons/winter.png";
            break;

    }
    imageArray.push(image)
}

const open = gsap.timeline({duration: 1, paused: true, onComplete: () => open.restart})

document.body.onload = () => {
    imageArray.forEach((image, imageIndex) =>{
        for (let i = 0; i < slides; i++) {
            if (imageIndex % 2 === 0) {
                ctxV.drawImage(image, (image.width / slides) * i, 0, image.width / slides, image.height, 0, 0, canvasVertical.width, canvasVertical.height);
                const slideData = canvasVertical.toDataURL("image/jpeg");
                slidesArray.push(slideData);
            } else {
                ctxH.drawImage(image, 0, (image.height / slides) * i, image.width, image.height / slides, 0, 0, canvasHorizontal.width, canvasHorizontal.height);
                const slideData = canvasHorizontal.toDataURL("image/jpeg");
                slidesArray.push(slideData);
            }

        }
        console.log(textArray[imageIndex])
        let lettersToInsert = []
        for (let i = 0; i < textArray[imageIndex].length; i++) {
            lettersToInsert.push(textArray[imageIndex][i])
        }
        for(let i = 0; i < slides; i++) {
            let slidePanelWrapper = document.createElement("div")
            slidePanelWrapper.id = `slidePanelWrapper${currentPanel}`;
            let slidePanel = document.createElement("div")
            slidePanel.id = `slidePanel${currentPanel}`;
            slidePanel.style.backgroundImage = `url(${slidesArray[currentPanel]})`;

            if (imageIndex % 2 === 0) {
                slidePanel.style.height = `${window.innerHeight}px`;
                slidePanel.style.width = `${slidesWidth}px`;
            } else {
                slidePanel.style.height = `${slidesHeight}px`;
                slidePanel.style.width = `${window.innerWidth}px`;
            }
            const boxId = `megaBox${imageIndex}`;
            const boxElement = document.getElementById(boxId);
            if (boxElement) {
                boxElement.appendChild(slidePanelWrapper);
            }
            slidePanelWrapper.appendChild(slidePanel)
            gsap.set(`#${slidePanel.id}`, {perspective: 800})
            currentPanel++;
        }
    })
    panning = setInterval(() => {
            if (layer === 3){
                setupInterval(0, 7500)
            }
            if (layer !== 3){
                setupInterval(layer + 1, 7500)
            }
    },5000)
    setColor(0)
}

function swapPanel (btnIndex) {
    if (btnIndex > layer) {
        let totalPanels = (btnIndex - layer) * slides;
        for (let i = layer * slides; i < slides * btnIndex; i++) {
            let panelIndex = Math.abs(i % totalPanels);
            let delay = (panelIndex + 1) * 0.1;
            if (Math.floor(i / slides) % 2 !== 0) {
                gsap.to(`#slidePanel${i}`, {rotateX: 90, delay: delay});
            } else {
                gsap.to(`#slidePanel${i}`, {rotateY: 90, delay: delay});
            }
        }

    }
    if (btnIndex < layer) {
        let totalPanels = (btnIndex - layer) * slides;
        for (let i = layer * slides; i > (slides * btnIndex) - 1; i--) {
            let panelIndex = Math.abs(i % totalPanels);
            let delay = (panelIndex - 1) * 0.1;
            if (Math.floor(i / slides) % 2 !== 0) {
                gsap.to(`#slidePanel${i}`, {rotateX: 0, delay: delay});
            } else {
                gsap.to(`#slidePanel${i}`, {rotateY: 0, delay: delay});
            }
        }
    }
    layer = btnIndex;
}

function setColor(index){
    for (let i = 0; i < 4; i++) {
        let divToChange = document.getElementById(`indent${i}`);
        divToChange.style.backgroundColor = "";
        divToChange.style.opacity = "";
        if (i === index){
            divToChange.style.opacity = "1";
            switch (index) {
                case 0:
                    divToChange.style.backgroundColor = "#a4c25e";
                    break;
                case 1:
                    divToChange.style.backgroundColor = "#ebe36b";
                    break;
                case 2:
                    divToChange.style.backgroundColor = "#ff6b32";
                    break;
                case 3:
                    divToChange.style.backgroundColor = "#9cbbd8";
                    break;
                default:
                    divToChange.style.backgroundColor = "gray";
            }
        }

    }

}

function setupInterval(index, milliseconds) {
    swapPanel(index);
    setColor(index);
    clearInterval(panning);

    setTimeout(() => {
        panning = setInterval(() => {
            if (layer === 3) {
                setColor(0);
                swapPanel(0);
            } else {
                setColor(layer + 1);
                swapPanel(layer + 1);
            }
        }, milliseconds);
    })
}
indent0.addEventListener("click", () => setupInterval(0, 15000));
indent1.addEventListener("click", () => setupInterval(1, 15000));
indent2.addEventListener("click", () => setupInterval(2, 15000));
indent3.addEventListener("click", () => setupInterval(3, 15000));

window.addEventListener('blur', function() {
    clearInterval(panning);
});

window.addEventListener('focus', function() {
    setupInterval(layer, 15000)
});
