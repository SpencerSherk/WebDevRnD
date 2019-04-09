// app.js - Author : Spencer Sherk


// define Art class
class Art {
	constructor(title, date, str, tags) {
		this.title = title;
		this.date = date;
		this.str = str;
		this.tags = tags.split(',');
		//.sort().reverse()
	}
}


// init constants
const express = require('express');
const app = express();
//const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

// create urlencoded parser middleware
const urlencodedParser = bodyParser.urlencoded({extended: false});

// create default art objects
let art1 = new Art("washington sq arch", "2018-09-29", `
 _______________
 |~|_________|~| 
 |::::\\^o^/::::|
 ---------------
 |..|/      |..|
 ---        ----
 |  |       |  |
 |  |       |  |
 |  |       |  |
.|__|.     .|__|.`, "architecture, public" );

let art2 = new Art("boba", "2018-09-30", `
  ______
  ======
 /      \\ 
|        |-.
|        |  \\ 
|O.o:.o8o|_ /
|.o.8o.O.| 
 \\.o:o.o/`, "snack", "snack, notmybestwork" );

let art3 = new Art("buddy", "2018-10-31", `
       ___
      /  /\\   |---.
      |__|/__ |---,\\
      |  \`   |=    \`
      |      /|
      |  .--' |
      |   |\\  |
      |   | \\ |
     /|   | | |
    \\/    |  \\|
___ /_____\\___|\\____`, "halloween, squad, fashion" );

let arrAscii = [art1, art2, art3];

// sort and revers the list of artwork
arrAscii = arrAscii.sort((a, b) => {
    var textA = a.date.toUpperCase();
    var textB = b.date.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

arrAscii = arrAscii.reverse();

// add default artwork to an array
//let arr = [art1,art2,art3];

// get request bodies using body-parser
app.use( bodyParser.json() );   	// to support json encoding
app.use(bodyParser.urlencoded({		// to support url encoding
	extended: true
}));

// logger middleware
const logger = (req, res, next) => {
  console.log(req.method, req.path, req.query);
  next();
};

app.use(logger);

// include hbs
app.set('view engine', 'hbs');

// serve static files
const publicPath = path.resolve(__dirname, '..', "public");
app.use(express.static(publicPath));

// set routes
app.get('/', function(req, res){

	let filterArr = arrAscii;

	if (req.query.tag === '' || req.query.tag === undefined){
		filterArr = arrAscii;
	} else {
		filterArr = filterArr.filter(art => art.tags.includes(req.query.tag));
	}

	// get rid of whitespace on each tag
	filterArr.forEach(function(art) {
		art.tags.forEach(function(tag, index, array){
			array[index] = tag.trim();
		});
	});

	res.render('main', {      
		message:"artworks",  
		url:"http://localhost:3000/",
		'artworks':filterArr
	}); 
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', urlencodedParser, (req, res) => {
	arrAscii.push(new Art(req.body.title, req.body.dt, req.body.str, req.body.tags))

    res.render('add');
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/faq', function(req, res) {
	res.send('you has q, i has answer');
});

// start server on port 3000
app.listen(3000);
console.log('Started server on port 3000');
