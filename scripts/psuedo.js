import {customFunctions} from "./customModules.js";
gsap.registerPlugin(ScrollTrigger);

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


    // let mouseTextBackground = draw.circle(600).attr({fill: "#FFFFFF"});
    // let maskRect2 = draw.circle(600).fill('black');
    // .add(maskRect2)
    // mouseTextBackground.maskWith(mask);

    let fullRect = draw.rect(mainContainerBounds.width, mainContainerBounds.height).fill('white');
    // let maskRect = draw.rect().attr({height: maskHeight, width: maskWidth, x: 0, y: 0, fill: "black"});


    let mask = draw.mask().add(fullRect)

    console.log(spacingBetweenText)

    const maskCutvariable = 50;
    let previousRowBottom = 0;
    function weNeedSomeRows (amountOfRows, heightOfRow, baseOfWidthOfRow, arrayIndex) {

        for (let i = 0; i < amountOfRows; i++) {
            if(arrayIndex % 2 === 0) {
                let maskWhite = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + (i * maskCutvariable),
                    x: -(baseOfWidthOfRow + (i * maskCutvariable)),
                    y: previousRowBottom + (spacingBetweenText * (arrayIndex + 1)),
                    fill: "#FFFFFF",
                    id: `whiteRow${i}`,
                    ogXpos: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1))
                });
                let maskRow = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + (i * maskCutvariable),
                    x: -(baseOfWidthOfRow + (i * maskCutvariable)),
                    y: previousRowBottom + (spacingBetweenText * (arrayIndex + 1)),
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
                let maskWhite = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + (i * maskCutvariable),
                    x: mainContainerBounds.width,
                    y: previousRowBottom + (spacingBetweenText * (arrayIndex + 1)),
                    fill: "#FFFFFF",
                    id: `whiteRow${i}`,
                    ogXpos: mainContainerBounds.width - (baseOfWidthOfRow * (i + 1))
                });
                let maskRow = draw.rect().attr({
                    height: heightOfRow,
                    width: baseOfWidthOfRow + (i * maskCutvariable),
                    x: mainContainerBounds.width,
                    y: previousRowBottom + (spacingBetweenText * (arrayIndex + 1)),
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
    // y: previousRowBottom + (spacingBetweenText + heightOfRow) * (lineHeight * arrayIndex)
    // y: heightOfRow + previousRowBottom + (spacingBetweenText * arrayIndex),

    arrayAmountOfTextLinesInParagraph.forEach((lineAmount, arrayIndex) => {
        weNeedSomeRows(lineAmount, lineHeight, mainContainerBounds.width * .7, arrayIndex)
    })
    console.log(window.innerWidth)




    //timing matters, text layer needs to be last
    textArray.forEach((text, index) => {
        if (index % 2 === 0) {
            mask.add(createMaskWithLayerText(draw, textArray[index], tenPercentWidth ,spacingBetweenText + previousTextElementBottom, true))
        } else {
            mask.add(createMaskWithLayerText(draw, textArray[index], ninetyPercentWidth ,spacingBetweenText + previousTextElementBottom))
        }
    })

    rect.maskWith(mask);

    let textContainers = document.querySelectorAll("g")
    let textContainersBounds = [];
    textContainers.forEach(target => {
        textContainersBounds.push(target.getBoundingClientRect())
    })




    let moveAmount = 0;
    let weAt = 0;
    let pushTo = 0;
    function someFunction(deltaY){
        moveAmount += deltaY
        moveAmount = customFunctions.clamp(moveAmount,0, mainContainerBounds.height)
        let percentageRelative = customFunctions.relativePercentage(moveAmount + window.innerHeight, mainContainerBounds.height, arrayAmountOfTextLinesInParagraph.length + 1)
        let botOfVP = customFunctions.relativePercentage(moveAmount + window.innerHeight, mainContainerBounds.height, totalTextLines)
        let otherPR = customFunctions.relativePercentage(moveAmount, mainContainerBounds.height, totalTextLines)
        // percentageRelative = customFunctions.clamp(percentageRelative,1, arrayAmountOfTextLinesInParagraph.length)
        let nonActiveContainers = customFunctions.rangeOutside(0, customFunctions.clamp(otherPR,0,totalTextLines/2), botOfVP, totalTextLines - 1)

        let activeContainers = customFunctions.rangeBetween(customFunctions.clamp(otherPR,0,totalTextLines/2), customFunctions.clamp(botOfVP, 0, totalTextLines));
        let amountToMove = 0;


        for(let i = activeContainers[0]; i < activeContainers[activeContainers.length - 1]; i++){
            if (i < catlParagraph[0] || (i >= catlParagraph[1] && i < catlParagraph[2]) || (i >= catlParagraph[3] && i < catlParagraph[4])) {
                gsap.to(gigaRowArray[i], {
                    x: 0
                })
                gsap.to(gigaRowArrayWhite[i], {
                    x: 0
                })
            } else {
                gsap.to(gigaRowArray[i], {
                    x: mainContainerBounds.width - gigaRowArray[i].node.attributes[0].value
                })
                // console.log(gigaRowArray[i].node.attributes[0].value)
                gsap.to(gigaRowArrayWhite[i], {
                    x: mainContainerBounds.width - gigaRowArray[i].node.attributes[0].value
                })
            }
        }

        //WE GOTTA USE THIS TO RETURN ALL NONACTIVE CONTAINERS TO THEIR ORIGINAL POSITIONS
        nonActiveContainers.forEach((number) => {

            gsap.to(gigaRowArray[number], {
                x: mainContainerBounds.width
            })
            gsap.to(gigaRowArrayWhite[number], {
                x: mainContainerBounds.width
            })

        })
        // console.log(nonActiveContainers)



        // for (let j = weAt; j < amountToMove; j++) {
            //                 gsap.to(gigaRowArray[j], {
            //                     x: 50
            //                 })
            //                 gsap.to(gigaRowArrayWhite[j], {
            //                     x: 50
            //                 })
            //             }
            //         } else {
            //             for (let j = weAt; j < amountToMove; j++) {
            //                 gsap.to(gigaRowArray[j], {
            //                     x: -50
            //                 })
            //                 gsap.to(gigaRowArrayWhite[j], {
            //                     x: -50
            //                 })
            //             }




        // for(let i = 0; i < percentageRelative; i++) {
        //     amountToMove += arrayAmountOfTextLinesInParagraph[i]
        //     if (weAt < amountToMove) {
        //         if (i % 2 === 0) {
        //             for (let j = weAt; j < amountToMove; j++) {
        //                 gsap.to(gigaRowArray[j], {
        //                     x: 50
        //                 })
        //                 gsap.to(gigaRowArrayWhite[j], {
        //                     x: 50
        //                 })
        //             }
        //         } else {
        //             for (let j = weAt; j < amountToMove; j++) {
        //                 gsap.to(gigaRowArray[j], {
        //                     x: -50
        //                 })
        //                 gsap.to(gigaRowArrayWhite[j], {
        //                     x: -50
        //                 })
        //             }
        //         }
        //         weAt = amountToMove
        //     }
        //     // weAt is set after the move is made, as of now pushTo is going to used as var to push the blocks back. below is the code im working on
        //     if (otherPR > 5) {
        //         if (i % 2 === 0) {
        //             for (let j = otherPR; j > 0; j--) {
        //                 gsap.to(gigaRowArray[j], {
        //                     x: -50
        //                 })
        //                 gsap.to(gigaRowArrayWhite[j], {
        //                     x: -50
        //                 })
        //             }
        //         } else {
        //             for (let j = otherPR; j > 0; j--) {
        //                 gsap.to(gigaRowArray[j], {
        //                     x: 500
        //                 })
        //                 gsap.to(gigaRowArrayWhite[j], {
        //                     x: 500
        //                 })
        //             }
        //         }
        //     }
        //     weAt = amountToMove
        //     pushTo -= arrayAmountOfTextLinesInParagraph[i]
        //
        // }


        // console.log("we",weAt)
        // console.log("amountto",amountToMove)




        // if(weAt < amountToMove){
        //
        //     for(let i = 0; i < amountToMove; i++) {
        //         gsap.to(gigaRowArray[i], {
        //             x: 50
        //         })
        //         gsap.to(gigaRowArrayWhite[i], {
        //             x: 50
        //         })
        //     }
        //     weAt = amountToMove
        // }


        // for(let i = 0; i < percentageRelative + bottomActivate - 5; i++){
        //     if (i < totalTextLines) {
        //         gsap.to(gigaRowArray[i], {
        //             x: 50
        //         })
        //         gsap.to(gigaRowArrayWhite[i], {
        //             x: 50
        //         })
        //     }
        // }

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


})


// Update the font size whenever the window is resized
window.addEventListener('resize', updateRootFontSize);
window.addEventListener("resize", () => {window.location.reload()})



