var Word = require("./word.js");
var colors = require("colors");

function Letter(input, word) {
	this.input = input;
	this.word = word.toLowerCase();
	this.letterFound = false;
}

Letter.prototype.letterCheck = function() {
	//checks to see if the letter chosen is found in the game word. 
	var index = this.word.indexOf(this.input);
	if(index === -1) {
		this.letterFound = false;
	}
	else {
		this.letterFound = true;
	}
}

module.exports = Letter;