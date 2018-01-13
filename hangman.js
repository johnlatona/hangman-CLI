var Word = require("./word.js");
var Letter = require("./letter.js");
var inquirer = require("inquirer");
var colors = require("colors");

inquirer.prompt([
{
	type: "input",
	message: colors.white("\nWelcome to Game of Thrones Hangman!") + "\n\n" + colors.white("Directions:") + "\n\nYou'll be given a word to guess. Each word relates to the show Game of Thrones. You must guess the word correctly by filling in the blanks with letters found in the word. You'll have 10 incorrect guesses. Once you've used all your incorrect guesses, your hangman is hanged and you lose the game!\n\n" + colors.white("Ready to play? (Please type ") + "'yes'" + colors.white(" or ") + "'no'" + colors.white(")"),
	name: "confirmPlay",
	validate: function(input) {
		//validates that the user can only input either "yes" or "no"
		var inputLower = input.toLowerCase();
		if((inputLower !== "no") && (inputLower !== "yes")) {
			return false;
		}
		else {
			return true;	
		}
	}
}
]).then(function(confirmResponse){
	var responseLower = confirmResponse.confirmPlay.toLowerCase();
	if(responseLower === "no") {
		//if the user entered no, the game exits
		console.log("\nOk, come back when you're ready!\n".bold);
	}
	else {
		//if the user entered yes, it runs the game() function.
		var gameWord = new Word;
		game();
		function game() {
			var guessedLetters = [];
			var correctGuesses = 0;
			var guessesRemaining = 10;
			gameWord.placeholder = [];
			var hintGiven = false;

			console.log("\nGreat! Here is your word:\n".bold);

			console.log(colors.white.bold("\nYou have ") + colors.red.bold(guessesRemaining) + colors.white.bold(" incorrect guesses remaining!\n"));
			//selects the word
			gameWord.chooseWord();
			//displays the placeholder word
			gameWord.display();
			chooseALetter();

			function chooseALetter() {
				if(guessesRemaining === 0) {
					//if the user has no more guesses, the game will stop and they will be prompted whether or not they want to play again.
					console.log("\nOH NO! Your hangman has been hanged!\n".bold.red);
					console.log("\nThe word was: ".bold.red + colors.white.bold(gameWord.word));
					clearTimeout(timeout);
					var timeout = setTimeout(function() {
						inquirer.prompt([
						{
							type: "input",
							message: colors.white("Would you like to play again? (Please type ") + "'yes'" + colors.white(" or ") + "'no'" + colors.white(")"),
							name: "confirmRePlay",
							validate: function(input) {
								var inputLower = input.toLowerCase();
								if((inputLower !== "no") && (inputLower !== "yes")) {
									return false;
								}
								else {
									return true;	
								}
							}
						}
						]).then(function(replayResponse) {
							var replay = replayResponse.confirmRePlay;

							if(replay === "yes") {
								//if the user entered yes, the game restarts
								game();
							}
							else {
								console.log("\nOk, see you next time!\n".bold);
							}
						});
					}, 500);
				}
				else{
					if(guessesRemaining === 5 && hintGiven === false) {
						//if the user has 5 guesses remaining and a hint has not already been given, they will be given a hint, which is found in the word.wordChoices array at the category property.
						console.log("\nUh oh, seems your getting low on guesses! Here's a hint to help you out: \n\n".bold + colors.white.bold("Category: " + gameWord.wordChoices[gameWord.index].category) + "\n");
						hintGiven = true;
					}
					clearTimeout(timeout);
					//delays the prompt to ensure the prompt comes after the console.log above
					var timeout = setTimeout(function() {
						inquirer.prompt([
						{
							type: "input",
							message: "Please guess a letter.",
							name: "letterGuess",
							validate: function(input) {
								var allowedInputs = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
								var inputLower = input.toLowerCase();
								if(allowedInputs.indexOf(inputLower) === -1) {
									return false;
								}
								return true;
							}
						}
						]).then(function(letterChoice){
							var guess = letterChoice.letterGuess;
							if(guessedLetters.indexOf(guess) !== -1) {
								//checks to see if the user already guessed the letter. Prevents the same letter from being pushed to the guessedLetters array twice.
								clearTimeout(timeout);
								var timeout = setTimeout(function() {
									chooseALetter();
								}, 200);
								return console.log("\nYou already guessed that letter!\n".bold);
							}
							else{
								//pushes the users guess to the guessedLetters array.
								guessedLetters.push(guess);
								var letter = new Letter(guess, gameWord.word);
								letter.letterCheck();

								if(letter.letterFound === false) {
									//if the letter guessed is not found in the word, guessesRemaining decrements by one. chooseALetter runs again.
									guessesRemaining--;

									console.log("\nSorry, that letter isn't found in the word! Guess again.".bold.red);
									console.log(colors.white.bold("\nYou have ") + colors.red.bold(guessesRemaining) + colors.white.bold(" incorrect guesses remaining!\n"));

									chooseALetter();
									console.log("\n\n" + colors.white.bold(gameWord.placeholder.join("") + "\n"));
								}
								else {
									console.log("\nCorrect!\n".bold.green);
									for(var i = 0; i < letter.word.length; i++) {
										//loops over the word and if the guess is found in the word, that letter is added in the placeholder at the same index.
										if(letter.word[i] === guess) {
												gameWord.placeholder.splice(i, 1, " " + guess + " ");
												correctGuesses++;
										}
									}
									console.log("\n" + colors.white.bold(gameWord.placeholder.join("") + "\n"));
									if(correctGuesses === gameWord.word.length) {
										console.log("\nYOU GUESSED THE WORD! Great job!\n".bold.white);
										inquirer.prompt([
										{
											type: "input",
											message: colors.white("Would you like to play again? (Please type ") + "'yes'" + colors.white(" or ") + "'no'" + colors.white(")"),
											name: "confirmRePlay",
											validate: function(input) {
												var inputLower = input.toLowerCase();
												if((inputLower !== "no") && (inputLower !== "yes")) {
													return false;
												}
												else {
													return true;	
												}
											}
										}
										]).then(function(replayResponse) {
											var replay = replayResponse.confirmRePlay;

											if(replay === "yes") {
												game();
											}
											else {
												console.log("\nOk, see you next time!\n".bold);
											}
										})
									}
									else {
										chooseALetter();
									}
								}
							}
						});
					}, 200);
				}
			}			
		}
	}
});