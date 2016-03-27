//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('board.js');

var session = new Session();

function hmiEventListener( eventReceived ) {
  var data = eventReceived.data;
  switch (data.class) {
    case 'response':
      processHmiResponse( eventReceived );
      break;
    case 'request':
      processHmiRequest( eventReceived );
      break;
    default:
      console.log('Hmi used unknown event class');
  }
}

function processHmiResponse( eventReceived ) {
  var data = eventReceived.data;
  switch (data.state) {
    default:
      console.log('Hmi reported unknown state');
  }
}

function processHmiRequest( eventReceived ) {
  var data = eventReceived.data;
  switch (data.request) {
    case 'triggerdraw':
      self.postMessage({ 'eventClass': 'response', 'state': 'running' });
      session.draw();
      self.postMessage({ 'eventClass': 'response', 'state': 'stillrunning' });
      break;
    case 'move':
      var endOfGame = session.move(data.move);
      var winner = session.getWinner();
      self.postMessage({ 'eventClass': 'response', 'state': 'ack_move',
        'move': data.move });
      if(Common.NONE != winner) {
        self.postMessage({ 'eventClass': 'request', 'request': 'mondrago',
          'winner': winner });
      }
      break;
    case 'start':
      session.start();
      session.draw();
      break;
    case 'restart':
      session.restart();
      session.draw();
      break;
    default:
      console.log('Hmi used unknown request');
  }
}

self.addEventListener('message', function( ev ) {
  hmiEventListener( ev );
}, false);

function Session() {
  this.board = new Board();
}

Session.prototype.draw = function () {
  self.postMessage({ 'eventClass': 'request',
    'request': 'redraw',
    'board': this.board.getState(),
  });
};

Session.prototype.move = function ( move ) {
  var endOfGame = this.board.move(move);
  return endOfGame;
};

Session.prototype.restart = function () {
  this.start( Board.initial );
};

Session.prototype.start = function () {
  this.board.setup( Board.initial );
};

Session.prototype.getWinner = function () {
  return this.board.getWinner();
};
