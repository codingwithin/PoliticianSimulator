var saveGame = localStorage.getItem('polSimSave')
var gameData = {
  dollarsStolen: 0,
  ballpenCost: 0.5,
  ballpenPrice: 0.6,
  ballpenDemand: 1,
  ballpenPenaltyHRef: 1.5,
  ballpenPenaltyLRef: 0.5,
  ballpenPenaltyHRefInc: 0,
  lastTick: Date.now()
}

function update(id, content) {
  document.getElementById(id).innerHTML = content;
}

function initiatePage() {
  ballpenProbabilityPenalty = Math.min(1,((gameData.ballpenPrice-gameData.ballpenPenaltyLRef)/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc-gameData.ballpenPenaltyLRef))**2)
  update("ballpenPenaltyProbability","Penalty probability: "+format(ballpenProbabilityPenalty*100,"",2)+"%")
  ballpenPenalty = (gameData.ballpenPrice - gameData.ballpenPenaltyLRef)*((gameData.ballpenPrice/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc))**(1.5))
  update("ballpenPenalty","Penalty if caught: $" + format(ballpenPenalty,"",2))
}

function incPriceBallpen() {
  gameData.ballpenPrice += 0.01
  update("ballpenPrice", "Ballpen price: $" + format(gameData.ballpenPrice,"",2))
  ballpenProbabilityPenalty = Math.min(1,((gameData.ballpenPrice-gameData.ballpenPenaltyLRef)/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc-gameData.ballpenPenaltyLRef))**2)
  update("ballpenPenaltyProbability","Penalty probability: "+format(ballpenProbabilityPenalty*100,"",2)+"%")
  ballpenPenalty = (gameData.ballpenPrice - gameData.ballpenPenaltyLRef)*((gameData.ballpenPrice/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc))**(1.5))
  update("ballpenPenalty","Penalty if caught: $" + format(ballpenPenalty,"",2))
}

function decPriceBallpen() {
  gameData.ballpenPrice -= 0.01
  update("ballpenPrice", "Ballpen price: $" + format(gameData.ballpenPrice,"",2))
  ballpenProbabilityPenalty = Math.min(1,((gameData.ballpenPrice-gameData.ballpenPenaltyLRef)/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc-gameData.ballpenPenaltyLRef))**2)
  update("ballpenPenaltyProbability","Penalty probability: "+format(ballpenProbabilityPenalty*100,"",2)+"%")
  ballpenPenalty = (gameData.ballpenPrice - gameData.ballpenPenaltyLRef)*((gameData.ballpenPrice/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc))**(1.5))
  update("ballpenPenalty","Penalty if caught: $" + format(ballpenPenalty,"",2))
}

var mainGameLoop = window.setInterval(function() {
  diff = Date.now() - gameData.lastTick;
  update("ballpenPenaltyNotification",'&nbsp;')
  gameData.lastTick = Date.now()
  gameData.dollarsStolen += (gameData.ballpenPrice - gameData.ballpenCost)*diff*gameData.ballpenDemand/1000
  ballpenProbabilityPenalty = Math.min(1,((gameData.ballpenPrice-gameData.ballpenPenaltyLRef)/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc-gameData.ballpenPenaltyLRef))**2)
  ballpenProbability = Math.random()
  if (ballpenProbability < ballpenProbabilityPenalty) {
    gameData.dollarsStolen -= (gameData.ballpenPrice - gameData.ballpenPenaltyLRef)*diff*gameData.ballpenDemand*((gameData.ballpenPrice/(gameData.ballpenPenaltyHRef+gameData.ballpenPenaltyHRefInc))**(1.5))/1000
    update("ballpenPenaltyNotification","Incurred Penalty!")
  } 
  update("dollarsStolen", "$"+format(gameData.dollarsStolen,"",2)+" Stolen")
}, 1000)

var saveGameLoop = window.setInterval(function() {
  localStorage.setItem('polSimSave', JSON.stringify(gameData))
}, 15000)

function format(number, type, dec) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(dec)
	if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}


if (typeof saveGame.dollarsStolen !== "undefined") gameData.dollarsStolen = saveGame.dollarsStolen;
if (typeof saveGame.ballpenCost !== "undefined") gameData.ballpenCost = saveGame.ballpenCost;
if (typeof saveGame.ballpenPrice !== "undefined") gameData.ballpenPrice = saveGame.ballpenPrice;
if (typeof saveGame.ballpenDemand !== "undefined") gameData.ballpenDemand = saveGame.ballpenDemand;
if (typeof saveGame.ballpenPenaltyHRef !== "undefined") gameData.ballpenPenaltyHRef = saveGame.ballpenPenaltyHRef;
if (typeof saveGame.lastTick !== "undefined") gameData.lastTick = saveGame.lastTick;

function incBallpenPenaltyHRef() {
  if (gameData.dollarsStolen > (gameData.ballpenPenaltyHRefInc+0.01)*2500) {
    gameData.dollarsStolen -= (gameData.ballpenPenaltyHRefInc+0.01)*2500
    update("dollarsStolen", "$"+format(gameData.dollarsStolen,"",2)+" Stolen")
    gameData.ballpenPenaltyHRefInc += 0.01
    update("incBallpenPenaltyHRefPrice", "Price: $"+format((gameData.ballpenPenaltyHRefInc+0.01)*2500,"",2))
  }
}