# WebDev_RnD


This is a collection of personal RnD projects I will continue to add to as I experiment with more Fullstack webdev.










ExpressFromScratch_WebFramework

	a reusable web framework that you can use to write simple web applications, implementing many of the features
	present in Express. (includes demo site which loads random images of axolotls) 

	modules used: net, fs   -  no http or express

	showcases:
	- Connection/Route handling
	- demonstrates low level understanding of web frameworks, especially Express



ForestSimulator_DOM-Manipulation

	inspired by this twitter bot:
	https://twitter.com/tiny_forests

	Creates emoji forests by using pure clientside javascript where you can curate some parts of the forest, but also allow randomness to generate other parts. The interface will computes the biodiversity of your forest in realtime.

	showcases:
	- manipulating the DOM
	- setting DOM element attributes
	- handling events with addEventListener



SmashingText_AJAX

	app that saves random strings created by smashing the keyboard with your hands.

	showcases:
	- XMLHttpRequest
    - sending back json from Express
    - mongoDB 



ASCII_Sketchbook

    Allows user to input and display ascii art. Allows filter by tag, name, and date

    2 pages:
    	home - /: displays all of the ascii pieces submitted on the site; can be filtered by tag.
		add - /add: a page that allows a user to submit a new piece

	showcases: 
	- serving static files
	- middleware
	- handling forms, both GET and POST
	- sessions

	TODO:
		clicking on tag to filter by query string
		force redirect to home page after creation


