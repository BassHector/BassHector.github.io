gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollTrigger);

const mainContainer = document.getElementById("mainContainer");
let mainContainerBounds = mainContainer.getBoundingClientRect();

let megaMove = 0;

function clamp(value, min, max) {
    console.log(Math.min(Math.max(value, min), max))
    return Math.min(Math.max(value, min), max);
}
function moveContainer (delta){
    megaMove += delta;
    megaMove = clamp(megaMove, -mainContainerBounds.width + window.innerWidth, 0);
    gsap.to (".MainContainer",{
        x:megaMove

    } )
}

Observer.create({
    target: window,
    type: "wheel, touch, scroll, pointer",

    onUp: (self) => {moveContainer(self.deltaY)},
    onDown: (self) => {moveContainer(self.deltaY)}
})



