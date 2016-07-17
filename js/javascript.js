/*function person(fname,lname,age,eyecolor)
{
   this.firstname=fname;
   this.lastname=lname;
   this.age=age;
   this.eyecolor=eyecolor;
   
   this.Method = function() {};
}*/

function Grid(size) {
  this.size = size;
  this.mines = [];
  this.numbered = {};
  
  // method that draws the grid
  this.drawGrid = function() {
    var gameBoard = document.querySelector("#container");
    gameBoard.innerHTML = '';
    for (var i = 0; i < this.size; i++) {
      gameBoard.innerHTML += '<div class="clearfix">';
      for (var j = 0; j < this.size; j++) {
        gameBoard.innerHTML += '<div class="cell" id="c' + i + '_' + j + '"></div>';
      }
      gameBoard.innerHTML += '</div>';
    }
    for (var i=0; i < this.size; i++) { 
      $('#c0_'+i).addClass("edge");
      $('#c'+(this.size-1)+'_'+i).addClass("edge");
      $('#c'+i+'_0').addClass("edge");
      $('#c'+i+'_'+(this.size-1)).addClass("edge");
    }
  };
  
  // method that generates random mines
  this.generateMines = function(number, size) {
    for(var i=0; i < number; i++){
      var row = 1 + Math.floor(Math.random() * size);
      var col = 1 + Math.floor(Math.random() * size);
      var mine = "#c"+row+"_"+col;
      
      if (this.mines.includes(mine)) {
        console.log(mine + " already exists");
        i--;
      } else {
        this.mines.push(mine);
        $(mine).text('*');
      }
    }
    console.log(this.mines);
    // method that generates the numbers
    this.generateNumbers = function(size) {
      for(var i=0; i < number; i++) {
        var c = this.mines[i].slice(2).split("_");
        var row = parseInt(c[0]);
        var col = parseInt(c[1]);

        for(var x=-1; x <= 1; x++){
          for(var y=-1; y <= 1; y++){
            var r1 = row + x;
            var c1 = col + y;
            if (!this.mines.includes("#c"+r1+"_"+c1) && r1 > 0 && r1 < size && c1 > 0 && c1 < size){
              if (!this.numbered["#c"+r1+"_"+c1]) {
                this.numbered["#c"+r1+"_"+c1] = 1;
              } else {
                this.numbered["#c"+r1+"_"+c1] += 1;
              }
              $("#c"+r1+"_"+c1).text(this.numbered["#c"+r1+"_"+c1]);
            }
          }
        }
      }
      console.log(this.numbered);
    }
    
  };
}

function restart() {
  alert("clicked");
}

$(document).ready(function(){
  var grid = new Grid(11);
  grid.drawGrid();
  grid.generateMines(10, 9);
  grid.generateNumbers(10);
  $('#play').click(function(){
    restart();
  });
});
