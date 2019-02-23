const fs = require('fs');


if (process.argv.length < 4) {
    console.error("Please supply 2 args, one for input and one for output in that order");
    process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const html = fs.readFileSync(inputFile, {encoding: "utf8"});
const htmlLines = html.split("\n");

//a marker is this text: <p style="margin-top:15.95pt; margin-bottom:15.95pt; page-break-inside:avoid; page-break-after:avoid; widows:0; orphans:0; font-size:12pt">
//in a question this occurs 2 times, the 3rd time signifies the start of the next question
const marker = '<p style="margin-top:15.95pt; margin-bottom:15.95pt; page-break-inside:avoid; page-break-after:avoid; widows:0; orphans:0; font-size:12pt">'
let markerCount = -1; //this skips all text before the first marker
let questionsCounter = 0;
let questionsRaw = [];
questionsRaw[0] = {text: [], help: []};
for (let i=0; i< htmlLines.length; i++) {
    let line = htmlLines[i].trim();

    if (line === marker) {
        //console.log(`Found marker on line: ${i+1}`);
        //if we get to the 3rd marker we have to insert a new question
        markerCount++;
        if (markerCount >= 2) {
            questionsCounter++;
            questionsRaw[questionsCounter] = {text: [], help: []};
            markerCount = 0;
        }
    }
    
    //we are in the question and answer portion
    if (markerCount == 0) {
        questionsRaw[questionsCounter].text.push(line); 
    }
    //we are in the help text portion
    else if (markerCount == 1) {
        questionsRaw[questionsCounter].help.push(line);
    }


        
}
const questions = [];
//clean the text here, and extract it.
for (let i = 0; i < questionsRaw.length; i++) {
    //get the correct answer first before we remove the html
    questions[i] = {question: "", type: "multipleChoice", answer:"", help: "", difficulty: ""};

    for (let j = 0; j < questionsRaw[i].text.length;j++) {
        if (questionsRaw[i].text[j].includes("font-weight:bold; text-decoration:underline")) {
            //questionsRaw[i].text[j] = "|~|" + questionsRaw[i].text[j];
            questions[i].answer = questionsRaw[i].text[j].replace(/<[^>]+>/g, '');
            break;
        }
    }

    //join all the lines
    questionsRaw[i].text = questionsRaw[i].text.join("\n");
    questionsRaw[i].help = questionsRaw[i].help.join("\n");

    //get the correct answer

    //clean html and linebreaks
    //                                                  remove HTML             remove html entity codes   remove extra whitespace
    questionsRaw[i].text = questionsRaw[i].text.replace(/<[^>]+>/g, '').replace(/\n&#.*;\n/g, '').replace(/\s{3}/g, '').replace(/\n{2}/g, '\n').replace(/(\w)\n(\w^(\.))/g, '$1$2').trim();
    questionsRaw[i].help = questionsRaw[i].help.replace(/<[^>]+>/g, '').replace(/\n&#.*;\n/g, '').replace(/\s{3}/g, '').replace(/\n{2}/g, '\n').replace(/(\w)\n(\w^(\.))/g, '$1$2').trim();

    //questionsRaw[i].text = questionsRaw[i].text.replace(/<[^>]+>/g, '').replace(/\n&#.*;\n/g, '').replace(/\s{3}/g, '').replace(/(?:[A-z])\n(?:[A-z])/g, '').trim();
    //const textSplit = questionsRaw[i].text.split('\n');
    const helpSplit = questionsRaw[i].help.split('\n');

    questions[i].question = questionsRaw[i].text;
    questions[i].difficulty = helpSplit[helpSplit.length - 1];
    questions[i].help = helpSplit.filter(item => !item.includes(":")).join("");

    

    if (questions[i].answer === "TRUE" || questions[i].answer === "FALSE") {
        questions[i].type = "boolean";
        //remove answer at the end of the text
        const lastNewline = questions[i].question.lastIndexOf("\n");
        questions[i].question = questions[i].question.substr(0, lastNewline);
    }
    else if (questions[i].question.includes("____")) {
        questions[i].type = "fill-in";
        //remove answer at the end of the text
        const lastNewline = questions[i].question.lastIndexOf("\n");
        questions[i].question = questions[i].question.substr(0, lastNewline);
    }
    else if (questions[i].answer === "") {
        questions[i].type = "shortAnswer";
    }

    questions[i].question = questions[i].question.replace(/\n(?![A-E])/g, ''); //remove any extra linebreaks-
}

//construct the format here

//console.log(questions);

fs.writeFileSync(outputFile, JSON.stringify(questions));

//console.log(html.substring(0, 100));

//const $ = cheerio.load(html);

//const questionsRaw = html.split('<p style="margin-top:15.95pt; margin-bottom:15.95pt; page-break-inside:avoid; page-break-after:avoid; widows:0; orphans:0; font-size:12pt">');

//console.log(questionsRaw);

//const elems = $('p[style*="margin-top:15.95pt; margin-bottom:15.95pt; page-break-inside:avoid; page-break-after:avoid; widows:0; orphans:0; font-size:12pt"]');

//console.log(elems);

