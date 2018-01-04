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
//https://www.npmjs.com/package/download
//https://www.npmjs.com/package/prompt
//https://stackoverflow.com/questions/17837147/user-input-in-node-js
// https://www.npmjs.com/package/prompt
--------------------


TODO
----------------
cli add flags
cli add help flags
cli add change to create folder vs inside of new folder
cli config file "username"

unit testing
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


var sketch = "";

var html = "";

var readme = "";


const [,, ...args] = process.argv

if(args.length === 0)
{
	prompt.start();
	prompt.get(['name'], function (err, result) {
		var projectName = result.name;

		set_paths(projectName);
		set_template(projectName);
		setup_project(projectName);
	});
}else{
	console.log(`Project Name: ${args}`);
	set_paths(args);
	set_template(args);
	setup_project(args);
}

function setup_project(dir)
{
	print(WELCOME_MESSAGE);

	print("set_paths(dir):" + dir); 

	SKETCH_NAME = `${dir}/sketch.js`;
 	HTML_NAME = `${dir}/index.html`;
	README_NAME = `${dir}/README.md`;
	LIBRARY_FOLDER = `${dir}/lib`;
	print(`${SKETCH_NAME}\n${HTML_NAME}\n${README_NAME}\n${LIBRARY_FOLDER}\n`);


	//makedirectory(LIBRARY_FOLDER);
	mkdirp(dir.toString(), function(err) { 
	    // path exists unless there was an error
	    if(err){ return print(err);}
	});
	print("Created Library Folder");

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

function makedirectory(foldername){
	//make directory node.js
	//http://stackoverflow.com/questions/13696148/ddg#13696975
	mkdirp(foldername, function(err) { 
	    // path exists unless there was an error
	    if(err){ return print(err);}
	});

}
function file(filename, text,){
	// Write file with nodejs
	//http://www.daveeddy.com/2013/03/26/synchronous-file-io-in-nodejs/
	//https://stackoverflow.com/questions/2496710/writing-files-in-node-js#2497040
	fs.writeFileSync( filename,  text, function(err){
		if(err){
			return print(err);
		}
	} );
}

function set_paths(dir){
}


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