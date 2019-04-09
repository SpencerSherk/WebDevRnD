
// init constants
const express = require('express');
const path = require('path');

const app = express();
//const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile('index.html', {root: path.join(__dirname, 'views')});
});

// start server on port 3000
app.listen(3000);
console.log('Started server on port 3000');
