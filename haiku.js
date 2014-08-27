///////////////////////////////////
//	HaikuGenerator Object Singleton
///////////////////////////////////
/**************************
Constructor
args
	(string) dictionary:
		CVS string containing word/syllable count pairs.
members
	(List of list of string * 7) dict:
		A list of collections of words organized by how many syllables it contains. 
		The index of `dict` is how many syllables the words in the sublist 
		contains.
	(list of int) format:
		A list keeping track of the syllable format of haiku. (5, 7, 5)
**************************/
function HaikuGenerator(dictionary){
	this.dict = [[],[],[],[],[],[],[]];
	this.format = [5,7,5];
	var dictText;

	$.ajax({
		async: false,
		url: dictionary,
		dataType: 'text',
		success: function(data){
					dictText = data.split('\n');
				}
    });
	
	//Load words into dictText
	for(i = 0; i < dictText.length; i++){
		word = dictText[i].split(',');
		if(word == ''){
			continue; //Skip any empty strings
		}
		this.dict[Number(word[1]) - 1].push(word[0]);
	}
	
/**************************
Get a list of words by syllable number.
args:
	(int) syllableCount:
		The number of syllables of the list of words you would like to retrieve.
return:
	A list of words with number of syllables 'syllableCount'.
**************************/
	this.getWordsBySyllables = function(syllableCount){
		return this.dict[syllableCount - 1];
	};
	
/**************************
Generates a line with the given number of syllables.
args:
	(int) syllableCount:
	Amount of syllables the outputted line will have.
return:
	A single haiku line containing the desired syllable count.
**************************/
	this.writeLine = function(syllableCount){
		var remainingSyllables = syllableCount;
		var outputString = '';
		
		while(remainingSyllables > 0){
			//Choose a random int between 1 and however many syllables are remaining, 
			//select a word of that length and then append it to the string
			
			var syllables = Math.ceil(Math.random() * remainingSyllables);
			var wordList = this.getWordsBySyllables(syllables);
			var newWord = wordList[Math.floor(Math.random()*wordList.length)];
			
			outputString += newWord + ' ';			//Append and...
			remainingSyllables -= (syllables);	//Subtract syllabes of added word from 
													//remaining syllable counter
		}
		return outputString;
	};
/**************************
Issues the command to generate a full haiku and returns the string.
args:
	(void)
return:
	String containing the haiku.
**************************/
	this.generate = function(){
		var outputHaiku = '';
		for(i = 0; i < this.format.length; i++){				//Run through format (5,7,5)...
			outputHaiku += ("<div class='haikuLine'>" + 
							Utils.capitalize(this.writeLine(this.format[i])) + 
							"</div>\n");
		}
		return outputHaiku;	
	};
}

//Main
$(document).ready(function(){
	var generator = new HaikuGenerator('/resources/data/Haiku_dictionary.txt');
	
	//Attach Listener for button
	$('#haiku_Button').click(function(){
		$('#haiku_Display').html(generator.generate());
	});
});

