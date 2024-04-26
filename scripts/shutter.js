const megaBox1 = document.getElementById("megaBox1");
const megaBox2 = document.getElementById("megaBox2");
const megaBox3 = document.getElementById("megaBox3");
const megaBox4 = document.getElementById("megaBox4");
const forwardsBtn = document.getElementById("forward");


const slides = 10
const slidesWidth = window.innerWidth / slides
let canvas = document.getElementById("canvas")
canvas.width = slidesWidth
canvas.height = window.innerHeight

let ctx;
let imageArray =[]
let slidesArray = []




for(let i = 0; i < 4; i++) {
    let image = new Image();

    image.src = switch"../images/Seasons/winter.png";
}





image.onload = () => {

    for (let i = 0; i < slides; i++) {
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, (image.width / slides) * i, 0, image.width / slides, image.height, 0, 0, canvas.width, canvas.height);
        const slideData = canvas.toDataURL("image/jpeg");
        slidesArray.push(slideData);

    }
    slidesArray.forEach((element, index) => {
        let slidePanelWrapper = document.createElement("div")
        slidePanelWrapper.id = `slidePanelWrapper${index}`;
        let slidePanel = document.createElement("div")
        slidePanel.id = `slidePanel${index}`;
        slidePanel.style.backgroundImage = `url(${element})`;
        slidePanel.style.height = `${window.innerHeight}px`;
        slidePanel.style.width = `${slidesWidth}px`;
        megaBox4.appendChild(slidePanelWrapper)
        slidePanelWrapper.appendChild(slidePanel)
        gsap.set(`#${slidePanel.id}`, {perspective: 800})
        const open = gsap.timeline({duration: 1, paused: true, onComplete: () => open.restart})
        open.to(`#${slidePanel.id}`, {rotateY: 360, delay: 0.1 * (index + 1)})

    })

}
forwardsBtn.addEventListener("click", () => {




})
function stop (){
    open.pause()
}

