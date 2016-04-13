var playersSign;
var computersSign;
var winSide;
var winStroke;
var lastPlayerMove;
var lastAiMove;
var firstAiMove;
var playerFirstMove;
var strokes = [];
var wins = 0;
var loses = 0;
var draws = 0;

var columnLeft = $('#cell-four, #cell-one, #cell-seven');
strokes.push(columnLeft);
var columnCenter = $('#cell-two, #cell-five, #cell-eight');
strokes.push(columnCenter);
var columnRight = $('#cell-three, #cell-six, #cell-nine');
strokes.push(columnRight);
var rowTop = $('#cell-one, #cell-two, #cell-three');
strokes.push(rowTop);
var rowCenter = $('#cell-four, #cell-five, #cell-six');
strokes.push(rowCenter);
var rowBottom = $('#cell-seven, #cell-eight, #cell-nine');
strokes.push(rowBottom);
var firstDiagonal = $('#cell-one, #cell-five, #cell-nine');
strokes.push(firstDiagonal);
var secondDiagonal = $('#cell-three, #cell-five, #cell-seven');
strokes.push(secondDiagonal);

var updateScoreBoard = function() {
  $('#wins').text('Wins: ' + wins);
  $('#loses').text('Loses: ' + loses);
  $('#draws').text('Draws: ' + draws);
};

var changeSide = function() {
  var playersSign = '';
  var computersSign = '';
  $('#refresh').off('click');
  $(".cell").each(function(index) {
    $(this).off('click');
  });
  refreshGame('noStart');
  $('#dialog').css("display", "block");
}

var startGame = function() {
  updateScoreBoard();
  if (playersSign === 'circle') {
    aiMove();
  }
  $('#refresh').on('click', function() {
    refreshGame();
  });
  $('#change-side').on('click', function() {
    changeSide();
  });
  $(".cell").each(function(index) {
    $(this).on('click', function() {
      if (!$(this).hasClass("cross") && !$(this).hasClass("circle")) {
        var availebleCells = $(".empty");
        if (availebleCells.length === 0) {
          $(".cell").each(function(index) {
            $(this).off('click');
          });
          draws++;
          console.log(draws);
          refreshGame();
          return;
        }
        if (availebleCells.length === 8) {
          playerFirstMove = $(this);
          console.log(playerFirstMove);
        }
        if (playersSign === 'cross') {
          placeCross($(this));
        }
        if (playersSign === 'circle') {
          placeCircle($(this));
        }
        availebleCells = $(".empty");
        if (availebleCells.length === 0) {
          $(".cell").each(function(index) {
            $(this).off('click');
          });
          draws++;
          console.log(draws);
          refreshGame();
          return;
        }
        lastPlayerMove = $(this);
        endGameChecker();
        if (endGameChecker()) {
          endGame();
          return;
        }

        aiMove();
      }
    });
  });
};

var aiMove = function() {
  var availebleCells = $(".empty");
  if (availebleCells.length === 0) {
    $(".cell").each(function(index) {
      $(this).off('click');
    });
    draws++;
    console.log(draws);
    refreshGame();
    return;
  }
  if (playersSign === 'cross') {
    oAiStrategy();
  } else {
    xAiStrategy();
  }

  endGameChecker();
  if (endGameChecker()) {
    endGame();
    return;
  }
  var availebleC = $(".empty");
  if (availebleC.length === 0) {
    $(".cell").each(function(index) {
      $(this).off('click');
    });
    draws++;
    console.log(draws);
    refreshGame();
    return;
  }
}
var placeCross = function(obj) {
  $(obj).text('X');
  $(obj).removeClass('empty');
  $(obj).addClass('cross');
}
var placeCircle = function(obj) {
  $(obj).text('O');
  obj.removeClass('empty');
  obj.addClass('circle');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function checkWinOrLose(stroke) {
  var counterPlayer = 0;
  var counterComputer = 0;
  stroke.each(function(index) {
    if ($(this).hasClass(playersSign)) {
      counterPlayer++;
    }
  });
  stroke.each(function(index) {
    if ($(this).hasClass(computersSign)) {
      counterComputer++;
    }
  });
  if (counterPlayer === 3) {
    return playersSign
  } else if (counterComputer === 3) {
    return computersSign
  } else {
    return false
  }
};

function endGameChecker() {
  for (var i = 0; i < strokes.length; i++) {
    if (checkWinOrLose(strokes[i])) {
      winSide = checkWinOrLose(strokes[i]);
      winStroke = strokes[i];
      return winSide;
    }
  }
  return false;
}
var endGame = function() {
  $('#refresh').off('click');
  $('#change-side').off('click');
  $(".cell").each(function(index) {
    $(this).off('click');
  });
  if (winSide == computersSign) {
    loses++;
  } else {
    wins++;
  }
  console.log('Your loses ' + loses)
  winStroke.each(function(index) {
    $(this).css("animation", "bluefication 1.5s linear infinite");
  });
  setTimeout(refreshGame, 3000)
}
var refreshGame = function(str) {
  $(".cell").each(function(index) {
    $(this).html('');
    $(this).removeClass('circle cross');
    $(this).addClass('empty');
    $(this).css("animation", "none");
  });
  lastPlayerMove = undefined;
  $('main-container').off('click');
  if (str === 'noStart') {
    return;
  }
  startGame();
};

function checkLosePosability(stroke) {
  var counterPlayer = 0;
  var counterEmpty = 0;
  var decision;
  stroke.each(function(index) {
    if ($(this).hasClass(playersSign)) {
      counterPlayer++;
    }
  });
  stroke.each(function(index) {
    if ($(this).hasClass('empty')) {
      decision = $(this);
      counterEmpty++;
    }
  });
  if (counterPlayer === 2 && counterEmpty === 1) {
    return decision;
  } else {
    return false
  }
}

function checkWinPosability(stroke) {
  var counterAi = 0;
  var counterEmpty = 0;
  var decision;
  stroke.each(function(index) {
    if ($(this).hasClass(computersSign)) {
      counterAi++;
    }
  });
  stroke.each(function(index) {
    if ($(this).hasClass('empty')) {
      decision = $(this);
      counterEmpty++;
    }
  });
  if (counterAi === 2 && counterEmpty === 1) {
    return decision;
  } else {
    return false
  }
}

function winOrLoseMoveChecker() {
  for (var i = 0; i < strokes.length; i++) {
    if (checkWinPosability(strokes[i])) {
      var decision = checkWinPosability(strokes[i]);
      return decision;
    }
  }
  for (var n = 0; n < strokes.length; n++) {
    if (checkLosePosability(strokes[n])) {
      var decision = checkLosePosability(strokes[n]);
      return decision;
    }
  }
  return false;
}
var oAiStrategy = function() {
  var availebleCells = $(".empty");
  var target;
  if (winOrLoseMoveChecker()) {
    target = winOrLoseMoveChecker();
    placeCircle($(target));
    lastAiMove = $(target);
    return;
  }
  if (lastPlayerMove.hasClass('center') && availebleCells.length === 8) {
    var goal = availebleCells.filter('.corner');
    var i = getRandomInt(0, goal.length);
    target = goal[i];
    lastAiMove = $(target);
    console.log(1)
    placeCircle($(target));
    return;
  }
  if (lastPlayerMove.hasClass('edge') && availebleCells.length === 8) {
    var goal = availebleCells.filter('.center');
    target = goal;
    lastAiMove = $(target);
    placeCircle($(target));
    return;
  }
  if (lastPlayerMove.hasClass('edge') && availebleCells.length === 6 && lastAiMove.hasClass('center')) {
    var edges = $('.edge');
    var playerEdges = edges.filter('.cross');
    var edgeOne = $(playerEdges[0]);
    var edgeTwo = $(playerEdges[1]);
    if (edgeOne.is('#cell-two') && edgeTwo.is('#cell-four')) {
      target = $('#cell-one');
      lastAiMove = $(target);
      placeCircle($(target));
      return;
    }
    if (edgeOne.is('#cell-two') && edgeTwo.is('#cell-six')) {
      target = $('#cell-three');
      lastAiMove = $(target);
      placeCircle($(target));
      return;
    }
    if (edgeOne.is('#cell-six') && edgeTwo.is('#cell-eight')) {
      target = $('#cell-nine');
      lastAiMove = $(target);
      placeCircle($(target));
      return;
    }
    if (edgeOne.is('#cell-four') && edgeTwo.is('#cell-eight')) {
      target = $('#cell-seven');
      lastAiMove = $(target);
      placeCircle($(target));
      return;
    }
  }
  if (lastPlayerMove.hasClass('corner') && availebleCells.length === 8) {
    var goal = availebleCells.filter('.center');
    target = goal;
    lastAiMove = $(target);
    placeCircle($(target));
    return;
  }
  if (lastPlayerMove.hasClass('corner') && availebleCells.length === 6 && lastAiMove.hasClass('corner')) {
    var goal = availebleCells.filter('.corner');
    var i = getRandomInt(0, goal.length);
    target = goal[i];
    lastAiMove = target;
    placeCircle($(target));
    return;
  }
  if (lastPlayerMove.hasClass('corner') && availebleCells.length === 6 && lastAiMove.hasClass('center')) {
    var goal = availebleCells.filter('.edge');
    var i = getRandomInt(0, goal.length);
    target = goal[i];
    lastAiMove = target;
    placeCircle($(target));
    return;
  }
  var i = getRandomInt(0, availebleCells.length);

  target = availebleCells[i];
  console.log(target)
  placeCircle($(target));
  lastAiMove = $(target);
}
var xAiStrategy = function() {
  var availebleCells = $(".empty");
  var target;
  if (winOrLoseMoveChecker()) {
    target = winOrLoseMoveChecker();
    placeCross($(target));
    lastAiMove = $(target);
    return;
  }
  if (availebleCells.length === 9) {
    var p = getRandomInt(1, 3);
    if (p === 1) {
      var goal = availebleCells.filter('.corner');
      var i = getRandomInt(0, goal.length);
      target = goal[i];
      lastAiMove = $(target);
      firstAiMove = $(target);
      console.log(1)
      placeCross($(target));
      return;
    } else {
      target = $('.center');
      lastAiMove = $(target);
      firstAiMove = $(target);
      console.log(2)
      placeCross($(target));
      return;
    }
  }
  if (firstAiMove.hasClass('corner')) {
    if (availebleCells.length === 7 && lastAiMove.hasClass('corner')) {
      if (lastPlayerMove.hasClass('center')) {
        if (lastAiMove.is('#cell-one')) {
          target = $('#cell-nine');
          lastAiMove = $(target);
          console.log("nine")
          placeCross($(target));
          return;
        }
        if (lastAiMove.is('#cell-three')) {
          target = $('#cell-seven');
          lastAiMove = $(target);
          console.log("seven")
          placeCross($(target));
          return;
        }
        if (lastAiMove.is('#cell-seven')) {
          target = $('#cell-three');
          lastAiMove = $(target);
          console.log("three")
          placeCross($(target));
          return;
        }
        if (lastAiMove.is('#cell-nine')) {
          target = $('#cell-one');
          lastAiMove = $(target);
          console.log("one")
          placeCross($(target));
          return;
        }
      }
      if (!(lastPlayerMove.hasClass('center'))) {
        if (lastAiMove.is('#cell-one')) {
          if ($('#cell-three').hasClass('empty') && !(lastPlayerMove.is('#cell-two'))) {
            console.log('proc')
            target = $('#cell-three');
          } else {
            target = $('#cell-seven');
          }
          lastAiMove = $(target);
          console.log()
          placeCross($(target));
          return;
        }
        if (lastAiMove.is('#cell-three')) {
          if ($('#cell-nine').hasClass('empty') && !(lastPlayerMove.is('#cell-six'))) {
            console.log('proc')
            target = $('#cell-nine');
          } else {
            target = $('#cell-one');
          }
          lastAiMove = $(target);
          console.log("seven")
          placeCross($(target));
          return;
        }
        if (lastAiMove.is('#cell-seven')) {
          if ($('#cell-one').hasClass('empty') && !(lastPlayerMove.is('#cell-four'))) {
            console.log('proc')
            target = $('#cell-one');
          } else {
            target = $('#cell-nine');
          }
          lastAiMove = $(target);
          console.log("three")
          placeCross($(target));
          return;
        }
        if (lastAiMove.is('#cell-nine')) {
          if ($('#cell-three').hasClass('empty') && !(lastPlayerMove.is('#cell-six'))) {
            console.log('proc')
            target = $('#cell-three');
          } else {
            target = $('#cell-seven');
          }
          lastAiMove = $(target);
          console.log("one")
          placeCross($(target));
          return;
        }
      }

    }
    if (availebleCells.length === 5 && lastAiMove.hasClass('corner') && firstAiMove.hasClass('corner')) {
      if (firstAiMove.is('#cell-three')) {
        if ($('#cell-seven').hasClass('empty') && $('#cell-five').hasClass('empty')) {
          target = $('#cell-seven');
        } else if ($('#cell-one').hasClass('empty')) {
          target = $('#cell-one');
        } else {
          target = $('#cell-nine');
        }
        lastAiMove = $(target);
        console.log()
        placeCross($(target));
        return;
      }
      if (firstAiMove.is('#cell-one')) {
        if ($('#cell-nine').hasClass('empty') && $('#cell-five').hasClass('empty')) {
          target = $('#cell-nine');
        } else if ($('#cell-seven').hasClass('empty')) {
          target = $('#cell-seven');
        } else {
          target = $('#cell-three');
        }
        lastAiMove = $(target);
        console.log()
        placeCross($(target));
        return;
      }
      if (firstAiMove.is('#cell-seven')) {
        if ($('#cell-three').hasClass('empty') && $('#cell-five').hasClass('empty')) {
          target = $('#cell-three');
        } else if ($('#cell-nine').hasClass('empty')) {
          target = $('#cell-nine');
        } else {
          target = $('#cell-one');
        }
        lastAiMove = $(target);
        console.log()
        placeCross($(target));
        return;
      }
      if (firstAiMove.is('#cell-nine')) {
        if ($('#cell-one').hasClass('empty') && $('#cell-five').hasClass('empty')) {
          target = $('#cell-one');
        } else if ($('#cell-seven').hasClass('empty')) {
          target = $('#cell-seven');
        } else {
          target = $('#cell-three');
        }
        lastAiMove = $(target);
        console.log()
        placeCross($(target));
        return;
      }
    }
  }
  if (firstAiMove.hasClass('center')) {
    if (lastPlayerMove.hasClass('edge') && availebleCells.length === 7) {
      var goal = availebleCells.filter('.corner');
      if (lastPlayerMove.is('#cell-six')) {
        goal = goal.filter('#cell-one, #cell-seven');
      } else if (lastPlayerMove.is('#cell-four')) {
        goal = goal.filter('#cell-three, #cell-nine');
      } else if (lastPlayerMove.is('#cell-two')) {
        goal = goal.filter('#cell-seven, #cell-nine');
      } else {
        goal = goal.filter('#cell-one, #cell-three');
      }
      var i = getRandomInt(0, goal.length);
      target = goal[i];
      lastAiMove = $(target);
      placeCross($(target));
      return;
    }
    if (lastPlayerMove.hasClass('corner') && availebleCells.length === 7) {
      if (lastPlayerMove.is('#cell-one')) {
        target = $('#cell-nine');
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
      if (lastPlayerMove.is('#cell-three')) {
        target = $('#cell-seven');
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
      if (lastPlayerMove.is('#cell-seven')) {
        target = $('#cell-three');
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
      if (lastPlayerMove.is('#cell-nine')) {
        target = $('#cell-one');
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
    }
    if (lastPlayerMove.hasClass('edge') && availebleCells.length === 5 && playerFirstMove.hasClass('corner')) {
      if (lastAiMove.is('#cell-seven')) {
        if (lastPlayerMove.is('#cell-eight')) {
          target = $('#cell-one');
        } else if (lastPlayerMove.is('#cell-four')) {
          target = $('#cell-nine');
        }
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
      if (lastAiMove.is('#cell-nine')) {
        if (lastPlayerMove.is('#cell-six')) {
          target = $('#cell-seven');
        } else if (lastPlayerMove.is('#cell-eight')) {
          target = $('#cell-three');
        }
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
      if (lastAiMove.is('#cell-one')) {
        if (lastPlayerMove.is('#cell-two')) {
          target = $('#cell-seven');
        } else if (lastPlayerMove.is('#cell-four')) {
          target = $('#cell-three');
        }
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
      if (lastAiMove.is('#cell-three')) {
        if (lastPlayerMove.is('#cell-two')) {
          target = $('#cell-nine');
        } else if (lastPlayerMove.is('#cell-six')) {
          target = $('#cell-one');
        }
        lastAiMove = $(target);
        placeCross($(target));
        return;
      }
    }
  }
  var i = getRandomInt(0, availebleCells.length);
  target = availebleCells[i];
  console.log(target)
  placeCross($(target));
  lastAiMove = $(target);
}
$("document").ready(function() {
  $('#x').on('click', function() {

    $('#dialog').css("display", "none");
    playersSign = 'cross';
    computersSign = 'circle';
    startGame();
  });
  $('#o').on('click', function() {
    $('#dialog').css("display", "none");
    playersSign = 'circle';
    computersSign = 'cross';
    startGame();
  });
});