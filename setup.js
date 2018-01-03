/*
p5.js setup application
to insitalize a project without messing 
with terminal for each project
AKA make it easy to setup & run  p5.js  projects
from the terminal

by wisemonkey
180103

NOTES
https://www.npmjs.com/package/p5-manager
*/
// https://stackoverflow.com/questions/38182501/how-to-get-current-datetime-with-format-y-m-d-hms-using-node-datetime-library#38182551
//https://www.npmjs.com/package/download
//https://www.npmjs.com/package/prompt

//https://stackoverflow.com/questions/17837147/user-input-in-node-js
// https://www.npmjs.com/package/prompt
require("wise-helper");
var open = require('opn');
var fs = require('fs');
var download = require('download');
var dateTime = require('node-datetime');
var mkdirp = require('mkdirp');
var prompt = require('prompt');


var dt = dateTime.create();
var date = dt.format('Ymd');

var VERSION_P5JS = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/p5.js';
var LIBRARY_FOLDER = 'lib';
var sketch_name = 'sketch.js';
var html_name = 'index.html';








prompt.start();
prompt.get(['name'], function (err, result) {

	var name = result.name;


var sketch = `/*
Name: ${name}
Author: Wisemonkey
Date: ${date}
*/
function setup() {
	createCanvas(600,400);
	background(50);
}

function draw() {
}`;

var html = `<html>
  <head>
    <script src="lib/p5.js"></script>
    <script src=sketch.js></script>
    <title>${name}</title>
  </head>
  <body>
  </body>
</html>
`;


	//make directory node.js
	//http://stackoverflow.com/questions/13696148/ddg#13696975
	mkdirp(LIBRARY_FOLDER, function(err) { 
	    // path exists unless there was an error
	    if(err){ return print(err);}
	});

	download(VERSION_P5JS, LIBRARY_FOLDER).then(() => {
	    console.log('done!');
	});

	// Write file with nodejs
	//http://www.daveeddy.com/2013/03/26/synchronous-file-io-in-nodejs/
	//https://stackoverflow.com/questions/2496710/writing-files-in-node-js#2497040
	fs.writeFileSync(html_name, html, function(err){
		if(err){
			return print(err);
		}
	} );

	fs.writeFileSync(sketch_name, sketch, function(err){
		if(err){
			return print(err);
		}
	} );

	open('sketch.js');
	open('index.html');
});
