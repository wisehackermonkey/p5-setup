#!/usr/bin/env node

/*
p5.js setup application
to insitalize a project without messing 
with terminal for each project
AKA make it easy to setup & run  p5.js  projects
from the terminal

by wisemonkey
180103
--------------------
LINKs

// https://stackoverflow.com/questions/38182501/how-to-get-current-datetime-with-format-y-m-d-hms-using-node-datetime-library#38182551
// https://www.npmjs.com/package/download
// https://www.npmjs.com/package/prompt
// https://stackoverflow.com/questions/17837147/user-input-in-node-js
// https://www.npmjs.com/package/prompt
--------------------


TODO
----------------
cli add flags
cli add help flags
180103
xcli add change to create folder vs inside of new folder
cli config file "username"
unit testing
http-server
*/


require("wise-helper");

var fs = require('fs');
var open = require('opn');
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var download = require('download');
var dateTime = require('node-datetime');


var dt = dateTime.create();
var date = dt.format('Ymd');

var project_dirname = "";

//the username that shows up in comments of sketch.js,
// and part of the readme.md 
var AUTHOR = 'wisemonkey';

//name of the template files
var SKETCH_NAME = 'sketch.js';
var HTML_NAME = 'index.html';
var README_NAME = 'README.md';

var LIBRARY_FOLDER = 'lib';
var VERSION_P5JS = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/p5.js';
var WELCOME_MESSAGE = `P5.js Project Generator
Please enter the name of your project to be generated`;


//variables for holding the code templates
//that will be writen to files EI sketch.js etc
var sketch = "";
var html = "";
var readme = "";

//get the user input from the console
//ex: p5js AWESOME_PROJECT
//console_input now equal "AWESOME_PROJECT"
const [,, ...console_input] = process.argv

//Ask the user for a project name if not provided
if(console_input.length === 0)
{
	prompt.start();
	//
	prompt.get(['name'], function (err, project) {
		setup_project(project.name);
	});
}else{
	setup_project(console_input);
}

//the main part of the program
//it takes in the project name
//and generates the correct project path given the project name
//creates a project directory
//downloads p5.js library and stores in the folder <PROJECTNAME>/lib
//creates files, for sketch.js, readme.md, index.html, and populates
//them with default examples to get started.
//finaly it opens chrome window with the project's index.html
//and opens the sketch.js with the Default text editor,
//
//NOTE i set my default text editor to open as SUBLIME text 3
//
function setup_project(projectName)
{
	var dir = projectName;


	print(WELCOME_MESSAGE);
	console.log(`Project Name: ${console_input}`);


	set_paths(projectName);
	set_template(projectName);

	print("Created Library Folder");
	makedirectory(dir);

	//downloads p5.js library and stores in the folder <PROJECTNAME>/lib
	download(VERSION_P5JS, LIBRARY_FOLDER).then(() => {
	    console.log('Download of P5.js library [DONE]');
	});

	file( README_NAME,readme);//'README.md'
	file( HTML_NAME,html);// html file
	file( SKETCH_NAME,sketch);// p5.js code

	//open a browser pointing at the p5.js sketch code
	open(HTML_NAME);
	open(SKETCH_NAME);
}


//make folders with subfolders
//just like 
//> mkdir -p 'path/to/folder' creates folders
//'path', 'to', and 'folder'
function makedirectory(foldername){
	//make directory node.js
	//http://stackoverflow.com/questions/13696148/ddg#13696975
	mkdirp(foldername.toString(), function(err) { 
	    // path exists unless there was an error
	    if(err){ return print(err);}
	});

}

//wrapper function to write a file to 
//the project directory with the contents of 'text'
//	Notes
//		Write file with nodejs
//		http://www.daveeddy.com/2013/03/26/synchronous-file-io-in-nodejs/
//		https://stackoverflow.com/questions/2496710/writing-files-in-node-js#2497040
	
function file(filename, text){
	fs.writeFileSync( filename,  text, function(err){
		if(err){
			return print(err);
		}
	} );
}

//sets the location path's of the 
//files im creating as part of the project
//EX <projectName>/sketch.js
function set_paths(dir){
	
	//print("set_paths(dir):" + dir);
	SKETCH_NAME = `${dir}/${SKETCH_NAME}`;
	HTML_NAME = `${dir}/${HTML_NAME}`;
	README_NAME = `${dir}/${README_NAME}`;
	LIBRARY_FOLDER = `${dir}/${LIBRARY_FOLDER}`;
	
}

//creates default files for the p5.js project
//sketch =  sketch.js is the first one, its just a default example code
//			with some defaults i like
//html   = index.html creates a html file that points to the downloaded 
//			p5.js library within in the folder <PROJECTNAME>/lib
//readme =  creates a default readme with the project name and date with some
//			small formatting using markdown
function set_template(projectName){
sketch = `/*
Name: ${projectName}
Author: ${AUTHOR}
Date: ${date}
*/
function setup() {
	createCanvas(600,400);
	background(50);
}

function draw() {
}`;


html = `<html>
  <head>
    <script src="lib/p5.js"></script>
    <script src=sketch.js></script>
    <title>${projectName}</title>
  </head>
  <body>
  </body>
</html>
`;

readme = `# ${projectName}
### Author: ${AUTHOR}
Date: ${date}
`;
}