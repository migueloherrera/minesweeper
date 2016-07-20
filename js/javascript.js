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
        gameBoard.innerHTML += '<div class="cell empty" id="c' + i + '_' + j + '"></div>';
      }
      gameBoard.innerHTML += '</div>';
    }
    for (var i=0; i < this.size; i++) { 
      $('#c0_'+i).addClass("edge").removeClass("cell empty");
      $('#c'+(this.size-1)+'_'+i).addClass("edge").removeClass("cell empty");
      $('#c'+i+'_0').addClass("edge").removeClass("cell empty");
      $('#c'+i+'_'+(this.size-1)).addClass("edge").removeClass("cell empty");
    }
  };
  
  // method that generates random mines
  this.generateMines = function(number, size) {
    for(var i=0; i < number; i++){
      var row = 1 + Math.floor(Math.random() * size);
      var col = 1 + Math.floor(Math.random() * size);
      var mine = "#c"+row+"_"+col;
      
      if (this.mines.includes(mine)) {
        i--;
      } else {
        this.mines.push(mine);
        $(mine).removeClass("empty");
      }
    }
  };
    
  // method that generates the numbers
  this.generateNumbers = function(number, size) {
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
            $("#c"+r1+"_"+c1).removeClass("empty");
          }
        }
      }
    }
  };
    
  // method that uncovers empty cells
  this.uncover = function(c, size) {
    
    if (this.mines.includes(c)) { // there is a mine
      $(c).css("background","red");
      for (var i = 0; i < this.mines.length; i++){
        $(this.mines[i]).html('<i class="fa fa-bomb" aria-hidden="true"></i>');
      }
      $('#play').html('<i class="fa fa-frown-o" aria-hidden="true"></i>');
      alert("You lost!");
      location.reload();
    } else if (this.numbered[c]) { // there is a number
      $(c).text(this.numbered[c]);
      $(c).addClass("uncovered");
    } else { // it is an empty cell
      var queue = [c];
      var numbers = this.numbered;
      while (queue.length > 0) {
        var last = queue.pop();
        var cell = last.slice(2).split("_");
        $(last).addClass("uncovered");
        var arr = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        var row = parseInt(cell[0]);
        var col = parseInt(cell[1]);
        arr.forEach(function(e){
          var cellToSearch = "#c"+(row+e[0])+"_"+(col+e[1]);
          if (row+e[0] > 0 && row+e[0] < size && col+e[1] > 0 && col+e[1] < size) {
            // conditions to add the current cell to the queue: to be empty, to be covered and not to be in the queue
            if ($(cellToSearch).hasClass("empty") && !$(cellToSearch).hasClass("uncovered") && !(queue.includes(cellToSearch))) {
              queue.push(cellToSearch);
            } 
            $(cellToSearch).addClass("uncovered");
            if (numbers[cellToSearch]) {
              $(cellToSearch).text(numbers[cellToSearch]);
            }
          }
        });
      } // end while
    } // end if
  } // end function uncover

}

function check(arr) {
  var x = document.getElementsByClassName("flag");
  var f = [];
  for (var i = 0; i < x.length; i++) {
    f.push("#" + x[i].id);
  }
  if (f.sort().toString() == arr) {
    alert("You have won!");
    location.reload();
  }
}

function startTimer() {
  var x = parseInt($("#timer").text()) + 1;
  $('#timer').text(x);
  setTimeout(function() {startTimer()}, 1000);
}

// main
$(document).ready(function(){
  var gridsize = 9;
  var numberofmines = 10;
  var grid = new Grid(gridsize + 2);
  var counter = true;
  grid.drawGrid();
  grid.generateMines(numberofmines, gridsize);
  grid.generateNumbers(numberofmines, gridsize + 1);
  $('#play').click(function(){
    if (confirm("Restart game?")) {
      location.reload();
    }
  });
  $('.cell').mousedown(function(event) {
    if (counter) {
      counter = false;
      startTimer();
    }
    event.preventDefault();
    switch (event.which) {
    case 1:
      // Left Mouse button pressed
      if ( !$(this).hasClass("uncovered") && !$(this).hasClass("flag") ) {
        grid.uncover("#"+$(this).prop('id'), gridsize + 1);
      }
      break;
    case 3:
      // Right Mouse button pressed
      if ( !$(this).hasClass("uncovered") ) {
        if ( $(this).hasClass("flag") ) {
          $(this).html('');
          $(this).removeClass("flag");
          var minesleft = $('#minesleft').text();
          minesleft = parseInt(minesleft) + 1;
          $('#minesleft').text(minesleft);
        } else {
          $(this).html('<i class="fa fa-flag-o" aria-hidden="true"></i>');
          $(this).addClass("flag");
          var minesleft = $('#minesleft').text();
          minesleft = parseInt(minesleft) - 1;
          $('#minesleft').text(minesleft);
        } // end if
      } // end if
      break;
    } // end case
    check(grid.mines.sort().toString());
  });
});
