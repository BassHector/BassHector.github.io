import {customFunctions} from "./customModules.js";

const mainContainer = document.getElementById('mainContainer');
let maskWidth = 200
let maskHeight = 100

let draw = SVG(undefined, undefined).addTo(mainContainer).size("100%", "100%")
let defs = draw.defs();
let gradient = defs.gradient('linear', function(add) {
    add.stop(0, 'skyblue');
    add.stop(100, 'seagreen');
});

gradient.from(0, 0).to(0, 1);

let rect = draw.rect(window.innerWidth, window.innerHeight).attr({fill: gradient});
let maskText = draw.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
    "\n Praesent consequat, velit et pharetra sodales, nibh purus euismod turpis, sed vestibulum libero nulla et antez" +
    "\n Morbi egestas massa justo, non eleifend est pharetra id." +
    "\n Suspendisse lobortis feugiat orci, sed blandit lacus congue nec." +
    "\n Fusce vel lorem at magna luctus euismod." +
    "\n Proin quis fringilla orci. Praesent cursus, metus sed commodo rhoncus, leo dui fringilla leo, eu vehicula odio quam vitae metus." +
    "\n Aliquam non felis id metus egestas laoreet vitae aliquet arcu." +
    "\n Suspendisse placerat sagittis odio ac vehicula. Nullam sapien lectus, eleifend sed consectetur sed, accumsan in lacus." +
    "\n In hac habitasse platea dictumst. Donec sed auctor dui, eu pharetra elit. Curabitur non velit tortor." +
    "\n Aliquam non laoreet risus. Pellentesque aliquet euismod turpis, sed laoreet urna tincidunt id. In vel metus fermentum, convallis purus sit amet, bibendum purus. Donec id leo est." ).move(50,50).fill("white")

let textBackground = draw.rect(maskWidth, maskHeight)
    .attr({x: 50, y: 50, fill: "#FFFFFF"});
let mouseTextBackground = draw.circle(100).attr({fill: "#FFFFFF"});

let fullRect = draw.rect(window.innerWidth, window.innerHeight).fill('white');
let maskRect = draw.rect().attr({height: maskHeight, width: maskWidth, x: 0, y: 0, fill: "black"});
let maskRect2 = draw.circle(100).fill('black');
let mask = draw.mask().add(fullRect).add(maskRect).add(maskRect2).add(maskText);



rect.maskWith(mask);
textBackground.maskWith(mask);
mouseTextBackground.maskWith(mask);




let moveAmount = 0;
function someFunction(deltaY){
    moveAmount += deltaY
    moveAmount = customFunctions.clamp(moveAmount,0, window.innerWidth - maskWidth)
    maskRect.animate({duration: 10, when: 'after'}).ease('<>').move(moveAmount, 0)
    textBackground.animate({duration: 10, when: 'after'}).ease('<>').move(moveAmount, 0)

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
    // console.log("X:", mouse.offsetX)
    // console.log("Y:", mouse.offsetY)
    maskRect2.animate({duration: 10, when: 'after'}).ease('<>').move(mouse.offsetX, mouse.offsetY)
    mouseTextBackground.animate({duration: 10, when: 'after'}).ease('<>').move(mouse.offsetX, mouse.offsetY)



    // let clipCircle = draw.circle(150).move(mouse.offsetX, mouse.offsetY);
    // let clip = draw.clip().add(clipCircle);
    // rect.clipWith(clip);


    // draw.clear(rect)
    // rect = draw.rect(100, 100).attr({ fill: '#f06', x: `${mouse.offsetX}px`, y: `${mouse.offsetY}px` })
})

window.addEventListener("resize", () => {window.location.reload()})

