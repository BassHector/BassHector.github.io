import { Rect } from "/../node_modules/@svgdotjs/svg.js"
let mainContainer = document.getElementById('mainContainer');
let mainContainerBounds = mainContainer.getBoundingClientRect();
document.addEventListener('DOMContentLoaded', () => {
    let draw = SVG().addTo(mainContainer).size(mainContainerBounds.width, mainContainerBounds.height).style("position, absolute").style('top', '0').style('left', '0');
    let defs = draw.defs()
    let gradient1 = defs.gradient('linear', function (add) {
        add.stop(0, '#333')
        add.stop(1, '#fff')
    })


    let box1 = draw.rect(mainContainerBounds.height, mainContainerBounds.width).attr({ fill: gradient1 })

})


//var draw = SVG().addTo('body').size(300, 300)