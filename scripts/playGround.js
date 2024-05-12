import {customFunctions} from "./customModules.js";
gsap.registerPlugin(TextPlugin)

let layer0Content = document.getElementById('layer0')
let layer1Content = document.getElementById('layer1')
let layer2Content = document.getElementById('layer2')
let layer3Content = document.getElementById('layer3')


// use querySelectorAll because somebody thought it was a good idea to place the nodes inside a htmlcollection instead of an array when using getElementsByClassName
let buttons = document.querySelectorAll(".button");

let mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();

let boxMaxDim = Math.min(mainContainerBounds.width, mainContainerBounds.height);
//must be a numbered squared
const numberOfBox = 64;

const boxesSize = Math.ceil(boxMaxDim / Math.sqrt(numberOfBox));
const boxesPerRow = Math.ceil(mainContainerBounds.width / boxesSize);
const boxesPerColumn = Math.round(mainContainerBounds.height / boxesSize);
const numberOfLayers = 3;
const boxesPerLayer = (boxesPerRow * boxesPerColumn)

let animatedArray = []

let lastHoveredTile = null;
let animationIncre = 0;
let currentActiveElements = Array.from(layer0Content.querySelectorAll('*'))

let transitionTimeline = gsap.timeline({duration: 0.5})

function turnTiles(tile, layer, tileNumber) {
    lastHoveredTile = null;
    if(tile){
        //vvvvvv literally couldn't pass the tile to gsap, so I had to put it in this variable first...for some reason
        let theCurrentTile = tile;
        switch(parseInt(tileNumber) % 2){
            case 0:
                transitionTimeline.to(tile, {y: -window.innerHeight - boxesSize - 10, onComplete: (() => {
                            theCurrentTile.style.zIndex = `1`;
                            theCurrentTile.style.pointerEvents = "none";
                            animationIncre++
                            console.log(layer)
                            setZIndex(layer)
                    })
                }, "-=0.495")
                break;
            case 1:
                transitionTimeline.to(tile, {y: window.innerHeight + boxesSize + 10, onComplete: (() => {
                        theCurrentTile.style.zIndex = `1`;
                        theCurrentTile.style.pointerEvents = "none";
                        animationIncre++
                        setZIndex(layer)
                    })
                }, "-=0.495")
                break;
            default:
                console.log("error")
        }

        animatedArray.push(tile)
        // console.log(animationIncre)
        let tilesToAnimate = [];
        tilesToAnimate.push(document.getElementById(`${tile.id - 1}`))
        tilesToAnimate.push(document.getElementById(`${parseInt(tile.id) + 1}`))
        tilesToAnimate.push(document.getElementById(`${tile.id - boxesPerColumn}`))
        tilesToAnimate.push(document.getElementById(`${parseInt(tile.id) + boxesPerColumn}`))

        tilesToAnimate.forEach((superTile) => {
            if (animatedArray.indexOf(superTile) === -1) {
                turnTiles(superTile, layer, animationIncre);
            }
        })



    }
}

function setZIndex(layer) {
    if (animationIncre === boxesPerLayer){
        console.log("hit")
        animatedArray = [];
        for(let i = 0; i < allBoxesLayer[layer].length; i++){
            transitionTimeline.to(allBoxesLayer[layer][i], {y: 0 }, "-=0.495")
            ///////SNAJKDLJIFASBLJKFBLJKSBFALJKBFLJKFBSJLK I STOPPED HERE!!!
            allBoxesLayer[layer][i].style.zIndex = `${numberOfLayers}`

            setTimeout(() => {
                allBoxesLayer[layer][i].style.pointerEvents = ""
            }, 50 * i)

        }
        for(let i = 0; i < currentActiveElements.length; i++){
            currentActiveLayer.div.style.zIndex = `${numberOfLayers + 1}`
            currentActiveLayer.div.style.pointerEvents = `none`
        }
    }
}

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
            tile.style.border = '1px solid black';
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
                lastHoveredTile = tile;
            })

            // tile.addEventListener("click", () => {
            //     if(!timer) {
            //         timer = true;
            //         setTimeout(() => {
            //             turnTiles(tile, 2);
            //             setZIndex();
            //             timer = false;
            //         }, 200)
            //     }
            // })

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

let scaledSpeed = 0;

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
let tileForce= 0;
document.addEventListener('mousemove', function(e) {
    tileForce = getMouseDirection(e) * getMouseSpeed(e)
});

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        animationIncre = 0;
            if (button.innerText === "Skills") {
                if(lastHoveredTile === null){
                    lastHoveredTile = allBoxesLayer[currentActiveLayer.int][Math.round(allBoxesLayer[1].length / 2) ]
                }
                animationIncre = 0;
                currentActiveLayer = {int: 1, div: layer1Content};
                moveElements(currentActiveLayer, lastHoveredTile, 1, 0)
                playSkillsAnimations()
            }
            if (button.innerText === "Projects") {
                animationIncre = 0;
                currentActiveLayer = {int: 2, div: layer2Content};
                turnTiles(lastHoveredTile, 2, 0)

            }
            if (button.innerText === "Contact") {
                animationIncre = 0;
                currentActiveLayer = {int: 3, div: layer3Content};
                turnTiles(lastHoveredTile, 3, 0)
            }
            if (button.innerText === "Home") {
                if(lastHoveredTile === null){
                    lastHoveredTile = allBoxesLayer[currentActiveLayer.int][Math.round(allBoxesLayer[0].length / 2) ]
                    console.log(lastHoveredTile)
                }
                animationIncre = 0;
                currentActiveLayer = {int: 0, div: layer0Content};
                moveElements(currentActiveLayer, lastHoveredTile, 0, 0)

            }

    });
});
//takes in current active layer objects vvvvv

function moveElements(currentActiveLayersObj, lastHoveredTile, layer, tileId) {
    currentActiveElements.forEach((element) => {
        transitionTimeline.to(element, {x: window.innerWidth}, "-=0.495");
    })
    //converting to object
    currentActiveElements = Array.from(currentActiveLayersObj.div.querySelectorAll('*'))
    //push the new layer objects in
    transitionTimeline.to(currentActiveElements, {x: 0});
    turnTiles(lastHoveredTile, layer, tileId)
}

let currentActiveLayer = {};

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
            '&nbsp;&nbsp;&nbsp;&nbsp;console.log("Hello, World!"); <br>' +
            '}&lt;br&gt;' +
            '<br>' +
            'for(let i = 0; i &lt; 5; i++) {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;elementArray.push(i);<br>' +
            'if(elementArray.length &lt; totalElement) { <br>' +
            'return(i) <br>' +
            '}<br>' +
            '&lt;/script&gt;<br>';
        let cssContent = '&lt;style&gt;<br>' +
            '.Container {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;background-color: #f0f0f0;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;margin: 20px;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;padding: 10px;<br>' +
            '}<br>' +
            'p {<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;color: blue;<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;font-size: 16px;<br>' +
            '}&lt;/style&gt;<br>';

        skillsTimeline.to(htmlBox, {
            text: {
                value: htmlContent,
                newClass: "skillsGreen"
            }
        })
        skillsTimeline.to(cssBox, {
            text: {
                value: cssContent,
                newClass: "skillsPlum"
            },})
        skillsTimeline.to(jsBox, {
            text: {
            value: jsContent,
                newClass: "skillsGold"
        },})
        playSkillsAnimationsFlag = true;
    }
}




// if(allBoxesLayer[layer][i].style.zIndex !== `${numberOfLayers - 1}`) { // if the layer you're going to is behind it, don't animate it
//     ((index) => { //invoke this immediately
//         gsap.to(allBoxesLayer[layer][i], {
//             y: 0,
//             stagger: {
//                 each: 0.05,
//                 from: 'end',
//                 grid: 'auto',
//                 ease: 'power2.inOut',
//             },
//             onStart: () => {
//                 allBoxesLayer[layer][index].style.zIndex = `${numberOfLayers}`
//                 allBoxesLayer[layer][index].style.pointerEvents = ""}
//         })
//     })(i);
// document.addEventListener("click", () =>{console.log(isAnimating)});


