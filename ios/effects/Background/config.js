'use strict';

const makeup = require('./makeup.js');

const saveImg = async (img) => {
    const image = await fetch(img).then(r => r.arrayBuffer())
    await makeup.writeFile("background.png", image)
}

Object.assign(globalThis, {
    m: makeup.m,
    saveImg: saveImg
});
/* Feel free to add your custom code below */
