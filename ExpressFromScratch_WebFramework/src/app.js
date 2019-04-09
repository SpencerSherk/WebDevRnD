// app.js


const webby = require('./webby.js');
const net = require('net');
const fs = require('fs');
const path = require('path');
const app = new webby.App();
const port = 3000;

// contains all animal images

const imgArr = [ `<img class="resize" src="/img/animal1.jpg" > ` ,  `<img class="resize" src="/img/animal2.jpg" > `,
 `<img class="resize" src="/img/animal3.jpg" > `,  `<img class="resize" src="/img/animal4.jpg" > ` 
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.ceil(max));
}

// randomize image amount

let rando = getRandomInt(4) + 1; 
let imgStr = "";

rando = getRandomInt(4); 
for ( i = 0; i < rando + 1; i++) {
	imgStr += imgArr[i];
}


app.use(webby.static(path.join(__dirname, '..', 'public')));

// routes

app.get('/', function(req, res) {
    res.status = "200";
    res.status = "text/html";
    res.send(rootHtml);
});


app.get('/gallery', function(req, res) {
    res.status = "200";
    res.status = "text/html";
    rando = getRandomInt(4) + 1;
    res.send(galleryHtml);
});

app.get('/pics', function(req, res) {
    res.status = "200";
    res.status = "text/html";
    res.send(redirectHtml);
});

// html literals

const redirectHtml = `<head> <meta http-equiv="refresh" content="0; /gallery" /> </head>`;

const rootHtml = `<head> <link rel="stylesheet" type="text/css" href="/css/styles.css" />
 <h1>Have you ever heard</h1><h2><a href="/gallery">of axolotls?</a></h2></head><body> `;

let galleryHtml = `<head><h1>Axolotl Gallery</h1> <link rel="stylesheet" type="text/css" href="/css/styles.css" /> </head> <body> `
+ imgStr +
 `<br> <br> here are ` + (rando + 1) + ` axolotls!
</body>`;

// app.listen - serving at localhost:3000

app.listen(port, () => console.log(` app listening on port ${port}!`));