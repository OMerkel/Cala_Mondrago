//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

function Pawn( color, id ) {
  this.element = $( '#' + color + '-' + id );
  this.element.css({ 'background': Pawns.IMAGE[color],
    'background-size': '100%', 'position': 'fixed',
    'z-index': Hmi.LAYERPAWN, });
}

Pawn.prototype.set = function( position ) {
  this.x = position % Common.SIZE;
  this.y = Math.floor( position / Common.SIZE );
  this.update();
}

Pawn.prototype.update = function() {
  this.element.css({
    'width': Pawns.size, 'height': Pawns.size,
    'left': Pawns.upperLeft[Common.X] + Pawns.size * this.x,
    'top': Pawns.upperLeft[Common.Y] + Pawns.size * this.y,
    'outline-radius': Pawns.size >> 1,
  });
}

function preselect( sourceEvent ) {
  var id = sourceEvent.target.id.split('-');
  var pawn = Hmi.PAWNS.pawn[id[0]][id[1]];
  Hmi.PAWNS.hideHints();
  prepareHints( pawn );
  Hmi.PAWNS.fadeInHints();
}

var EAST = 'east',
    SOUTHEAST = 'southeast',
    SOUTH = 'south',
    SOUTHWEST = 'southwest',
    WEST = 'west',
    NORTHWEST = 'northwest',
    NORTH = 'north',
    NORTHEAST = 'northeast',
    DIRECTION = [
      [EAST, [1, 0]],
      [SOUTHEAST, [1, 1]],
      [SOUTH, [0, 1]],
      [SOUTHWEST, [-1, 1]],
      [WEST, [-1, 0]],
      [NORTHWEST, [-1, -1]],
      [NORTH, [0, -1]],
      [NORTHEAST, [1, -1]]
    ];

function prepareHints( pawn ) {
  Pawns.chosen = pawn;
  prepareHintsPosition( pawn );
  prepareHintsDirection( pawn );
  Hmi.PAWNS.showFreeFields();
}

function prepareHintsPosition ( pawn ) {
  $('#hintsposition').attr({
    transform: 'translate( ' + pawn.x + ', ' + pawn.y + ')',
  })
}

function prepareHintsDirection( pawn ) {
  for( var i=0; i<DIRECTION.length; ++i ) {
    var direction = DIRECTION[i][0],
        x = pawn.x + DIRECTION[i][1][0],
        y = pawn.y + DIRECTION[i][1][1],
        visible = isFree( x, y);
    setHintVisibility( direction, visible );
  }
}

function isFree( x, y ) {
  var result = true;
  if ( 0 > x  ||  4 < x  ||  0 > y  ||  4 < y ) {
    result = false
  } else {
    for( var i = 0; i<Common.PAWNSPERSIDE && result; ++i ) {
      var light = Hmi.PAWNS.pawn[Common.LIGHT][i],
          dark = Hmi.PAWNS.pawn[Common.DARK][i];
      result &= (light.x !== x || light.y !== y);
      result &= (dark.x !== x || dark.y !== y);
    }
  }
  return result;
}

function setHintVisibility( direction, visible ) {
  $('#' + direction).attr({
    stroke: visible ? 'blue' : 'none',
  });
}
