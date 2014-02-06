//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

importScripts('common.js');

function Board() {
}

Board.prototype.setup = function( position ) {
  this.position = {};
  this.position[Common.ACTIVE] = position[Common.ACTIVE];
  this.position[Common.LIGHT] = position[Common.LIGHT];
  this.position[Common.DARK] = position[Common.DARK];
};

Board.prototype.getState = function() {
  result = {};
  result[Common.ACTIVE] = this.position[Common.ACTIVE];
  result[Common.LIGHT] = this.list(this.position[Common.LIGHT]);
  result[Common.DARK] = this.list(this.position[Common.DARK]);
  return result;
};

Board.prototype.list = function( bitfield ) {
  var result = [];
  for (var i=0; i<Board.FIELD.length; ++i) {
    if(0 !== (Board.FIELD[i] & bitfield)) {
      result[result.length] = i;
    }
  }
  return result;
};

Board.prototype.move = function( move ) {
  var endOfGame = this.getWinner() !== Common.NONE;
  if (!endOfGame) {
    var active = this.position[Common.ACTIVE],
      from = move[0], to = move[1];
    this.position[active] -= Board.FIELD[ from ];
    this.position[active] += Board.FIELD[ to ];
    endOfGame = this.getWinner() !== Common.NONE;
    this.position[Common.ACTIVE] = endOfGame ? Common.NONE :
      Common.DARK === active ? Common.LIGHT : Common.DARK;
  }
  return endOfGame;
};

Board.prototype.getWinner = function() {
  return this.isWonBy(Common.LIGHT) ? Common.LIGHT :
    this.isWonBy(Common.DARK) ? Common.DARK : Common.NONE;
}

Board.prototype.isWonBy = function( player ) {
  var position = this.position[player], endOfGame = false;
  for(var i=0; i<Board.WIN.length && !endOfGame; ++i) {
    endOfGame = position == Board.WIN[i];
  }
  return endOfGame;
};

Board.a5index = 0;
Board.b5index = 1;
Board.c5index = 2;
Board.d5index = 3;
Board.e5index = 4;
Board.a4index = 5;
Board.b4index = 6;
Board.c4index = 7;
Board.d4index = 8;
Board.e4index = 9;
Board.a3index = 10;
Board.b3index = 11;
Board.c3index = 12;
Board.d3index = 13;
Board.e3index = 14;
Board.a2index = 15;
Board.b2index = 16;
Board.c2index = 17;
Board.d2index = 18;
Board.e2index = 19;
Board.a1index = 20;
Board.b1index = 21;
Board.c1index = 22;
Board.d1index = 23;
Board.e1index = 24;

Board.a5 = 1 << Board.a5index;
Board.b5 = 1 << Board.b5index;
Board.c5 = 1 << Board.c5index;
Board.d5 = 1 << Board.d5index;
Board.e5 = 1 << Board.e5index;
Board.a4 = 1 << Board.a4index;
Board.b4 = 1 << Board.b4index;
Board.c4 = 1 << Board.c4index;
Board.d4 = 1 << Board.d4index;
Board.e4 = 1 << Board.e4index;
Board.a3 = 1 << Board.a3index;
Board.b3 = 1 << Board.b3index;
Board.c3 = 1 << Board.c3index;
Board.d3 = 1 << Board.d3index;
Board.e3 = 1 << Board.e3index;
Board.a2 = 1 << Board.a2index;
Board.b2 = 1 << Board.b2index;
Board.c2 = 1 << Board.c2index;
Board.d2 = 1 << Board.d2index;
Board.e2 = 1 << Board.e2index;
Board.a1 = 1 << Board.a1index;
Board.b1 = 1 << Board.b1index;
Board.c1 = 1 << Board.c1index;
Board.d1 = 1 << Board.d1index;
Board.e1 = 1 << Board.e1index;

Board.FIELD = [
  Board.a5, Board.b5, Board.c5, Board.d5, Board.e5,
  Board.a4, Board.b4, Board.c4, Board.d4, Board.e4,
  Board.a3, Board.b3, Board.c3, Board.d3, Board.e3,
  Board.a2, Board.b2, Board.c2, Board.d2, Board.e2,
  Board.a1, Board.b1, Board.c1, Board.d1, Board.e1,
];

Board.initial = {};
Board.initial[Common.LIGHT] = Board.a1 | Board.b1 | Board.d5 | Board.e5;
Board.initial[Common.DARK] = Board.a5 | Board.b5 | Board.d1 | Board.e1;
// Board.initial[Common.LIGHT] = Board.a1 | Board.e2 | Board.a4 | Board.d5;
// Board.initial[Common.DARK] = Board.b3 | Board.b4 | Board.c3 | Board.c5;
Board.initial[Common.ACTIVE] = Common.LIGHT;

Board.WIN = [
  Board.b1 | Board.e2 | Board.a4 | Board.d5,

  Board.b1 | Board.d2 | Board.a3 | Board.c4,
  Board.c1 | Board.e2 | Board.b3 | Board.d4,
  Board.b2 | Board.d3 | Board.a4 | Board.c5,
  Board.c2 | Board.e3 | Board.b4 | Board.d5,

  Board.d1 | Board.a2 | Board.e4 | Board.b5,

  Board.c1 | Board.a2 | Board.d3 | Board.b4,
  Board.d1 | Board.b2 | Board.e3 | Board.c4,
  Board.c2 | Board.a3 | Board.d4 | Board.b5,
  Board.d2 | Board.b3 | Board.e4 | Board.c5,

  Board.c1 | Board.a3 | Board.e3 | Board.c5,

  Board.b1 | Board.a2 | Board.c2 | Board.b3,
  Board.c1 | Board.b2 | Board.d2 | Board.c3,
  Board.d1 | Board.c2 | Board.e2 | Board.d3,
  Board.b2 | Board.a3 | Board.c3 | Board.b4,
  Board.c2 | Board.b3 | Board.d3 | Board.c4,
  Board.d2 | Board.c3 | Board.e3 | Board.d4,
  Board.b3 | Board.a4 | Board.c4 | Board.b5,
  Board.c3 | Board.b4 | Board.d4 | Board.c5,
  Board.d3 | Board.c4 | Board.e4 | Board.d5,

  Board.a1 | Board.e1 | Board.a5 | Board.e5,

  Board.a1 | Board.d1 | Board.a4 | Board.d4,
  Board.b1 | Board.e1 | Board.b4 | Board.e4,
  Board.a2 | Board.d2 | Board.a5 | Board.d5,
  Board.b2 | Board.e2 | Board.b5 | Board.e5,

  Board.a1 | Board.c1 | Board.a3 | Board.c3,
  Board.b1 | Board.d1 | Board.b3 | Board.d3,
  Board.c1 | Board.e1 | Board.c3 | Board.e3,
  Board.a2 | Board.c2 | Board.a4 | Board.c4,
  Board.b2 | Board.d2 | Board.b4 | Board.d4,
  Board.c2 | Board.e2 | Board.c4 | Board.e4,
  Board.a3 | Board.c3 | Board.a5 | Board.c5,
  Board.b3 | Board.d3 | Board.b5 | Board.d5,
  Board.c3 | Board.e3 | Board.c5 | Board.e5,

  Board.a1 | Board.b1 | Board.a2 | Board.b2,
  Board.b1 | Board.c1 | Board.b2 | Board.c2,
  Board.c1 | Board.d1 | Board.c2 | Board.d2,
  Board.d1 | Board.e1 | Board.d2 | Board.e2,
  Board.a2 | Board.b2 | Board.a3 | Board.b3,
  Board.b2 | Board.c2 | Board.b3 | Board.c3,
  Board.c2 | Board.d2 | Board.c3 | Board.d3,
  Board.d2 | Board.e2 | Board.d3 | Board.e3,
  Board.a3 | Board.b3 | Board.a4 | Board.b4,
  Board.b3 | Board.c3 | Board.b4 | Board.c4,
  Board.c3 | Board.d3 | Board.c4 | Board.d4,
  Board.d3 | Board.e3 | Board.d4 | Board.e4,
  Board.a4 | Board.b4 | Board.a5 | Board.b5,
  Board.b4 | Board.c4 | Board.b5 | Board.c5,
  Board.c4 | Board.d4 | Board.c5 | Board.d5,
  Board.d4 | Board.e4 | Board.d5 | Board.e5,
];

Board.adjacent = new Array();
Board.adjacent[Board.a1index] = Board.b1 | Board.a2 | Board.b2;
Board.adjacent[Board.b1index] = Board.a1 | Board.c1 | Board.a2 | Board.b2 | Board.c2;
Board.adjacent[Board.c1index] = Board.b1 | Board.d1 | Board.b2 | Board.c2 | Board.d2;
Board.adjacent[Board.d1index] = Board.c1 | Board.e1 | Board.c2 | Board.d2 | Board.e2;
Board.adjacent[Board.e1index] = Board.d1 | Board.d2 | Board.e2;
Board.adjacent[Board.a2index] = Board.a1 | Board.b1 | Board.b2 | Board.a3 | Board.b3;
Board.adjacent[Board.b2index] = Board.a1 | Board.b1 | Board.c1 | Board.a2 | Board.c2 | Board.a3 | Board.b3 | Board.c3;
Board.adjacent[Board.c2index] = Board.b1 | Board.c1 | Board.d1 | Board.b2 | Board.d2 | Board.b3 | Board.c3 | Board.d3;
Board.adjacent[Board.d2index] = Board.c1 | Board.d1 | Board.e1 | Board.c2 | Board.e2 | Board.c3 | Board.d3 | Board.e3;
Board.adjacent[Board.e2index] = Board.d1 | Board.e1 | Board.d2 | Board.d3 | Board.e3;
Board.adjacent[Board.a3index] = Board.a2 | Board.b2 | Board.b3 | Board.a4 | Board.b4;
Board.adjacent[Board.b3index] = Board.a2 | Board.b2 | Board.c2 | Board.a3 | Board.c3 | Board.a4 | Board.b4 | Board.c4;
Board.adjacent[Board.c3index] = Board.b2 | Board.c2 | Board.d2 | Board.b3 | Board.d3 | Board.b4 | Board.c4 | Board.d4;
Board.adjacent[Board.d3index] = Board.c2 | Board.d2 | Board.e2 | Board.c3 | Board.e3 | Board.c4 | Board.d4 | Board.e4;
Board.adjacent[Board.e3index] = Board.d2 | Board.e2 | Board.d3 | Board.d4 | Board.e4;
Board.adjacent[Board.a4index] = Board.a3 | Board.b3 | Board.b4 | Board.a5 | Board.b5;
Board.adjacent[Board.b4index] = Board.a3 | Board.b3 | Board.c3 | Board.a4 | Board.c4 | Board.a5 | Board.b5 | Board.c5;
Board.adjacent[Board.c4index] = Board.b3 | Board.c3 | Board.d3 | Board.b4 | Board.d4 | Board.b5 | Board.c5 | Board.d5;
Board.adjacent[Board.d4index] = Board.c3 | Board.d3 | Board.e3 | Board.c4 | Board.e4 | Board.c5 | Board.d5 | Board.e5;
Board.adjacent[Board.e4index] = Board.d3 | Board.e3 | Board.d4 | Board.d5 | Board.e5;
Board.adjacent[Board.a5index] = Board.a4 | Board.b4 | Board.b5;
Board.adjacent[Board.b5index] = Board.a4 | Board.b4 | Board.c4 | Board.a5 | Board.c5;
Board.adjacent[Board.c5index] = Board.b4 | Board.c4 | Board.d4 | Board.b5 | Board.d5;
Board.adjacent[Board.d5index] = Board.c4 | Board.d4 | Board.e4 | Board.c5 | Board.e5;
Board.adjacent[Board.e5index] = Board.d4 | Board.e4 | Board.d5;
