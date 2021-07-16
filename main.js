var saveGame = localStorage.getItem('polSimSave')
var gameData = {
  dollarsStolen: 0,
  ballpenCost: 0.5,
  ballpenPrice: 1,
  ballpenDemand: 1,
  ballpenPenaltyRef: 1.5,
  lastTick: Date.now()
}

function update(id, content) {
  document.getElementById(id).innerHTML = content;
}


function incPriceBallpen() {
  gameData.ballpenPrice += 0.01
  update("ballpenPrice", "Ballpen price: $" + format(gameData.ballpenPrice,"",2))
  ballpenProbabilityPenalty = Math.min(1,Math.exp(gameData.ballpenPrice)/Math.exp(gameData.ballpenPenaltyRef))
  update("ballpenPenaltyProbability","Penalty probability: "+format(ballpenProbabilityPenalty*100,"",2)+"%")
  ballpenPenalty = (gameData.ballpenPrice - gameData.ballpenCost)*((gameData.ballpenPrice/gameData.ballpenPenaltyRef)**(1.5))
  update("ballpenPenalty","Penalty if caught: $" + format(ballpenPenalty,"",2))
}

function decPriceBallpen() {
  gameData.ballpenPrice -= 0.01
  update("ballpenPrice", "Ballpen price: $" + format(gameData.ballpenPrice,"",2))
  ballpenProbabilityPenalty = Math.min(1,Math.exp(gameData.ballpenPrice)/Math.exp(gameData.ballpenPenaltyRef))
  update("ballpenPenaltyProbability","Penalty probability: "+format(ballpenProbabilityPenalty*100,"",2)+"%")
  ballpenPenalty = (gameData.ballpenPrice - gameData.ballpenCost)*((gameData.ballpenPrice/gameData.ballpenPenaltyRef)**(1.5))
  update("ballpenPenalty","Penalty if caught: $" + format(ballpenPenalty,"",2))
}

var mainGameLoop = window.setInterval(function() {
  diff = Date.now() - gameData.lastTick;
  update("ballpenPenaltyNotification","")
  gameData.lastTick = Date.now()
  gameData.dollarsStolen += (gameData.ballpenPrice - gameData.ballpenCost)*diff*gameData.ballpenDemand/1000
  ballpenProbabilityPenalty = Math.min(1,Math.exp(gameData.ballpenPrice)/Math.exp(gameData.ballpenPenaltyRef))
  ballpenProbability = Math.random()
  if (ballpenProbability < ballpenProbabilityPenalty) {
    gameData.dollarsStolen -= (gameData.ballpenPrice - gameData.ballpenCost)*diff*gameData.ballpenDemand*((gameData.ballpenPrice/gameData.ballpenPenaltyRef)**(1.5))/1000
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


if (typeof saveGame.gold !== "undefined") gameData.gold = saveGame.gold;
if (typeof saveGame.goldPerClick !== "undefined") gameData.goldPerClick = saveGame.goldPerClick;
if (typeof saveGame.goldPerClickCost !== "undefined") gameData.goldPerClickCost = saveGame.goldPerClickCost;
if (typeof saveGame.lastTick !== "undefined") gameData.lastTick = saveGame.lastTick;

