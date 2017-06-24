var view={
  displayMessage: function functionName(msg) {
    var messageArea=document.getElementById('messageArea');
    messageArea.innerHTML=msg;
  },
  displayHit: function(location){
    var cell=document.getElementById(location);
    cell.setAttribute("class","hit");
  },
  displayMiss: function(location){
    var cell=document.getElementById(location);
    cell.setAttribute('class', this.this_is_miss);
  },
  this_is_miss: "miss",
};

var model={
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    { locations : [0, 0, 0], hits: ["", "", ""] },
    { locations : [0, 0, 0], hits: ["", "", ""] },
    { locations : [0, 0, 0], hits: ["", "", ""] }
  ],
  fire: function(guess){
    for (var i=0; i<this.numShips; i++){
      var ship=this.ships[i];
      var index=ship.locations.indexOf(guess);
      if (index>=0){
        ship.hits[index]="hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)){
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
      view.displayMiss(guess);
      view.displayMessage("You missed.");
    }
    return false;
  },
  isSunk: function(ship){
    for (var i=0; i<this.shipLength; i++){
      if (ship.hits[i]!="hit"){
        return false;
      }
    return true;
    }
   },
  generateShipLocation: function(){
    var locations;
    for(var i=0; i<this.numShips; i++){
      do{
        locations=this.generateShip();
        // console.log(locations, "line 59");
      }while(this.collision(locations))
      // console.log(this.ships[i].locations, "line 61");
      this.ships[i].locations=locations;
      // console.log(this.ships[i].locations, "line 63");
    }
  },
  generateShip: function(){
      var direction=Math.floor(Math.random()*2);
      var row, col;
      if (direction===1){
          row=Math.floor(Math.random()*this.boardSize);
          col=Math.floor(Math.random()*(this.boardSize-this.shipLength));
      }else{
          row=Math.floor(Math.random()*(this.boardSize-this.shipLength));
          col=Math.floor(Math.random()*(this.boardSize));
      }
      var newShipLocations=[];
      for(var i=0; i< this.shipLength; i++ ){
          if (direction===1){
              newShipLocations.push(row+""+(col+i));
          }else{
              newShipLocations.push((row+i)+""+col);
          }
      }
      return newShipLocations;
  },
  collision: function(locations){
      for (var i=0; i<this.numShips; i++){
          var ship=model.ships[i];
          for (var j=0; j<locations.length; j++){
              if (ship.locations.indexOf(locations[j]) >=0){
                  return true;
              }
          }
      }
      return false;
  }
};

var controller={
  guesses: 0,
  processGuess : function (guess){
    var location=this.parseGuess(guess);
    if (location){
      this.guesses++;
      var hit=model.fire(location);
      if (hit && model.shipsSunk===model.numShips){
        view.displayMessage("You sank all battleships, in " + this.guesses + "guesses");
      }
    }
  },
  parseGuess: function(guess){
    var alphabet=["A", "B", "C", "D", "E", "F", "G"];
    if (guess===null || guess.length!=2){
      alert("Oops. pleace enter a letter and a number on the board.");
    }else{
      firstChar=guess.charAt(0);
      var row=alphabet.indexOf(firstChar);
      var column=guess.charAt(1);
      if (isNaN(row) || isNaN(column)){
        alert("Oops, that isn't on the board.");
      }else if (row < 0 || row >= model.boardSize || column < 0 || column>= model.boardSize){
        alert("Oops, that's off the board!");
      }else{
        return row+column;
      }
    }
    return null;
  },
}

function init() {
  var firebutton=document.getElementById("fireButton");
  fireButton.onclick=handleFireButton;
  model.generateShipLocation();
  // for (var i=0; i<3; i++){
  //     console.log(model.ships[i].locations, "line 136");
  // }
}

function handleFireButton(){
  var guessInput=document.getElementById("guessInput");
  var guess=guessInput.value;
  console.log(guess);
  controller.processGuess(guess);
  guessInput.value="";
}

window.onload=init;
