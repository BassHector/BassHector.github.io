const mainContainer = document.getElementById('mainContainer');


let draw = SVG().addTo(mainContainer).size("100%", "100%")
let defs = draw.defs();
let gradient = defs.gradient('linear', function(add) {
    add.stop(0, 'skyblue');
    add.stop(100, 'seagreen');
});

gradient.from(0, 0).to(0, 1);

let rect = draw.rect(window.innerWidth, window.innerHeight).attr({fill: gradient});




console.log(draw.defs())



document.addEventListener("mousemove", (mouse) => {
    console.log("X:", mouse.offsetX)
    console.log("Y:", mouse.offsetY)
    let clipCircle = draw.circle(150).move(mouse.offsetX, mouse.offsetY);
    let clip = draw.clip().add(clipCircle);
    rect.clipWith(clip);


    // draw.clear(rect)
    // rect = draw.rect(100, 100).attr({ fill: '#f06', x: `${mouse.offsetX}px`, y: `${mouse.offsetY}px` })
})
