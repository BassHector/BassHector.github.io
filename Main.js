gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollTrigger);

addEventListener("DOMContentLoaded", (event) => {



const mainContainer = document.getElementById("mainContainer");
let mainContainerBounds = mainContainer.getBoundingClientRect();
let planetList = [];

let megaMove = 0;

let navBar = document.createElement("div");
navBar.id = "navBar";
navBar.style.position = "relative";
navBar.style.width = `${(window.innerWidth  * 0.8)}px`;
navBar.style.height = `${(window.innerHeight  * 0.02)}px`;
navBar.style.backgroundColor = `white`;
navBar.style.marginLeft = `${window.innerWidth * 0.1}px`;
navBar.style.top = `${window.innerHeight  * 0.02}px`;
navBar.style.borderRadius = "10px";
navBar.style.zIndex = "1";
mainContainer.appendChild(navBar)

let navBarText = document.createElement("div");
navBarText.style.position = "relative";
navBarText.style.width = `${(window.innerWidth  * 0.2)}px`;
navBarText.style.height = `${(window.innerHeight  * 0.02)}px`;
navBarText.style.backgroundColor = `white`;
navBarText.style.marginLeft = `${(window.innerWidth * 0.1) - (navBarText.style.width /2)}px`;
navBarText.style.top = `${window.innerHeight  * 0.04}px`;
navBarText.style.zIndex = "1";
mainContainer.appendChild(navBarText)


let navBarPin = document.createElement("div");
navBarPin.style.position = "relative";
navBarPin.style.width = `${(parseFloat(navBar.style.height) * 1.5)}px`;
navBarPin.style.height = `${(parseFloat(navBar.style.height) * 1.5)}px`;
navBarPin.style.backgroundColor = `purple`;
navBarPin.style.borderRadius = "50%";
navBarPin.style.left = `${navBar.style.left - (parseFloat(navBar.style.height)/2)}px`;
navBarPin.style.top = `${parseFloat(navBar.style.top) - (parseFloat(navBar.style.height) * 1.25)}px`;
navBarPin.style.zIndex = "1";
navBar.appendChild(navBarPin)


let sunMask = document.createElement("div");
sunMask.style.position = "fixed";
sunMask.style.width = `220px`;
sunMask.style.height = `110%`;
sunMask.style.top = '0';
sunMask.style.backgroundImage = `url(/images/SunMask.png)`;
sunMask.style.backgroundPosition = "center";
sunMask.style.backgroundSize = 'cover';
mainContainer.appendChild(sunMask)

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


class planets {
    constructor(i) {
        this.planet = document.createElement("div");
        switch (i) {
            case 0:
                this.id = "Mercury";
                this.planet.style.backgroundImage = "url(/images/Mercury.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.width = `${mainContainerBounds.height * .1}px`;
                this.planet.style.height = `${mainContainerBounds.height * .1}px`;
                break;
            case 1:
                this.id = "Venus";
                this.planet.style.backgroundImage = "url(/images/Venus.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.width = `${mainContainerBounds.height * .22}px`;
                this.planet.style.height = `${mainContainerBounds.height * .22}px`;
                break;
            case 2:
                this.id = "Earth";
                this.planet.style.backgroundImage = "url(/images/Earth.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.width = `${mainContainerBounds.height * .25}px`;
                this.planet.style.height = `${mainContainerBounds.height * .25}px`;
                break;
            case 3:
                this.id = "Mars";
                this.planet.style.backgroundImage = "url(/images/Mars.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.width = `${mainContainerBounds.height * .15}px`;
                this.planet.style.height = `${mainContainerBounds.height * .15}px`;
                break;
            case 4:
                this.id = "Jupiter";
                this.planet.style.backgroundImage = "url(/images/Jupiter.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.width = `${mainContainerBounds.height * .6}px`;
                this.planet.style.height = `${mainContainerBounds.height * .6}px`;
                break;
            case 5:
                this.id = "Saturn";
                this.planet.style.backgroundImage = "url(/images/Saturn.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.backgroundPosition = "center center";
                this.planet.style.width = `${mainContainerBounds.height * .65}px`;
                this.planet.style.height = `${mainContainerBounds.height * .65}px`;
                break;
            case 6:
                this.id = "Uranus";
                this.planet.style.backgroundImage = "url(/images/Uranus.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.backgroundPosition = "center center";
                this.planet.style.width = `${mainContainerBounds.height * .5}px`;
                this.planet.style.height = `${mainContainerBounds.height * .5}px`;
                break;
            case 7:
                this.id = "Neptune";
                this.planet.style.backgroundImage = "url(/images/Neptune.png)";
                this.planet.style.backgroundSize = "cover";
                this.planet.style.backgroundPosition = "center center";
                this.planet.style.width = `${mainContainerBounds.height * .5}px`;
                this.planet.style.height = `${mainContainerBounds.height * .5}px`;
                break;
            default:
                this.id = "unknown";
                break;
        }
        this.planet.style.position = `fixed`;
        this.planet.style.marginLeft = `${(mainContainerBounds.width / 9) * (i + 1)}px`;
        this.planet.style.marginTop = `${(mainContainerBounds.height / 2) - (parseFloat(this.planet.style.height)/2)}px`;
    }
}

let sectionLength = mainContainerBounds.width / 8;
function planetOrbit(DivElement, index) {
console.log(DivElement.planet.style.height)
    if ((parseFloat(DivElement.planet.style.marginLeft) - (window.innerWidth)) + parseFloat(DivElement.planet.style.height) < Math.abs(megaMove)) {

        gsap.to(DivElement.planet, { y: 0, duration: 0.5, ease: "Power1.easeOut" });
    } else  {
        gsap.to(DivElement.planet, { y: 1000, duration: 1 });
    }

}

function moveContainer (delta) {
    megaMove += delta;
    megaMove = clamp(megaMove, -mainContainerBounds.width + window.innerWidth, 0);
    gsap.to(".MainContainer", {
        x: megaMove
    })
    gsap.to(navBar, {
        x: -megaMove
    })
    gsap.to(navBarPin, {
        x: megaMove / ((-mainContainerBounds.width + window.innerWidth) / (parseFloat(navBar.style.width)))
    })
    gsap.to(navBarText, {
        x: -megaMove + ( megaMove / ((-mainContainerBounds.width + window.innerWidth) / (parseFloat(navBar.style.width))))
    })
    planetList.forEach((element,index) =>{
        planetOrbit(element, index)
    })
};

for (let i = 0; i < 8; i++) {
let newPlanet = new planets(i);
planetList.push(newPlanet)
mainContainer.appendChild(newPlanet.planet)
}


Observer.create({
    target: window,
    type: "wheel, touch, scroll, pointer",

    onUp: (self) => {moveContainer(self.deltaY)},
    onDown: (self) => {moveContainer(self.deltaY)}
})

})



