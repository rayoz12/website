imgDictionary = 
{
	"0":"numbers/0.png",
	"1":"numbers/1.png",
	"2":"numbers/2.png",
	"3":"numbers/3.png",
	"4":"numbers/4.png",
	"5":"numbers/5.png",
	"6":"numbers/6.png",
	"7":"numbers/7.png",
	"8":"numbers/8.png",
	"9":"numbers/9.png",
	".":"numbers/dot.png",
}

//first number must be an int between 0 and 9 inclusive
DivergenceMeter = function (number)
{
	stringNum = number.toString();
	arrayNum = stringNum.split('');
	if (arrayNum[0] < 0.0 || arrayNum[0] > 9)
	{
		throw new RangeError("number out of range");
	}
	this.number = arrayNum;

}

DivergenceMeter.prototype.setNumber = function(number)
{
	stringNum = number.toString();
	arrayNum = stringNum.split('');
	this.number = arrayNum;

}


DivergenceMeter.prototype.render = function()
{
	let numbers = this.number;
	$('*[id*=tube_]:visible').each(function(i, elem) {
		    elem.src = imgDictionary[numbers[i]];
	});
}



function matrixMeter() 
{
	var intervalID = setInterval(function() {
			meter.setNumber(randomMeter());
			meter.render();
	},50);

	setTimeout(function() {
			clearInterval(intervalID);
	}, 3000);

}

function randomMeter()
{
	return (Math.random() * 10).toFixed(6);	
}


function updateMeter()
{
	number = $("#inputNumber").val();
	meter.setNumber(number);
	meter.render();
}

meter = new DivergenceMeter("0.168438");
meter.render();

$("#update").click(updateMeter);
$("#matrix").click(matrixMeter);
