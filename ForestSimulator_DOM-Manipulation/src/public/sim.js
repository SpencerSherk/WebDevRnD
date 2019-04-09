// sim.js - Spencer Sherk - CSCI 480 - Prof. Joe Versoza

document.addEventListener("DOMContentLoaded", function(event) {

	// inits
	const intro = document.getElementById('intro');
	const sim = document.getElementById('sim');
	const pushtray = document.getElementById('pushtray');
	const input = document.getElementById('inputForest');
	const emojiList = ['💐','🌸','💮','🏵️','🌹','🥀','🌺','🌻','🌼','🌷','🌱','🌲','🌳','🌴','🌵','🌾','🌿','☘️','🍀','🍁','🍂','🍃',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '];
	let emojis = emojiList;

	// output
	let out;
	let forest = ["","","","","","","",""];
	let pinned = [];

	// overlay
	let overlayText = document.createTextNode("OVERLAY");
	let overlay = document.createElement("P");
	overlay.appendChild(overlayText);
	pushtray.appendChild(overlay);
	overlay.classList.add("hidden");

	// creates grid based on emojis
	function newForest() {
		for ( let i = 0; i < 8; i++){
			for ( let j = 0; j < 8; j++){
				if (pinned.includes(i)) {
					break;
				}
				if (j === 0) {
					forest[i] = "";
				}
				let temp = emojis[Math.floor(Math.random() * emojis.length)];
				forest[i] += temp; 
			}
		}
	}

	// configs DOM for new forest
	function generateForest() {
		newForest();
		let IndexP = document.createElement("P");
		let simpInd = simpsonsIndex(forest).toFixed(2);
		let IndexText = document.createTextNode("The current Simpson's Index is " + simpInd);
		IndexP.appendChild(IndexText)
		sim.appendChild(IndexP);

		let container = document.createElement("pre");
		let tempCount = 0;

		forest.forEach(function(element) {
			let p = document.createElement("P");
			p.addEventListener('click', pin);
			let line = document.createTextNode(element);
			p.appendChild(line);
			container.appendChild(p);
			if (pinned.includes(tempCount)){
				p.classList.add("pin");
			}
			tempCount++;
		});

		// gen button
		let generate = document.createElement("button")
		let generateText = document.createTextNode("generate");
		generate.appendChild(generateText);
		container.appendChild(generate);

		// restart button
		let restartButton = document.createElement("button")
		let restartText = document.createTextNode("restart");
		restartButton.appendChild(restartText);
		container.appendChild(restartButton);

		sim.appendChild(container);
		generate.addEventListener('click', newGen);
		restartButton.addEventListener('click', restart);

		// overlay display
		if (simpInd < .80) {
			overlay.textContent = "WARNING: the Simpsons Index is " + simpInd;
			overlay.classList.remove("hidden");
		} else {
			overlay.classList.add("hidden");
		}
	}

	function pin(evt){
		let node = this;
		let index = 0;
		// get index of current child node
		while ( node != null) {
			node = node.previousElementSibling;
			index++;
		}
		// if already pinned, unpin
		if (this.classList.contains("pin")) {
			this.classList.remove("pin");
			pinned.pop(index - 1);
		// if not already pinned, pin
		} else {
			this.classList.add("pin");
			pinned.push(index - 1);
		}
	}

	function restart(evt){
		// remove pins
		pinned = [];
		let pinnedEls = document.getElementsByClassName('pin');
		while (pinnedEls.length)
			pinnedEls[0].classList.remove("pin");
		// reset elements
		intro.classList.remove("hidden");
		sim.classList.add("hidden");
		while (sim.firstChild) {
			sim.removeChild(sim.firstChild);
		}
	}

	function firstGen(evt){
		intro.classList.add("hidden");
		sim.classList.remove("hidden");
		out = [...input.value];
		if (out.length > 0) {
			emojis = out;
			emojis.push(" ", " ", " ");
		} else {
			emojis = emojiList;
		}
		generateForest();
	}

	function newGen(evt){
		while (sim.firstChild) {
		sim.removeChild(sim.firstChild);
		}
		generateForest();
	}

	// for 1st generation event
	const b = document.querySelector('button');
	b.addEventListener('click', firstGen);

	// joe's code
	const simpsonsIndex = forest =>
	1 - Object.entries(
	[...forest.join("")].reduce(
		(counts, emoji) => ({...counts, [emoji]: (counts[emoji] || 0) + 1}),
		{}
	)
	).reduce(([top, bottom], [species, count]) => [top + (count * (count - 1)), bottom + count], [0, 0])
	.reduce((sumLilN,bigN) => sumLilN / (bigN * (bigN - 1)))
});
