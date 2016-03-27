//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

/*
  var moves = [ [ 0, 1, 1], [ 6, 2, 1], [ 3, 3, 3],
  [ 4, 1, 3], [ 1, 2, 0], [ 7, 3, 1], [ 2, 2, 3],
  [ 5, 2, 4], [ 1, 3, 0], [ 7, 4, 2], [ 3, 3, 4],
  [ 7, 3, 3], [ 2, 2, 2], [ 4, 0, 2], [ 2, 1, 3],
  [ 5, 1, 4],
  // [ 5, 1, 3]
  [ 2, 1, 0 ], [ 3, 3, 2 ], [ 0, 1, 2]
  ],
  pawns = new Array (
    dark[0], dark[1],
    dark[2], dark[3],
    light[0], light[1],
    light[2], light[3]
  ),
  moveIndex = 0;

function next() {
  var move = moves[moveIndex++];
  moveOnto( pawns[move[0]], move[1], move[2] );
  if (moveIndex < moves.length) {
    window.setTimeout(next, 2000);
  }
}
*/

function Hmi() {
  this.winner = Common.NONE;
}

Hmi.LAYERBOARD      = 1;
Hmi.LAYERHINTS      = 3;
Hmi.LAYERWINNING    = 4;
Hmi.LAYERFREE       = 5;
Hmi.LAYERPAWN       = 6;
Hmi.LAYERMOVINGPAWN = 7;

Hmi.BOARD = $(".mondrago-board");
Hmi.BOARD.css({
  'position': 'fixed', 'z-index': Hmi.LAYERBOARD,
  'background': 'url(img/board.jpg)',
  'background-size': '100%',
});
Hmi.PAWNS = new Pawns();
Hmi.WINNING = $('#winning');
Hmi.WINNINGSQUARE = $('#winningsquare');
Hmi.GAMEPAGE = $('#game-page');

Hmi.prototype.update = function() {
  var titleHeight = 24,
      menuHeight = 6,
      decorationHeight = titleHeight + menuHeight,
      availableHeight = window.innerHeight - decorationHeight,
      availableWidth = window.innerWidth,
      size = Math.min(availableWidth * 0.90, availableHeight);
  Pawns.size = size / (Common.SIZE + 1),
  this.boardSize = size * Common.SIZE / (Common.SIZE + 1),
  Pawns.upperLeft[Common.X] = (availableWidth - this.boardSize) >> 1,
  Pawns.upperLeft[Common.Y] = titleHeight +
    ((availableHeight - this.boardSize) >> 1 );
  Hmi.PAWNS.doUpdate();
  this.updateGamePage(size);
  if (Pawns.chosen) {
    Hmi.PAWNS.updateLayoutFreeFields();
  }
  var minSize = 32;
  var size = 0.05 * availableWidth < minSize ? minSize : 0.05 * availableWidth;
  $('#customMenu').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
  size = 0.05 * availableWidth < minSize ? minSize : 0.05 * availableWidth;
  $('#customBackRules').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
  $('#customBackAbout').css({
    'width': size+'px', 'height': size+'px',
    'background-size': size+'px ' + size+'px',
  });
};

Hmi.prototype.updateGamePage = function(size) {
  var boardUpperLeft = {};
  boardUpperLeft[Common.X] = Pawns.upperLeft[Common.X] - (Pawns.size >> 1);
  boardUpperLeft[Common.Y] = Pawns.upperLeft[Common.Y] - (Pawns.size >> 1);
  this.updateBackground(size, boardUpperLeft);
  this.updateBoard(size, boardUpperLeft);
  Hmi.PAWNS.initHints(size, boardUpperLeft);
  this.updateMondrago(size, boardUpperLeft);
};

Hmi.prototype.updateBackground = function() {
  Hmi.GAMEPAGE.css({
    'background-size': 'auto ' + Pawns.size + 'px',
  });
};

Hmi.prototype.updateBoard = function(size, boardUpperLeft) {
  Hmi.BOARD.css({
    'width': size, 'height': size,
    'left': boardUpperLeft[Common.X], 'top': boardUpperLeft[Common.Y],
  });
};

Hmi.prototype.updateMondrago = function(size, boardUpperLeft) {
  var winner = this.winner;
  var endOfGame = Common.NONE !== winner;
  Hmi.WINNING.css({
    'position': 'fixed', 'z-index': Hmi.LAYERWINNING,
    'width': size, 'height': size,
    'left': boardUpperLeft[Common.X], 'top': boardUpperLeft[Common.Y],
    'visibility': endOfGame ? 'visible' : 'hidden',
    'opacity': endOfGame ? 1 : 0,
  });
};

Hmi.prototype.showMondrago = function() {
  var winner = this.winner;
  if(Common.NONE !== winner) {
    var pawn = Hmi.PAWNS.pawn[winner];
    var pathD = 'M ' + pawn[0].x + ' ' + pawn[0].y +
               ' L ' + pawn[1].x + ' ' + pawn[1].y +
               ' L ' + pawn[3].x + ' ' + pawn[3].y +
               ' L ' + pawn[2].x + ' ' + pawn[2].y +
               ' Z';
    document.getElementById('winningsquare').setAttribute('d', pathD);
    Hmi.WINNING.css({ 'visibility': 'visible', });
    Hmi.WINNING.animate({ 'opacity': 1, }, 2000 );
  }
};

Hmi.prototype.restart = function() {
  engine.postMessage({ 'class': 'request', 'request': 'restart' });
  this.winner = Common.NONE;
  this.deselectPawn();
  Hmi.PAWNS.hideHintsAndFreeFields();
  this.update();
};

Hmi.prototype.deselectPawn = function() {
  Pawns.chosen = null;
};

Hmi.prototype.userMove = function( id ) {
  if (Pawns.chosen) {
    var pawnChosen = Pawns.chosen;
    this.deselectPawn();
    var sourceX = pawnChosen.x,
        sourceY = pawnChosen.y;
    console.log( 'Pawn (' + sourceX + '/' + sourceY + ') to move ' +
      DIRECTION[id[1]][0] );
    var targetX = sourceX + DIRECTION[id[1]][1][0],
        targetY = sourceY + DIRECTION[id[1]][1][1];
    animateMove( pawnChosen, targetX, targetY );
    var move = [ sourceX + Common.SIZE * sourceY,
      targetX + Common.SIZE * targetY ];
    engine.postMessage({ 'class': 'request',
      'request': 'move',
      'move': move, });
  }
  else {
    console.log( 'No pawn selected to move.' );
  }
};

var hmi, engine;

function engineEventListener( eventReceived ) {
  var data = eventReceived.data;
  switch (data.eventClass) {
    case 'response':
      processEngineResponse( eventReceived );
      break;
    case 'request':
      processEngineRequest( eventReceived );
      break;
    default:
      console.log('Engine used unknown event class');
  }
}

function processEngineResponse( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    case 'running':
      console.log('Engine reported: ' + data.state);
      break;
    case 'ack_move':
      console.log('Engine reported ack move ' + data.move);
      break;
    case 'message':
      console.log('Engine reported message: ' + data.message);
      break;
    default:
      console.log('Engine reported unknown state');
  }
}

function processEngineRequest( eventReceived ) {
  var data = eventReceived.data;
  switch (data.request) {
    case 'redraw':
      console.log('Engine request: ' + data.request);
      Hmi.PAWNS.setUp(data.board);
      Hmi.PAWNS.allowControl(data.board[Common.ACTIVE]);
      hmi.showMondrago();
      break;
    case 'mondrago':
      console.log('Mondrago by ' + data.winner + ' player');
      hmi.winner = data.winner;
      break;
    default:
      console.log('Engine used unknown request');
  }
}

$(document).ready( function () {
  hmi = new Hmi();
  var $window = $(window);
  $window.resize( function() {
    hmi.update();
  });
  engine = new Worker('js/engine.js');
  engine.addEventListener('message', function( ev ) {
    engineEventListener( ev );
  }, false);
  engine.postMessage({ 'class': 'request', 'request': 'start' });
  $window.resize();
  Hmi.PAWNS.hideHintsAndFreeFields();
  for(var i=0; i<DIRECTION.length; ++i ) {
    $('#free-' + i).click( userMove );
  }
  $('#new').click( newGame );
});

function userMove( sourceEvent ) {
  hmi.userMove( sourceEvent.target.id.split('-') );
}

function animateMove( pawn, targetX, targetY ) {
  pawn.element.css({ 'z-index': Hmi.LAYERMOVINGPAWN, });
  pawn.element.animate({
    'width': Pawns.size * 1.2, 'height': Pawns.size * 1.2,
    'left': Pawns.upperLeft[Common.X] + Pawns.size * ( targetX - 0.1 ),
    'top': Pawns.upperLeft[Common.Y] + Pawns.size * ( targetY - 0.1 ),
  }, 1000, function() {
    pawn.element.css({ 'z-index': Hmi.LAYERPAWN, });
    pawn.element.animate({
      'width': Pawns.size, 'height': Pawns.size,
      'left': Pawns.upperLeft[Common.X] + Pawns.size * targetX,
      'top': Pawns.upperLeft[Common.Y] + Pawns.size * targetY,
    }, 1000, function() {
      Hmi.PAWNS.hideHintsAndFreeFields();
      engine.postMessage({ 'class': 'request', 'request': 'triggerdraw' });
    });
  });
}

function newGame() {
  hmi.restart();
}
