//
// Copyright (c) 2016 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

function Pawns() {
  this.init();
  console.log('Pawns init done');
}

Pawns.IMAGE = new Array();
Pawns.IMAGE[Common.LIGHT] = 'url(img/light_normal.png)';
Pawns.IMAGE[Common.DARK] = 'url(img/dark_normal.png)';
Pawns.size = 0;
Pawns.upperLeft = {};
Pawns.chosen = null;

Pawns.HINTS = $('#hints');

Pawns.prototype.setUp = function( pawnPositions ) {
  for( var i=0; i<Common.PAWNSPERSIDE; ++i ) {
    this.pawn[Common.LIGHT][i].set( pawnPositions[Common.LIGHT][i] );
    this.pawn[Common.DARK][i].set( pawnPositions[Common.DARK][i] );
  }
};

Pawns.prototype.init = function() {
  this.pawn = new Array();
  this.pawn[Common.LIGHT] = new Array();
  this.pawn[Common.DARK] = new Array();
  for( var i = 0; i<Common.PAWNSPERSIDE; ++i ) {
    light = this.pawn[Common.LIGHT], dark = this.pawn[Common.DARK];
    light[light.length] = new Pawn( Common.LIGHT, light.length );
    dark[dark.length] = new Pawn( Common.DARK, dark.length );
  }
};

Pawns.prototype.allowControl = function( pawnColor ) {
  if(Common.NONE == pawnColor) {
    for(var i = 0; i<Common.PAWNSPERSIDE; ++i) {
      this.pawn[Common.LIGHT][i].element.off('click');
      this.pawn[Common.DARK][i].element.off('click');
    }
  }
  else {
    var other = pawnColor == Common.LIGHT ? Common.DARK : Common.LIGHT;
    for(var i = 0; i<Common.PAWNSPERSIDE; ++i) {
      this.pawn[pawnColor][i].element.click( preselect );
      this.pawn[other][i].element.off('click');
    }
  }
};

Pawns.prototype.doUpdate = function() {
  for( var i = 0; i<Common.PAWNSPERSIDE; ++i ) {
    this.pawn[Common.LIGHT][i].update();
    this.pawn[Common.DARK][i].update();
  }
};

Pawns.prototype.hideHintsAndFreeFields = function () {
  this.hideHints();
  this.hideFreeFields();
};

Pawns.prototype.hideHints = function () {
  Pawns.HINTS.css({ opacity: 0, visibility: 'hidden', });
};

Pawns.prototype.fadeInHints = function () {
  Pawns.HINTS.css({ opacity: 0, visibility: 'visible', });
  Pawns.HINTS.animate({ opacity: 1, }, 1000);
};

Pawns.prototype.initHints = function ( size, boardUpperLeft ) {
  $('#hints').css({
    'position': 'fixed', 'z-index': Hmi.LAYERHINTS,
    'width': size, 'height': size,
    'left': boardUpperLeft[Common.X], 'top': boardUpperLeft[Common.Y],
  });
};

Pawns.prototype.hideFreeFields = function () {
  for( var i=0; i<DIRECTION.length; ++i ) {
    $('#free-' + i).css({ 'visibility': 'hidden', });
  }
};

Pawns.prototype.showFreeFields = function () {
  for( var i=0; i<DIRECTION.length; ++i ) {
    var direction = DIRECTION[i][0],
        x = Pawns.chosen.x + DIRECTION[i][1][0],
        y = Pawns.chosen.y + DIRECTION[i][1][1],
        free = isFree( x, y);
    $('#free-' + i).css({
      'position': 'fixed', 'z-index': Hmi.LAYERFREE,
      'visibility': free ? 'visible' : 'hidden',
      'width': Pawns.size, 'height': Pawns.size,
      'left': Pawns.upperLeft[Common.X] + Pawns.size * x,
      'top': Pawns.upperLeft[Common.Y] + Pawns.size * y,
      'opacity': 0.1,
      'background': '#000000',
    });
  }
};

Pawns.prototype.updateLayoutFreeFields = function () {
  if (Pawns.chosen) {
    for(var i=0; i<DIRECTION.length; ++i ) {
      $('#free-' + i).css({
        'width': Pawns.size, 'height': Pawns.size,
        'left': Pawns.upperLeft[Common.X] + Pawns.size *
          ( Pawns.chosen.x + DIRECTION[i][1][0] ),
        'top': Pawns.upperLeft[Common.Y] + Pawns.size *
          ( Pawns.chosen.y + DIRECTION[i][1][1] ),
      });
    }
  }
};
