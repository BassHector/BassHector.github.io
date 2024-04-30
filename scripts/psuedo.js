import {customFunctions} from "./customModules.js";

const mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();

const tenPercentWidth = mainContainerBounds.width * 0.1;
const fortyPercentWidth = mainContainerBounds.width * 0.4;
const sixtyPercentWidth = mainContainerBounds.width * 0.6;
const ninetyPercentWidth = mainContainerBounds.width * 0.9;

const tenPercentHeight = mainContainerBounds.height * 0.1;
const fortyPercentHeight = mainContainerBounds.height * 0.4;
const sixtyPercentHeight = mainContainerBounds.height * 0.6;
const ninetyPercentHeight = mainContainerBounds.height * 0.9;

let lineHeight;

function updateRootFontSize() {
    const baseFontSize = 16;
    let widthScaleFactor;
    let heightScaleFactor;

    if (window.innerWidth < 768) {
        widthScaleFactor = 0.001;
        heightScaleFactor = 0.01;

    } else {
        widthScaleFactor = 0.020;
        heightScaleFactor = 0.015;
    }
    const newFontSize = baseFontSize + (window.innerWidth * widthScaleFactor) + (window.innerHeight * heightScaleFactor);

    const lineHeightMultiplier = 1.4;
    lineHeight = newFontSize * lineHeightMultiplier;

    document.documentElement.style.fontSize = `${newFontSize}px`;
}

let previousTextElementBottom = 0;
const spacingBetweenText =  tenPercentHeight;

function createMaskWithLayerText(svgElement, StringText, x, y, lineHeightpx, even ){
    let lines = StringText.split("/n")
    console.log(even)
    let container = svgElement.group()
    if (even){
        lines.forEach((line, index) =>{
            container.text(line).move(x, y + (lineHeightpx * index)).fill("white").attr({'text-anchor': 'start'});

            previousTextElementBottom = y + (lineHeightpx * index)
        })
        return container;
    }
    lines.forEach((line, index) =>{
        container.text(line).move(x, y + (lineHeightpx * index)).fill("white").attr({'text-anchor': 'end'});

        previousTextElementBottom = y + (lineHeightpx * index)
    })


    return container;
}



document.addEventListener("DOMContentLoaded", () => {
    let draw = SVG().addTo(mainContainer).size("100%", "100%")
    let defs = draw.defs();
    let gradient = defs.gradient('linear', function(add) {
        add.stop(0, 'skyblue');
        add.stop(100, 'seagreen');
    });
    gradient.from(0, 0).to(0, 1);
    //Black Layer
    let rect = draw.rect(mainContainerBounds.width, mainContainerBounds.height).attr({fill: gradient});
    //text to go with layer
    const firstText = "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
    let firstParagraph = createMaskWithLayerText(draw, firstText,tenPercentWidth ,spacingBetweenText + previousTextElementBottom, lineHeight, true)
    const secondText = "Praesent semper enim eget pretium /n sagittis. Maecenas lectus risus /n egestas quis, facilisis vel/n efficitur sit amet erat./n Quisque vel lacus."
    let secondParagraph = createMaskWithLayerText(draw, secondText, ninetyPercentWidth,spacingBetweenText + previousTextElementBottom, lineHeight)
    const thirdText = "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
    let thirdParagraph = createMaskWithLayerText(draw, firstText,tenPercentWidth ,spacingBetweenText + previousTextElementBottom, lineHeight, true)
    const fourthText = "Praesent semper enim eget pretium /n sagittis. Maecenas lectus risus /n egestas quis, facilisis vel/n efficitur sit amet erat./n Quisque vel lacus."
    let fourthParagraph = createMaskWithLayerText(draw, secondText, ninetyPercentWidth,spacingBetweenText + previousTextElementBottom, lineHeight)
    const fifthText = "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
    let fifthParagraph = createMaskWithLayerText(draw, firstText,tenPercentWidth ,spacingBetweenText + previousTextElementBottom, lineHeight, true)




    let mouseTextBackground = draw.circle(600).attr({fill: "#FFFFFF"});

    let fullRect = draw.rect(mainContainerBounds.width, mainContainerBounds.height).fill('white');
    // let maskRect = draw.rect().attr({height: maskHeight, width: maskWidth, x: 0, y: 0, fill: "black"});

    let maskRect2 = draw.circle(600).fill('black');
    let mask = draw.mask().add(fullRect).add(maskRect2)



    //I WAS HERE
    function weNeedSomeRows (amountOfRows, heightOfRow, baseOfWidthOfRow) {
        let previousRowBottom = 0;
        for (let i = 0; i < amountOfRows; i++) {
            console.log("hit")
            // let test = draw.circle(600).attr({fill: "#FFFFFF"});
            let maskWhite = draw.rect().attr({height: heightOfRow, width: baseOfWidthOfRow * (i + 1), x: 0, y: previousRowBottom, fill: "#FFFFFF", id: `whiteRow${i}`});
            let maskRow = draw.rect().attr({height: heightOfRow, width: baseOfWidthOfRow * (i + 1), x: 0, y: previousRowBottom, fill: "black", id: `blackRow${i}`});
            previousRowBottom += heightOfRow

            mask.add(maskRow);
            maskWhite.maskWith(mask);
            // mask.add(maskRow);

        }
    }
    weNeedSomeRows(5, 100, 100)
    mask.add(firstParagraph).add(secondParagraph).add(thirdParagraph).add(fourthParagraph).add(fifthParagraph);

    rect.maskWith(mask);
    // textBackground.maskWith(mask);
    mouseTextBackground.maskWith(mask);

    let moveAmount = 0;
    function someFunction(deltaY){
        moveAmount += deltaY
        // moveAmount = customFunctions.clamp(moveAmount,0, window.innerWidth - maskWidth)
        // maskRect.animate({duration: 10, when: 'after'}).ease('<>').move(moveAmount, 0)
        // textBackground.animate({duration: 10, when: 'after'}).ease('<>').move(moveAmount, 0)

    }


    Observer.create({
        target: window,
        type: "wheel, scroll",
        onUp: (self)=>{

            someFunction(self.deltaY)
        },
        onDown: (self)=>{
            someFunction(self.deltaY)
        }
    })

    console.log(getComputedStyle(mainContainer).fontSize)

    document.addEventListener("mousemove", (mouse) => {
        maskRect2.move(mouse.offsetX - 300, mouse.offsetY - 300)
        mouseTextBackground.move(mouse.offsetX - 300, mouse.offsetY - 300)
    })


})

updateRootFontSize()




// Update the font size whenever the window is resized
window.addEventListener('resize', updateRootFontSize);
window.addEventListener("resize", () => {window.location.reload()})



