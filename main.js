// Requires ClozeCard & BasicCard constructor exported from ClozeCard.js/BasicCard.js.
var ClozeCard = require("./ClozeCard.js");
var BasicCard = require("./BasicCard.js");

// Uses inquirer to add new cards from command.
var inquirer = require('inquirer');

// Instructions
var instructions = "Please create your flashcards in Cloze Card format";
var fullTxtEx = "Example full text = 'George Washington was the first President of the United States.'";
var clozeTxtEx = "Example cloze text = 'George Washington'";
var quizEx = "Example question = '... was the first President of the United States.' (Answer is fill in the blank/cloze text)";
var sideNote = "This App is case sensitive so be sure to use correct case when creating flashcards and answering quiz questions.";

console.log(instructions); console.log(fullTxtEx); console.log(clozeTxtEx); console.log(quizEx); console.log(sideNote);

// Captures full text and cloze for cards.
var flashCards = [
	{
		type: 'input',
		name: 'text',
		message: 'What is the full text for the Cloze Card?',
		default: function () {
			return 'Add your full text here.';
		}
	},
	{
		type: 'input',
		name: 'cloze',
		message: 'What is the cloze text for the Cloze Card?',
		default: function () {
			return 'Add part of your full text here.';
		}
	},
	{
		type: 'confirm',
		name: 'askAgain',
		message: 'Want to add another Cloze Card?',
		default: true
	}
];

// Uses recurssion to keep asking for new flashCards.
function ask() {
	inquirer.prompt(flashCards).then(function (answers) {
		var newCloze = new ClozeCard(answers.text, answers.cloze);
		var fullText = newCloze.fullText;
		var cloze = newCloze.cloze;
		var partialText = newCloze.partial();
		
		// Stores new card in Array for later use.
		storeNewCloze(fullText, cloze, partialText);
		if (answers.askAgain) {
			ask();
		} else {
			console.log("Flashcard(s) Created!");
			console.log("Now for the Quiz!");
			quiz();
		}
	});
}

ask();

// Stores new card in Array for questioning later.
var questionArray = [];

function storeNewCloze(fullText, cloze, partialText) {
	questionArray.push({
		fullText: fullText,
		cloze: cloze,
		partialText: partialText
	});
};

// Quiz section using recursion to go through array of cloze cards created earlier.
// Variable used for the recursion, couldn't seem to get For loop to work properly.
var i = 0;
function quiz() {

	if (i < questionArray.length) {
		// Variables for checking Answers.
		var correctAns = questionArray[i].cloze;
		var ans;

		var quizQuestions = [
		{
			type: 'input',
			name: 'text',
			message: questionArray[i].partialText,
		}
		];

		inquirer.prompt(quizQuestions).then(function (answer) {
			ans = answer.text;
			questionCheck(ans, correctAns);
			i++;
			quiz();
		});
	}
};

function questionCheck(answer, correct) {
	if (answer === correct) {
		console.log("Correct!");
	} else {
		console.log("Incorrect!");
	}
};