import {customFunctions} from "./customModules.js";
gsap.registerPlugin(TextPlugin)

let layer0Content = document.getElementById('layer0')
let layer1Content = document.getElementById('layer1')
let layer2Content = document.getElementById('layer2')
let layer3Content = document.getElementById('layer3')
const allLayerContentArray = [layer0Content, layer1Content, layer2Content, layer3Content]


// use querySelectorAll because somebody thought it was a good idea to place the nodes inside a htmlcollection instead of an array when using getElementsByClassName
let buttonWrappers = document.querySelectorAll(".buttonWrapper");

let mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();

let boxMaxDim = Math.min(mainContainerBounds.width, mainContainerBounds.height);
//must be a numbered squared
const numberOfBox = 64;

let  boxesSize = Math.ceil(boxMaxDim / Math.sqrt(numberOfBox));
const boxesPerRow = Math.ceil(mainContainerBounds.width / boxesSize);
const boxesPerColumn = Math.ceil(mainContainerBounds.height / boxesSize);
const numberOfLayers = 3;
const boxesPerLayer = (boxesPerRow * boxesPerColumn)

let animatedArray = []
let isAnimating = false

let lastHoveredTile = null;
let animationIncre = 0;
let currentActiveElements = Array.from(layer0Content.querySelectorAll('*'))

let transitionTimeline = gsap.timeline({duration: 0.5, ease: "elastic", smoothChildTiming: true})

function turnTiles(tile, layer, tileNumber,) {
    lastHoveredTile = null;
    if(movingFromLastLayer){ // this specifically if the user is transitioning from the last layer, since it doesn't have tiles.
        animationIncre = boxesPerLayer/4
        setZIndex(layer)
        movingFromLastLayer = false; //reset the flag when done
        return
    }
    if(tile){
        //vvvvvv literally couldn't pass the tile to gsap, so I had to put it in this variable first...for some reason
        let theCurrentTile = tile;
        switch(parseInt(tileNumber) % 2){
            case 0:
                transitionTimeline.to(tile, {y: -window.innerHeight - boxesSize, onComplete: (() => {
                            theCurrentTile.style.zIndex = `1`;
                            theCurrentTile.style.pointerEvents = "none";
                            animationIncre++
                            if (layer !== 3) {
                                setZIndex(layer)
                            }
                    })
                }, "-=0.495")
                break;
            case 1:
                transitionTimeline.to(tile, {y: window.innerHeight + boxesSize, onComplete: (() => {
                        theCurrentTile.style.zIndex = `1`;
                        theCurrentTile.style.pointerEvents = "none";
                        animationIncre++
                        if (layer !== 3) {
                            setZIndex(layer)
                        }
                    })
                }, "-=0.495")
                break;
            default:
                console.log("error @ turnTiles()")
        }

        animatedArray.push(tile)
        let tilesToAnimate = [];
        tilesToAnimate.push(document.getElementById(`${tile.id - 1}`))
        tilesToAnimate.push(document.getElementById(`${parseInt(tile.id) + 1}`))
        tilesToAnimate.push(document.getElementById(`${tile.id - boxesPerColumn}`))
        tilesToAnimate.push(document.getElementById(`${parseInt(tile.id) + boxesPerColumn}`))

        tilesToAnimate.forEach((superTile) => {
            if (animatedArray.indexOf(superTile) === -1) {
                turnTiles(superTile, layer, parseInt(tile.id));
            }
        })



    }
}

//responsible for return boxes back to original positions
function setZIndex(layer) {
    if (animationIncre === boxesPerLayer/4){ //so pushing the current index upwards, started late. midway through animation. /4 so that it starts 1/4th the way through.

        animatedArray = [];
        for(let i = 0; i < allBoxesLayer[layer].length; i++){
            transitionTimeline.to(allBoxesLayer[layer][i], {y: 0 }, "-=0.495")
            allBoxesLayer[layer][i].style.zIndex = `${numberOfLayers}`
            allBoxesLayer[layer][i].style.pointerEvents = ""
        }
        for(let i = 0; i < currentActiveElements.length; i++){
            currentActiveLayer.div.style.zIndex = `888`
            currentActiveLayer.div.style.pointerEvents = `none`
        }
    }
}


let everyTileElement = [];
let everyTileElementStyleLeft = []; //for resizing the tiles on resize
let everyTileElementStyleTop = [];
function setLayer (layer){
    const layerNumber = layer * 1000;
    let currentTileId = 0;
    for (let i = 0; i < boxesPerRow; i++) {
        for (let j = 0; j < boxesPerColumn; j++) {
            currentTileId++;
            let tile = document.createElement('div')
            tile.id = `${layerNumber + currentTileId}`;
            tile.className = `layer${layer + 1}`
            tile.style.position = 'absolute';
            tile.style.border = window.innerWidth < 900 ? '1px solid #333333' : '1px solid #111111'; //light borders for mobile
            tile.style.height = `${boxesSize}px`;
            tile.style.width = `${boxesSize}px`;
            tile.style.top = `${boxesSize * j}px`;
            tile.style.left = `${boxesSize * i}px`;
            tile.style.zIndex = `${numberOfLayers - layer}`;
            if(parseInt(tile.style.zIndex) !== numberOfLayers){
                tile.style.pointerEvents = "none";
            }
            tile.setAttribute("name", "tile")
            mainContainer.appendChild(tile)

            tile.addEventListener("mouseover", () => {
                gsap.fromTo(tile, {rotateY: 0}, {rotateY: tileForce, duration: scaledSpeed, ease: "elastic",  onComplete: ()=> reverse(tile) })
                // if(!isAnimating) { //turning this off for now
                //     lastHoveredTile = tile;
                // }
            })
            if(layer !== 0){
                switch(parseInt(tile.id) % 2){
                    case 0:
                        gsap.set(tile, {y: -window.innerHeight - boxesSize})
                        break;
                    case 1:
                        gsap.set(tile, {y: window.innerHeight + boxesSize})
                        break;
                    default:
                        console.log("error @ setLayer")
                }

            }
            everyTileElement.push(tile)
            everyTileElementStyleLeft.push(parseInt(tile.style.left) - 2); //the -1 is account for the border
            everyTileElementStyleTop.push(parseInt(tile.style.top) - 2);
        }
    }
}

function reverse (tile) {
    gsap.to(tile, {rotateY: 0, duration: 0.5, ease: "elastic"})
}

let allBoxesLayer = [];

const setLayers = () => {
    for (let i = 0; i < numberOfLayers; i++) {
        setLayer(i);
        allBoxesLayer.push(document.querySelectorAll(`.layer${i + 1}`))
    }

}
setLayers()

let lastPosition = { x: 0, y: 0, time: Date.now() }; // for calculating speed

let lastX = 0; //for determining mouse directing

let scaledSpeed = 0; //used by getMouseSeed(e)

let tileForce= 0; //variable to hold tile flipping variable set by the set layer function


function getMouseDirection(e) {
    let currentX = e.clientX;
    let direction = currentX > lastX ? -90 : 90;
    lastX = currentX;
    return direction;
}
function getMouseSpeed(e) {
    let currentPosition = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
    };

    let dx = currentPosition.x - lastPosition.x;
    let dy = currentPosition.y - lastPosition.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    let timeDiff = currentPosition.time - lastPosition.time || 1;
    let speed = distance / timeDiff;

    scaledSpeed = customFunctions.clamp(speed, 0, 1);
    lastPosition = currentPosition; // update for the next event

    return scaledSpeed;
}

let animatePreviewTimeLine = gsap.timeline({overwrite: true}) //belongs to previewLayer

function reversePreviewAnimations(array, removePin){ //used to reverse the previous preview tween when selecting another element
    if (array) {
        animatePreviewTimeLine.to(array, {
            width: "43%",
            border: "solid 1px dimgray",
            boxShadow: "1px -1px 27px 0px rgba(0,0,0,0.75)",
            margin: "3%",
            duration: 0.5,
            ease: "power4.inOut"
        }, ">-0.2")
        gsap.to(array[0].childNodes[1], {duration: 1, ease: "power4.inOut", filter: "blur(0rem)"})
        animatePreviewTimeLine.to(array[0].childNodes[3].childNodes[1],{opacity: 0, duration: 1, ease: "power4.inOut", pointerEvents: "none"})
    }
    if(removePin){
        animatePreviewTimeLine.to(xLines[0], {rotation: 0, height: "100%", duration: 0.1, ease: "elastic", overwrite: true})
        animatePreviewTimeLine.to(xLines[1], {rotation: 0, height: "100%", duration: 0.1, ease: "elastic", overwrite: true},"<")
        animatePreviewTimeLine.to(resizePin, {width: "1%", left: resizePin.offsetLeft, height: "20%", duration: 0.5, ease: "elastic", overwrite: true})
        animatePreviewTimeLine.to(resizePin, {top: "-300px", duration: 0.5, ease: "power4.inOut"})
        lastClickedElement = null;
    }
}

const mainProjectContainer = document.getElementById('projects');
let previewElementsArray = document.querySelectorAll(".projectDemo")
let resizePin = document.getElementById("layer2dropdown");
let resizePinBounds = resizePin.getBoundingClientRect()
let xLines = document.querySelectorAll(".line")
let lastClickedPreview, lastClickedElement;
let previewTimeout = null;
const projectsTextArray = ["Falling Letters", "Embers Landing Page", "Blinds Carousel", "PseudoParaJS", "The Portfolio", "Under Construction"]

resizePin.addEventListener("click", () => {
    reversePreviewAnimations(lastClickedPreview, true)
    lastClickedPreview = null;
})

previewElementsArray.forEach((element, index) => {
    resizePinBounds = resizePin.getBoundingClientRect()
    element.addEventListener("click", (e) => {
        if(lastClickedElement === index) { // used for elements without links, effectively cancels the animation
            return
        }
        if (previewTimeout === null) { //timer to let the animations catch up
            previewTimeout = true;
            setTimeout(() => {
                lastClickedElement = index; // used for elements without links, effectively cancels the animation
                previewTimeout = null;
            }, 2000)
            mainProjectContainer.scrollTo({top: element.offsetTop - (element.offsetHeight/2), behavior: "smooth"});//scrollTo is a great method :)
            animatePreviewTimeLine.to(xLines[0], {rotation: 0, height: "100%", duration: 0.1, ease: "elastic"}, "xBox")
            animatePreviewTimeLine.to(xLines[1], {rotation: 0, height: "100%", duration: 0.1, ease: "elastic"}, "<")
            if(window.innerWidth < 500){ //accounting for mobile @media query
                animatePreviewTimeLine.to(resizePin, {
                    left: previewElementsArray[0].offsetLeft,
                    width: "10%",
                    height: "8%",
                    top: element.offsetTop,
                    duration: 1,
                    ease: "power4.inOut"
                })
            } else if (window.innerWidth < 900){
                animatePreviewTimeLine.to(resizePin, {
                    left: previewElementsArray[0].offsetLeft,
                    width: "7%",
                    height: "6%",
                    top: element.offsetTop,
                    duration: 1,
                    ease: "power4.inOut"
                })
            } else {
                animatePreviewTimeLine.to(resizePin, {
                    width: "1%",
                    left: "1%",
                    height: "20%",
                    duration: 0.2,
                    ease: "elastic",
                })
                animatePreviewTimeLine.to(resizePin, {
                    left: 0,
                    width: "3%",
                    height: "6%",
                    top: element.offsetTop + (element.offsetHeight / 2),
                    duration: 1,
                    ease: "power4.inOut"
                })
            }
            animatePreviewTimeLine.to(xLines[0], {rotation: 135, height: "100%", duration: 0.2, ease: "elastic"},)
            animatePreviewTimeLine.to(xLines[1], {rotation: -135, height: "100%", duration: 0.2, ease: "elastic"}, "<")
            reversePreviewAnimations(lastClickedPreview)
            switch (index % 2) {
                case 0:
                    animatePreviewTimeLine.to(element, {
                        width: "94%",
                        duration: 1,
                        border: "solid 1px transparent",
                        boxShadow: "1px -1px 27px 0px rgba(0,0,0,0.0)",
                        ease: "power4.inOut"
                    }, "<xBox-=1")
                    animatePreviewTimeLine.to(previewElementsArray[index + 1], {
                        width: "0%",
                        border: "0",
                        margin: "0",
                        duration: 0.5,
                        ease: "power4.inOut"
                    }, "<")
                    lastClickedPreview = [element, previewElementsArray[index + 1]]
                    gsap.to(element.childNodes[1], {duration: 1, ease: "power4.inOut", filter: "blur(1rem)"})
                    break;
                case 1:
                    animatePreviewTimeLine.to(element, {
                        width: "94%",
                        duration: 1,
                        border: "solid 1px transparent",
                        boxShadow: "1px -1px 27px 0px rgba(0,0,0,0.0)",
                        ease: "power4.inOut"
                    }, "<xBox-=1")
                    animatePreviewTimeLine.to(previewElementsArray[index - 1], {
                        width: "0%",
                        border: "0",
                        margin: "0",
                        duration: 0.5,
                        ease: "power4.inOut"
                    }, "<")
                    lastClickedPreview = [element, previewElementsArray[index - 1]]
                    gsap.to(element.childNodes[1], {duration: 1, ease: "power4.inOut", filter: "blur(1rem)"})
                    break;
                default:
                    console.log("error @ previewElementsArray")
            }

            animatePreviewTimeLine.to(element.childNodes[3].childNodes[1], {
                pointerEvents: "all", opacity: 1, text: {
                    value: projectsTextArray[index],
                    newClass: "projectsText",
                    speed: 1,
                },
            })
        }
    })
});

document.addEventListener('mousemove', function(e) {
    tileForce = getMouseDirection(e) * getMouseSpeed(e)
    //currentActiveLayer is object with int:, div:
})



let layerToPromote;//variable to hold which layer to promote

function swapPage(button){
    if(isAnimating === false) {
        isAnimating = true;
        setTimeout(() => {isAnimating = false}, 4000)
        animationIncre = 0;
        if (button.innerText.trim() === "Skills") {
            if (lastHoveredTile === null) {
                if(allBoxesLayer[currentActiveLayer.int]) {
                    lastHoveredTile = allBoxesLayer[currentActiveLayer.int][Math.round(allBoxesLayer[currentActiveLayer.int].length / 2)]
                }
            }
            animationIncre = 0;
            layerToPromote = {int: 1, div: layer1Content};
            moveElements(lastHoveredTile, 1, 0, layerToPromote)
            playSkillsAnimations()
        }
        if (button.innerText.trim() === "Projects") {
            if (lastHoveredTile === null) {
                if(allBoxesLayer[currentActiveLayer.int]) {
                    lastHoveredTile = allBoxesLayer[currentActiveLayer.int][Math.round(allBoxesLayer[currentActiveLayer.int].length / 2)]
                }
            }
            animationIncre = 0;
            layerToPromote = {int: 2, div: layer2Content};
            moveElements(lastHoveredTile, 2, 0, layerToPromote)

        }
        if (button.innerText.trim() === "Contact") {
            if (lastHoveredTile === null) {
                if(allBoxesLayer[currentActiveLayer.int]) {
                    lastHoveredTile = allBoxesLayer[currentActiveLayer.int][Math.round(allBoxesLayer[currentActiveLayer.int].length / 2)]
                }
            }
            animationIncre = 0;
            layerToPromote = {int: 3, div: layer3Content};
            moveElements(lastHoveredTile, 3, 0, layerToPromote)
        }
        if (button.innerText.trim() === "Home") {
            if (lastHoveredTile === null) {
                if(allBoxesLayer[currentActiveLayer.int]) {
                    lastHoveredTile = allBoxesLayer[currentActiveLayer.int][Math.round(allBoxesLayer[currentActiveLayer.int].length / 2)]
                }
            }
            animationIncre = 0;
            layerToPromote = {int: 0, div: layer0Content};
            moveElements(lastHoveredTile, 0, 0, layerToPromote)

        }
    }
}

let touchHandled = false;
function handlePageSwap(event){
    if (event.type === 'touchstart') {
        touchHandled = true;
    } else if (event.type === 'click' && touchHandled) {
        touchHandled = false;
        return;
    }
    swapPage(event.currentTarget);
}
buttonWrappers.forEach((button) => {
    button.addEventListener("click", handlePageSwap);
    button.addEventListener("touchstart", handlePageSwap);
});

//takes in current active layer objects vvvvv
let movingFromLastLayer = false;

function moveElements(lastHoveredTile, layer, tileId, layerToPromote) {
    transitionTimeline.fromTo(currentActiveLayer.div, {x:0}, {x: window.innerWidth})
    currentActiveElements.forEach((element, index) => {
        if (index === 0){return} //don't move the container holding the elements
        transitionTimeline.fromTo(element, {x: 0}, {x: window.innerWidth, ease: "power1.out"}, "-=0.495");
    })
    //converting to object
    currentActiveLayer = layerToPromote
    currentActiveElements = Array.from(currentActiveLayer.div.querySelectorAll('*'))

    //push the new layer objects in
    transitionTimeline.fromTo(currentActiveLayer.div, {x:-window.innerWidth}, {x: 0})
    currentActiveElements.forEach((element) => {
        transitionTimeline.fromTo(element, {x: -window.innerWidth}, {x: 0}, "-=0.495");
    })

    if (!lastHoveredTile){
        movingFromLastLayer = true;
    }
    if(layer === 3){
        layer3Content.style.zIndex = "888";
    }
    turnTiles(lastHoveredTile, layer, tileId)
}

let currentActiveLayer = {int: 0, div:layer0Content};

let playSkillsAnimationsFlag = false;
function playSkillsAnimations(){
    if(!playSkillsAnimationsFlag) {
        let htmlBox = document.getElementById("htmlDemo");
        let cssBox = document.getElementById("cssDemo");
        let jsBox = document.getElementById("javascriptDemo");
        const skillsTimeline = gsap.timeline({duration: 2, ease: "none" })
        let htmlContent = '&lt;html&gt;<br>' +
            '&lt;head&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;My HTML Page&lt;/title&gt;<br>' +
            '&lt;/head&gt;<br>' +
            '&lt;body&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Welcome to My HTML Page&lt;/h1&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;Hello, World! This is a simple HTML page.&lt;/p&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;Put your mind to work and create something wonderful.&lt;/p&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&lt;ul&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Item 1&lt;/li&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Item 2&lt;/li&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Item 3&lt;/li&gt;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&lt;/ul&gt;<br>' +
            '&lt;/body&gt;<br>' +
            '&lt;/html&gt;<br>';

        let jsContent = '&lt;script&gt;<br>' +
            'function displayMessage() {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;console.log("Hello, World!");<br>' +
            '}<br>' +
            '<br>' +
            'for (let i = 0; i &lt; 5; i++) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;elementArray.push(i);<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;if (elementArray.length &lt; totalElement) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return i;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
            '}<br>' +
            '<br>' +
            'function setLayer(layer) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;const layerNumber = layer * 1000;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;let currentTileId = 0;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;for (let i = 0; i &lt; boxesPerRow; i++) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (let j = 0; j &lt; boxesPerColumn; j++) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currentTileId++;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let tile = document.createElement("div");<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.id = `${layerNumber + currentTileId}`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.className = `layer${layer + 1}`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.position = "absolute";<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.border = window.innerWidth &lt; 900 ? "1px solid #333333" : "1px solid #111111";<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.height = `${boxesSize}px`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.width = `${boxesSize}px`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.top = `${boxesSize * j}px`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.left = `${boxesSize * i}px`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.zIndex = `${numberOfLayers - layer}`;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (parseInt(tile.style.zIndex) !== numberOfLayers) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.style.pointerEvents = "none";<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.setAttribute("name", "tile");<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mainContainer.appendChild(tile);<br>' +
            '<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tile.addEventListener("mouseover", () => {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gsap.fromTo(tile, { rotateY: 0 }, { rotateY: tileForce, duration: scaledSpeed, ease: "elastic", onComplete: () => reverse(tile) });<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br>' +
            '<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (layer !== 0) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;switch (parseInt(tile.id) % 2) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;case 0:<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gsap.set(tile, { y: -window.innerHeight - boxesSize });<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;case 1:<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gsap.set(tile, { y: window.innerHeight + boxesSize });<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;default:<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log("error @ setLayer");<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
            '<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;everyTileElement.push(tile);<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;everyTileElementStyleLeft.push(parseInt(tile.style.left) - 2);<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;everyTileElementStyleTop.push(parseInt(tile.style.top) - 2);<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
            '}&lt;/script&gt;<br>';

        let cssContent = '&lt;style&gt;<br>' +
            '.Container {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;background-color: #f0f0f0;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;margin: 20px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;padding: 10px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;border: 2px solid #ccc;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;border-radius: 10px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;box-shadow: 0 4px 8px rgba(0,0,0,0.1);<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;transition: all 0.3s ease;<br>' +
            '}<br>' +
            '.Container:hover {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;background-color: #e0e0e0;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;box-shadow: 0 8px 16px rgba(0,0,0,0.2);<br>' +
            '}<br>' +
            'p {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;color: blue;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;font-size: 16px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;line-height: 1.5;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;margin-bottom: 10px;<br>' +
            '}<br>' +
            'h1 {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;color: #333;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;font-size: 24px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;text-align: center;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;margin-top: 0;<br>' +
            '}<br>' +
            'ul {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;list-style-type: none;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;padding: 0;<br>' +
            '}<br>' +
            'li {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;background-color: #ddd;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;margin: 5px 0;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;padding: 5px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;border-radius: 5px;<br>' +
            '}<br>' +
            'a {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;color: red;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;text-decoration: none;<br>' +
            '}<br>' +
            'a:hover {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;text-decoration: underline;<br>' +
            '}<br>' +
            '&lt;/style&gt;<br>';


        skillsTimeline.to(htmlBox, {
            text: {
                value: htmlContent,
                newClass: "skillsGreen",
                speed: 3,
            }
        })
        skillsTimeline.to(cssBox, {
            text: {
                value: cssContent,
                newClass: "skillsPlum",
                speed: 1,
            },})
        skillsTimeline.to(jsBox, {
            text: {
            value: jsContent,
                newClass: "skillsGold",
                speed: 1,
        },})
        document.querySelectorAll(".libraryLogo").forEach(logo => {
            logo.addEventListener("mouseenter", () => {
                gsap.to(logo, {scale: 2, duration: 1, ease: "elastic", overwrite: true })
            })
            logo.addEventListener("mouseleave", () => {
                gsap.to(logo, {scale: 1, duration: 1, ease: "elastic", overwrite: true })
            })
        })
        playSkillsAnimationsFlag = true;
    }
}

gsap.set(layer1Content.children[0], {x: window.innerWidth})
gsap.set(layer2Content.children[0], {x: window.innerWidth})
gsap.set(layer3Content.children[0], {x: window.innerWidth})


gsap.set(previewElementsArray, {
    width: "43%",
    border: "solid 1px dimgray",
    margin: "3%",
    boxShadow: "1px -1px 27px 0px rgba(0,0,0,0.75)"

})

//this belongs to resizing the tiles
let tileResizeScaleFactorX = 1;
let tileResizeScaleFactorY = 1;
let tileSizeDifferenceX, tileSizeDifferenceY;
//logic for resizing the tiles
window.addEventListener("resize", () => {
    tileResizeScaleFactorX = customFunctions.percentage(window.innerWidth, mainContainerBounds.width) / 100;
    tileResizeScaleFactorY = customFunctions.percentage(window.innerHeight, mainContainerBounds.height) / 100;
    tileSizeDifferenceX = tileResizeScaleFactorX * boxesSize
    tileSizeDifferenceY = tileResizeScaleFactorY * boxesSize
    everyTileElement.forEach((tile, index) => {
        gsap.set(tile, {
            width: Math.ceil(boxesSize * tileResizeScaleFactorX),
            height: Math.ceil(boxesSize * tileResizeScaleFactorY),
            left: (everyTileElementStyleLeft[index]) * tileResizeScaleFactorX,
            top:(everyTileElementStyleTop[index]) * tileResizeScaleFactorY});

    })
    allBoxesLayer.forEach((layer, index) =>{ //reset all non-active tiles
        if(index !== currentActiveLayer.int){
            gsap.set(layer, {y: -window.innerHeight - boxesSize})
        }
    })
    for(let i = 0; i < allLayerContentArray.length; i++) { //reset non-active elements
        if(i !== currentActiveLayer.int) {
            gsap.set(allLayerContentArray[i].children[0], {x: window.innerWidth})
        }
    }
})
let rotateValue = 0;
let lightMode = true;
let darkModeClassesToSwap = ["p", "h1", ".button"]
function darkMode (){
    rotateValue += 180;
    gsap.to(darkModeToggle, {rotate: rotateValue, duration: 0.1, ease: "elastic"})
    gsap.to(".icon", {rotate: rotateValue, duration: 1, ease: "power1"})
    if(lightMode){
        lightMode = false;
        gsap.to(allBoxesLayer[0],{backgroundColor: "#7A2200", ease: "easeInOut", duration: 0.5})
        gsap.to(allBoxesLayer[1],{backgroundColor: "#5c0091", ease: "easeInOut", duration: 0.5})
        gsap.to(allBoxesLayer[2],{backgroundColor: "#00587A", ease: "easeInOut", duration: 0.5})
        gsap.to("body",{backgroundColor: "black", ease: "easeInOut", duration: 0.5})
        gsap.to(darkModeClassesToSwap, {color: "white", ease: "easeInOut", duration: 0.5})
        gsap.to("strong", {textDecoration: "underline white solid", ease: "easeInOut", duration: 0.5})
        gsap.to(".buttonWrapper",{
            background: "linear-gradient(144deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 21%, rgba(0,0,0,1) 34%, rgba(0,0,0,1) 65%, rgba(255,255,255,1) 79%, rgba(255,255,255,1) 100%)",
            onComplete: transitionWrappers
        })
        return
    }
    lightMode = true;
    gsap.to(allBoxesLayer[0],{backgroundColor: "#ff6b32", ease: "easeInOut", duration: 0.5})
    gsap.to(allBoxesLayer[1],{backgroundColor: "#B026FF", ease: "easeInOut", duration: 0.5})
    gsap.to(allBoxesLayer[2],{backgroundColor: "#32C6FF", ease: "easeInOut", duration: 0.5})
    gsap.to("body",{backgroundColor: "white", ease: "easeInOut", duration: 0.5})
    gsap.to(darkModeClassesToSwap, {color: "black", ease: "easeInOut", duration: 0.5})
    gsap.to("strong", {textDecoration: "underline black solid", ease: "easeInOut", duration: 0.5})
    gsap.to(".buttonWrapper",{
        background: "linear-gradient(144deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 21%, rgba(255,255,255,1) 34%, rgba(255,255,255,1) 65%, rgba(0,0,0,1) 79%, rgba(0,0,0,1) 100%)",
        onComplete: transitionWrappers
    })

}

const darkModeToggle = document.getElementById("darkMode")

darkModeToggle.addEventListener("click", () => {
    darkModeToggle.classList.toggle("persistent");
    darkMode()
})

const allButtonWrappers = document.querySelectorAll(".buttonWrapper")

//the dom doesn't like it when gsap changes the background, so I set it myself
function transitionWrappers(){
    allButtonWrappers.forEach((wrapper => {
        wrapper.style.backgroundSize = "600% 600%";
    }))
}


const loadingBlanket = document.getElementById("loadingBlanket")
document.addEventListener("DOMContentLoaded", () => {
    gsap.to(loadingBlanket, {opacity: 0, duration: 2, ease: "ease", onComplete: removeBlanket})
})

function removeBlanket(){
    if(loadingBlanket) {
        loadingBlanket.remove()

    }
}




//--webkitfillavialable




