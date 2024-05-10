import {customFunctions} from "./customModules.js";

let hid = document.getElementById('hid')
const layer1 = document.getElementById("mainContainerHid");

// use querySelectorAll because somebody thought it was a good idea to place the nodes inside a htmlcollection instead of an array when using getElementsByClassName
let buttons = document.querySelectorAll(".button");

let mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();

let boxMaxDim = Math.min(mainContainerBounds.width, mainContainerBounds.height);
//must be a numbered squared
const numberOfBox = 16;


const boxesSize = Math.ceil(boxMaxDim / Math.sqrt(numberOfBox));
const boxesPerRow = Math.ceil(mainContainerBounds.width / boxesSize);
const boxesPerColumn = Math.round(mainContainerBounds.height / boxesSize);
const numberOfLayers = 3;
const boxesPerLayer = (boxesPerRow * boxesPerColumn)

const animateTurnTilesDelay = 50;
const animationDuration = 0.5

let animatedArray = []


function turnTiles(tile, index, currentActiveLayer) {
    if(tile && animatedArray.indexOf(tile) === -1){
        //vvvvvv literally couldn't pass the tile to gsap, so I had to put it in this variable first...for some reason
        let theCurrentTile = tile;
        switch(parseInt(index) % 2){
            case 0:
                gsap.to(tile, {y: -window.innerWidth - boxesSize - 10, duration: animationDuration, ease:"power1.inOut", onComplete: () => {
                        theCurrentTile.style.zIndex = `1`;
                        theCurrentTile.style.pointerEvents = "none";
                    }
                })

                break;
            case 1:
                gsap.to(tile, {y: window.innerWidth + boxesSize + 10, duration: 0.5, ease:"power1.inOut" ,onComplete: () => {
                        theCurrentTile.style.zIndex = `1`
                        theCurrentTile.style.pointerEvents = "none";
                    }
                })
                break;
            default:
                console.log("error")
        }
        animatedArray.push(tile)
        let tilesToAnimate = [];
        tilesToAnimate.push(document.getElementById(`${tile.id - 1}`))
        tilesToAnimate.push(document.getElementById(`${parseInt(tile.id) + 1}`))
        tilesToAnimate.push(document.getElementById(`${tile.id - boxesPerColumn}`))
        tilesToAnimate.push(document.getElementById(`${parseInt(tile.id) + boxesPerColumn}`))
        setTimeout(() => {
            for(tile in tilesToAnimate){
                turnTiles(tilesToAnimate[tile], tile);
            }

        }, animateTurnTilesDelay)
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
            tile.style.height = `${boxesSize}px`;
            tile.style.width = `${boxesSize}px`;
            tile.style.top = `${boxesSize * j}px`;
            tile.style.left = `${boxesSize * i}px`;
            tile.style.zIndex = `${numberOfLayers - layer}`;
            if(parseInt(tile.style.zIndex) !== numberOfLayers){
                tile.style.pointerEvents = "none";
            }
            tile.style.transition = 'all 0.1s ease';
            tile.setAttribute("name", "tile")
            mainContainer.appendChild(tile)
            console.log(layer)

            tile.addEventListener("mouseover", () => {
                gsap.fromTo(tile, {rotateY: 0}, {rotateY: tileForce, duration: scaledSpeed, ease: "elastic", onComplete: ()=> reverse(tile) })
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

function setZIndex() {
    setTimeout(() => {
        allBoxes.forEach((box) => {
            box.style.zIndex = `${parseInt(box.style.zIndex) + 1}`
            if (parseInt(box.style.zIndex) === numberOfLayers) {
                box.style.pointerEvents = "";
            }
        })
        if(animatedArray.length > (boxesPerLayer * numberOfLayers) / numberOfLayers) {
            for(let i = 0; i < boxesPerLayer; i++) {
                gsap.to(animatedArray[0], {clearProps: "transform"})
                animatedArray.shift()
            }
        }
    }, (boxesPerRow * animateTurnTilesDelay) + animationDuration)

}
let allBoxesLayer = [];

const setLayers = () => {
    for (let i = 0; i < numberOfLayers; i++) {
        setLayer(i);
        allBoxesLayer.push(document.querySelectorAll(`.layer${i + 1}`))
    }

}
setLayers()
console.log(allBoxesLayer)

let allBoxes = document.getElementsByName("tile");

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
        if(button.innerText === "Skills"){
            console.log(button.innerText);
        }
        if(button.innerText === "Projects"){

        }
        if(button.innerText === "Contact"){

        }
    });
});

let currentActiveLayer = 1;
function activeLayer () {

}


