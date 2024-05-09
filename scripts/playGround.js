let hid = document.getElementById('hid')
const layer1 = document.getElementById("mainContainerHid");

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

let canvas1 = document.createElement("canvas");
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
let canvas2 = document.createElement("canvas");
canvas2.width = boxesSize;
canvas2.height = boxesSize;

let layer1Image = new Image();
function turnTiles(tile, index) {
    if(tile && animatedArray.indexOf(tile) === -1){
        //vvvvvv literally couldn't pass the tile to gsap, so I had to put it in this variable first...for some reason
        let theCurrentTile = tile;
        switch(parseInt(index) % 2){
            case 0:
                gsap.to(tile, {y: -window.innerWidth - boxesSize - 10, duration: animationDuration, ease:"power1.inOut", onComplete: () => {
                        theCurrentTile.style.zIndex = `1`}
                })

                break;
            case 1:
                gsap.to(tile, {y: window.innerWidth + boxesSize + 10, duration: 0.5, ease:"power1.inOut" ,onComplete: () => {
                        theCurrentTile.style.zIndex = `1`
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
let timer = false;

function setLayer (layer){
    const layerNumber = layer * 1000;
    let currentTileId = 0;
    for (let i = 0; i < boxesPerRow; i++) {
        for (let j = 0; j < boxesPerColumn; j++) {
            currentTileId++;
            let imageData;
            let tile = document.createElement('div')
            if(layer === 0) {
                    let context2 = canvas2.getContext('2d');
                    context2.drawImage(layer1Image, boxesSize * i, boxesSize * j, boxesSize, boxesSize);
                    imageData = canvas2.toDataURL('image/png');
                    tile.style.backgroundImage = `url(${imageData})`;
                    tile.style.backgroundSize = 'cover';
            }
            tile.id = `${layerNumber + currentTileId}`;
            tile.className = `layer${layer + 1}`
            tile.style.position = 'absolute';
            tile.style.height = `${boxesSize}px`;
            tile.style.width = `${boxesSize}px`;
            tile.style.top = `${boxesSize * j}px`;
            tile.style.left = `${boxesSize * i}px`;
            tile.style.zIndex = `${numberOfLayers - layer}`;
            tile.style.transition = 'all 0.1s ease';
            tile.setAttribute("name", "tile")
            mainContainer.appendChild(tile)
            tile.addEventListener("click", () => {
                if(!timer) {
                    timer = true;
                    setTimeout(() => {
                        turnTiles(tile, 2);
                        setZIndex();
                        timer = false;
                    }, 200)
                }
            })

        }
    }

}

function setZIndex() {
    setTimeout(() => {
        allBoxes.forEach((box) => {
            box.style.zIndex = `${parseInt(box.style.zIndex) + 1}`
        })
        if(animatedArray.length > (boxesPerLayer * numberOfLayers) / numberOfLayers) {
            for(let i = 0; i < boxesPerLayer; i++) {
                gsap.to(animatedArray[0], {clearProps: "transform"})
                animatedArray.shift()
            }
        }
    }, (boxesPerRow * animateTurnTilesDelay) + animationDuration)

}

html2canvas(layer1).then(function (canvas1) {
    let context = canvas1.getContext('2d');
    context.drawImage(canvas1, 0, 0);
    layer1Image.src = canvas1.toDataURL('image/png');
});
const setLayers = () => {
    for (let i = 0; i < numberOfLayers; i++) {
        setLayer(i);
    }
    // hid.style.display = "none";
}
layer1Image.onload = () => {setLayers()}


let allBoxes = document.getElementsByName("tile");


document.addEventListener("keydown",() =>{
    console.log(animatedArray)

})




