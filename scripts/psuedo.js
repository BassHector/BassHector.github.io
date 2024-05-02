import {customFunctions} from "./customModules.js";
gsap.registerPlugin(ScrollTrigger);

const mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();

let tenPercentWidth, fortyPercentWidth, sixtyPercentWidth, ninetyPercentWidth, tenPercentHeight, fortyPercentHeight, sixtyPercentHeight, ninetyPercentHeight;

const textArray = [
    "Here’s a /n neat showcase /n of over 100  elements, /n  each dynamically generated/n with SVG. They maintain crisp details/n  at any scale and adapt seamlessly to any display.",
    "This isn’t made with a library; it’s a hand/n written engine that dynamically/n integrates text into scalable/n elements, fine-tuned for/n any application.",
    "I use SVG.js/n to create each element./n  The architecture is lightweight,/n  ensuring efficient performance and easy/n  updates, while meticulously managing all elements.",
    "With GreenSock’s Observer Plug-in, /n every scroll you make triggers /n an animation. I believe web /n design should be scalable, /n fun, and interactive",
    "I use over six/n different arrays to/n keep track of everything. /n It’s a bit like conducting an /n orchestra—each part in perfect/n harmony for smooth animations."
];


let gigaRowArray = []
let gigaRowArrayWhite = []
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

let catlParagraph = customFunctions.cumulativeIntArray(arrayAmountOfTextLinesInParagraph);

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

    //I should delete these but nah
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
    spacingBetweenText =  ((mainContainerBounds.height - ((newFontSize) * totalTextLines)) / (textArray.length + 1));

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
    //gradient background
    let rect = draw.rect(mainContainerBounds.width, mainContainerBounds.height).attr({fill: gradient});
    //mask layer
    let fullRect = draw.rect(mainContainerBounds.width, mainContainerBounds.height).fill('white');
    let mask = draw.mask().add(fullRect)

    const maskCutvariable = 50;
    let previousRowBottom = 0;
    function weNeedSomeRows (amountOfRows, heightOfRow, baseOfWidthOfRow, arrayIndex) {
        for (let i = 0; i < amountOfRows; i++) {
            if(arrayIndex % 2 === 0) {
                const yPos = arrayIndex === 0 ? previousRowBottom + (spacingBetweenText * (arrayIndex + 1)) : previousRowBottom + (spacingBetweenText * (arrayIndex + 1) - (lineHeight * arrayIndex));
                let maskWhite = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + (i * maskCutvariable),
                    x: -(baseOfWidthOfRow + (i * maskCutvariable)),
                    y: yPos,
                    fill: "#FFFFFF",
                    id: `whiteRow${i}`,
                    ogXpos: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1))
                });
                let maskRow = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + (i * maskCutvariable),
                    x: -(baseOfWidthOfRow + (i * maskCutvariable)),
                    y: yPos,
                    fill: "black",
                    id: `blackRow${i}`,
                    ogXpos: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1))
                });
                previousRowBottom += heightOfRow
                mask.add(maskRow);
                maskWhite.maskWith(mask);
                gigaRowArray.push(maskRow);
                gigaRowArrayWhite.push(maskWhite);
            } else {
                const yPos = arrayIndex === 1 ? previousRowBottom + (spacingBetweenText * (arrayIndex + 1) - lineHeight) : previousRowBottom + (spacingBetweenText * (arrayIndex + 1) - (lineHeight * arrayIndex));
                let maskWhite = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + ((amountOfRows - i) * maskCutvariable),
                    x: mainContainerBounds.width,
                    y: yPos,
                    fill: "#FFFFFF",
                    id: `whiteRow${i}`,
                    ogXpos: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1))
                });
                let maskRow = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + ((amountOfRows - (i + 1))  * maskCutvariable),
                    x: mainContainerBounds.width,
                    y: yPos,
                    fill: "black",
                    id: `blackRow${i}`,
                    ogXpos: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1))
                });
                previousRowBottom += heightOfRow
                mask.add(maskRow);
                maskWhite.maskWith(mask);
                gigaRowArray.push(maskRow);
                gigaRowArrayWhite.push(maskWhite);
            }
        }
    }

    arrayAmountOfTextLinesInParagraph.forEach((lineAmount, arrayIndex) => {
        weNeedSomeRows(lineAmount, lineHeight, mainContainerBounds.width * .7, arrayIndex)
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

    let moveAmount = 0;

    function someFunction(){

        moveAmount = window.scrollY
        moveAmount = customFunctions.clamp(moveAmount,0, mainContainerBounds.height)
        let botOfVP = customFunctions.relativePercentage(moveAmount + window.innerHeight, mainContainerBounds.height, totalTextLines)
        let otherPR = customFunctions.relativePercentage(moveAmount, mainContainerBounds.height, totalTextLines)
        //arrays that determine what rects to move.
        let nonActiveContainers = customFunctions.rangeOutside(0, customFunctions.clamp(otherPR,0,Math.ceil(totalTextLines/2)), botOfVP, totalTextLines - 1)
        let activeContainers = customFunctions.rangeBetween(customFunctions.clamp(otherPR,0,Math.ceil(totalTextLines/2)), customFunctions.clamp(botOfVP, 0, totalTextLines));
        for(let i = activeContainers[0]; i < activeContainers[activeContainers.length - 1]; i++){
            if (i < catlParagraph[0] || (i >= catlParagraph[1] && i < catlParagraph[2]) || (i >= catlParagraph[3] && i < catlParagraph[4])) {
                gsap.to(gigaRowArray[i], {
                    x: 0
                })
                gsap.to(gigaRowArrayWhite[i], {
                    x: 0
                })
            } else if (gigaRowArray[i]){
                gsap.to(gigaRowArray[i], {
                    x: mainContainerBounds.width - gigaRowArray[i].node.attributes[0].value
                })
                gsap.to(gigaRowArrayWhite[i], {
                    x: mainContainerBounds.width - gigaRowArray[i].node.attributes[0].value
                })
            }
        }

        nonActiveContainers.forEach((number) => {
            if (gigaRowArray[number] && gigaRowArrayWhite[number]) {

                gsap.to(gigaRowArray[number], {
                    x: mainContainerBounds.width
                })
                gsap.to(gigaRowArrayWhite[number], {
                    x: mainContainerBounds.width
                })
            }

        })

    }


    Observer.create({
        target: window,
        type: "wheel, scroll",
        onUp: ()=>{
            someFunction()
        },
        onDown: ()=>{
            someFunction()
        }
    })
    someFunction()


})


// Update the font size whenever the window is resized
window.addEventListener('resize', updateRootFontSize);
window.addEventListener("resize", () => {window.location.reload()})



