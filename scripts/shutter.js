const backwardsBtn   = document.getElementById("backward");
const forwardsBtn = document.getElementById("forward");
let currentPanel = 0;
let layer = 0;
const slides = 10
const slidesWidth = window.innerWidth / slides
let canvas = document.getElementById("canvas")
canvas.width = slidesWidth
canvas.height = window.innerHeight

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

let ctx;
let imageArray =[]
let slidesArray = []




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
            ctx = canvas.getContext("2d");
            ctx.drawImage(image, (image.width / slides) * i, 0, image.width / slides, image.height, 0, 0, canvas.width, canvas.height);
            const slideData = canvas.toDataURL("image/jpeg");
            slidesArray.push(slideData);
        }
        for(let i = 0; i < slides; i++) {
            let slidePanelWrapper = document.createElement("div")
            slidePanelWrapper.id = `slidePanelWrapper${currentPanel}`;
            let slidePanel = document.createElement("div")
            slidePanel.id = `slidePanel${currentPanel}`;
            slidePanel.style.backgroundImage = `url(${slidesArray[currentPanel]})`;
            slidePanel.style.height = `${window.innerHeight}px`;
            slidePanel.style.width = `${slidesWidth}px`;
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
}

forwardsBtn.addEventListener("click", (e) =>{
    layer = clamp(layer, 0, 3)
    for(let i = layer * slides; i < slides * (layer + 1); i++) {
        gsap.to(`#slidePanel${i}`, {rotateY: 90, delay: 0.1 * (i + 1)})
        console.log(i)
    }
    layer++
})
backwardsBtn.addEventListener("click", (e) =>{
    layer--
    layer = clamp(layer, 0, 3)
    for(let i = layer * slides; i < slides * (layer + 1); i++) {
        gsap.to(`#slidePanel${i}`, {rotateY: 0, delay: 0.1 * (i + 1)})
        console.log(i)

    }
})


