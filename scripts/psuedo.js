import {customFunctions} from "./customModules.js";

const mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();

let tenPercentWidth, fortyPercentWidth, sixtyPercentWidth, ninetyPercentWidth, tenPercentHeight, fortyPercentHeight, sixtyPercentHeight, ninetyPercentHeight;

const textArray = [
    "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc.",
    "Praesent semper enim eget pretium /n sagittis. Maecenas lectus risus /n egestas quis, facilisis vel/n efficitur sit amet erat./n Quisque vel lacus.",
    "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc.",
    "Praesent semper enim eget pretium /n sagittis. Maecenas lectus risus /n egestas quis, facilisis vel/n efficitur sit amet erat./n Quisque vel lacus.",
    "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
];


function amountOfTextLines(arrayOfSentences) {
    let totalTextLines = 0;
    arrayOfSentences.forEach(text => {
        let lines = text.split("/n")
        totalTextLines += lines.length
        arrayAmountOfTextLinesInParagraph.push(lines.length)
    })
    return totalTextLines;
}

let arrayAmountOfTextLinesInParagraph = [];
const totalTextLines = amountOfTextLines(textArray)

let spacingBetweenText;
let newFontSize;
let lineHeight;
function updateRootFontSize() {
    const baseFontSize = 16;
    let widthScaleFactor;
    let heightScaleFactor;

    if (window.innerWidth < 768) {
        widthScaleFactor = 0.001;
        heightScaleFactor = 0.01;

    } else {
        widthScaleFactor = 0.009;
        heightScaleFactor = 0.015;
    }
    newFontSize = baseFontSize + (window.innerWidth * widthScaleFactor) + (window.innerHeight * heightScaleFactor);

    document.documentElement.style.fontSize = `${newFontSize}px`;
    mainContainer.getBoundingClientRect();

    tenPercentWidth = mainContainerBounds.width * 0.1;
    fortyPercentWidth = mainContainerBounds.width * 0.4;
    sixtyPercentWidth = mainContainerBounds.width * 0.6;
    ninetyPercentWidth = mainContainerBounds.width * 0.9;

    tenPercentHeight = mainContainerBounds.height * 0.1;
    fortyPercentHeight = mainContainerBounds.height * 0.4;
    sixtyPercentHeight = mainContainerBounds.height * 0.6;
    ninetyPercentHeight = mainContainerBounds.height * 0.9;

    lineHeight = newFontSize * 1.2;
    // add the height of all the lines, then subtract from height of container then divide up the free space between all of paragraphs
    spacingBetweenText =  ((mainContainerBounds.height - ((newFontSize) * totalTextLines)) / (textArray.length + 1)); ;

    if (spacingBetweenText < 0) {
        mainContainer.style.height = `${mainContainerBounds.height + (Math.abs(spacingBetweenText * textArray.length))}px`;
        spacingBetweenText = Math.abs(spacingBetweenText);
        mainContainer.getBoundingClientRect();
    }
}
updateRootFontSize()

let previousTextElementBottom = 0;

function createMaskWithLayerText(svgElement, StringText, x, y, even ){
    let lines = StringText.split("/n")
    let container = svgElement.group()
    if (even) {
        lines.forEach((line, index) => {
            container.text(line).move(x, y + (lineHeight * index)).fill("white").attr({'text-anchor': 'start'});

            previousTextElementBottom = y + (lineHeight * index)
        })
        return container;
    }
    lines.forEach((line, index) => {
        container.text(line).move(x, y + (lineHeight * index)).fill("white").attr({'text-anchor': 'end'});

        previousTextElementBottom = y + (lineHeight * index)
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

    // const firstText = "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
    // let firstParagraph = createMaskWithLayerText(draw, firstText, tenPercentWidth ,spacingBetweenText + previousTextElementBottom, true)
    // const secondText = "Praesent semper enim eget pretium /n sagittis. Maecenas lectus risus /n egestas quis, facilisis vel/n efficitur sit amet erat./n Quisque vel lacus."
    // let secondParagraph = createMaskWithLayerText(draw, secondText, ninetyPercentWidth,spacingBetweenText + previousTextElementBottom,)
    // const thirdText = "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
    // let thirdParagraph = createMaskWithLayerText(draw, firstText,tenPercentWidth ,spacingBetweenText + previousTextElementBottom,  true)
    // const fourthText = "Praesent semper enim eget pretium /n sagittis. Maecenas lectus risus /n egestas quis, facilisis vel/n efficitur sit amet erat./n Quisque vel lacus."
    // let fourthParagraph = createMaskWithLayerText(draw, secondText, ninetyPercentWidth,spacingBetweenText + previousTextElementBottom, )
    // const fifthText = "Morbi suscipit tortor justo, /n sed consequat nisi imperdiet at. /n Integer turpis sapien, ullamcorper id /n purus quis, imperdiet ornare orci. Nunc."
    // let fifthParagraph = createMaskWithLayerText(draw, firstText,tenPercentWidth ,spacingBetweenText + previousTextElementBottom,  true)


    let mouseTextBackground = draw.circle(600).attr({fill: "#FFFFFF"});

    let fullRect = draw.rect(mainContainerBounds.width, mainContainerBounds.height).fill('white');
    // let maskRect = draw.rect().attr({height: maskHeight, width: maskWidth, x: 0, y: 0, fill: "black"});

    let maskRect2 = draw.circle(600).fill('black');
    let mask = draw.mask().add(fullRect).add(maskRect2)



    let previousRowBottom = 0;
    function weNeedSomeRows (amountOfRows, heightOfRow, baseOfWidthOfRow, arrayIndex) {

        for (let i = 0; i < amountOfRows; i++) {
            if(arrayIndex % 2 === 0) {
                let maskWhite = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow * (i + 1),
                    x: 0,
                    y: heightOfRow + previousRowBottom + (spacingBetweenText * arrayIndex),
                    fill: "#FFFFFF",
                    id: `whiteRow${i}`
                });
                let maskRow = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow * (i + 1),
                    x: 0,
                    y: heightOfRow + previousRowBottom + (spacingBetweenText * arrayIndex),
                    fill: "black",
                    id: `blackRow${i}`
                });
                previousRowBottom += heightOfRow
                mask.add(maskRow);
                maskWhite.maskWith(mask);
            } else {
                let maskWhite = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow * (i + 1),
                    x: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1)),
                    y: heightOfRow + previousRowBottom + (spacingBetweenText * arrayIndex),
                    fill: "#FFFFFF",
                    id: `whiteRow${i}`
                });
                let maskRow = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow * (i + 1),
                    x: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1)),
                    y: heightOfRow + previousRowBottom + (spacingBetweenText * arrayIndex),
                    fill: "black",
                    id: `blackRow${i}`
                });
                previousRowBottom += heightOfRow
                mask.add(maskRow);
                maskWhite.maskWith(mask);
            }
        }
    }

    arrayAmountOfTextLinesInParagraph.forEach((lineAmount, arrayIndex) => {
        weNeedSomeRows(lineAmount, lineHeight, 100, arrayIndex)
    })



    //timing matters, text layer needs to be last
    textArray.forEach((text, index) => {
        if (index % 2 === 0) {
            mask.add(createMaskWithLayerText(draw, textArray[index], tenPercentWidth ,spacingBetweenText + previousTextElementBottom, true))
        } else {
            mask.add(createMaskWithLayerText(draw, textArray[index], ninetyPercentWidth ,spacingBetweenText + previousTextElementBottom))
        }
    })

    rect.maskWith(mask);

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

    document.addEventListener("mousemove", (mouse) => {
        maskRect2.move(mouse.offsetX - 300, mouse.offsetY - 300)
        mouseTextBackground.move(mouse.offsetX - 300, mouse.offsetY - 300)
    })

})


// Update the font size whenever the window is resized
window.addEventListener('resize', updateRootFontSize);
window.addEventListener("resize", () => {window.location.reload()})



