var d3;
var cellsize = 32;
var numcells = 81; // you can't have 10 in a row, for obvious reasons :)

var cells = d3.select("#cells").selectAll("rect")
    .data(d3.range(numcells));
var cursor = d3.select("#cursor");
var gw = 9; // grid width
var gh = 9; // grid height

var colors = [

    "#292929", // 0 almost black
    "#a40000", // 1 dark red
    "#4e9a06", // 2 dark green
    "#c4a000", // 3 dark yellow
    "#204a87", // 4 dark blue
    "#66355f", // 5 dark purple
    "#00a4a2", // 6 dark cyan
    "#ce5c00", // 7 dark orange
    "#888a85", // 8 light gray

    "#3e4446", // 9 dark gray
    "#cc0000", // 10 light red
    "#73d216", // 11 light green
    "#edd400", // 12 light yellow
    "#3465a4", // 13 light blue
    "#8b608b", // 14 light purple
    "#16d2bd", // 15 light cyan
    "#f57900", // 16 light orange
    "#cccccc", // 17 almost white
];


function randCell() {
    return Math.floor(Math.random() * 9)
}

var matrix = [];
for (var i = 0; i < numcells; ++i) {
    matrix.push(0);
}

cursor.attr({
    x: 4,
    y: 4,
    width: cellsize * 2-8,
    height: cellsize * 2-8,
    "stroke-width": 8,
    "fill-opacity": 0,
    stroke : "black"
});

cells.enter().append("rect");

function redraw() {
    cells.attr({
	x: function(i:number){ return cellsize * (i % 9); },
	y: function(i:number){ return cellsize * Math.floor(i/9); },
	opacity: function(i:number){ return matrix[i] == 0 ? 0 : 1 },
	fill: function(i:number){ return colors[matrix[i]] },
	stroke: "black",
	width: cellsize,
	height: cellsize,
    });
}

redraw();

//-- cursor movement ----------------------------

cursor.x = 0;
cursor.y = 0;

function movecursor() {
    cursor.transition().duration(50).attr({
	x : cursor.x * cellsize + 4,
	y : cursor.y * cellsize + 4 });
}

function clamp(val, min, max : number) {
    return val < min ? min
	 : val > max ? max
	 : val;
}

var codes = {
    '^' : ()=> { cursor.y = clamp( cursor.y - 1, 0, 7 ); },
    'v' : ()=> { cursor.y = clamp( cursor.y + 1, 0, 7 ); },
    '<' : ()=> { cursor.x = clamp( cursor.x - 1, 0, 7 ); },
    '>' : ()=> { cursor.x = clamp( cursor.x + 1, 0, 7 ); },
    '(' : ()=> {
	var cxy = cursor.y * gw + cursor.x;
	var tmp = matrix[ cxy ];
	matrix[ cxy          ] = matrix[ cxy + 1      ];  // <
	matrix[ cxy      + 1 ] = matrix[ cxy + gw + 1 ];  // ^
	matrix[ cxy + gw + 1 ] = matrix[ cxy + gw     ];  // >
	matrix[ cxy + gw     ] = tmp;                     // v
    },
    ')' : ()=> {
	var cxy = cursor.y * gw + cursor.x;
	var tmp = matrix[ cxy ];
	matrix[ cxy          ] = matrix[ cxy + gw     ];  // ^
	matrix[ cxy + gw     ] = matrix[ cxy + gw + 1 ];  // <
	matrix[ cxy + gw + 1 ] = matrix[ cxy      + 1 ];  // v
	matrix[ cxy      + 1 ] = tmp;                     // >
    },
}


// -- keyboard controls -------------------------

var dvorak = {
    72 : '<', // f
    67 : '^', // c
    78 : '>', // n
    84 : 'v', // t
    79 : '(', // o
    85 : ')', // j
}
var keymap = dvorak;


document.onkeydown = function(e) {
    var code = window.event? event.keyCode: e.keyCode;
    if (keymap.hasOwnProperty(code)) codes[keymap[code]]();
    else switch (code) {
	case 37 : codes['<'](); break;
	case 38 : codes['^'](); break;
	case 39 : codes['>'](); break;
	case 40 : codes['v'](); break;
      default:
	console.log('code:', code);
	return true;
    }
    movecursor();
    redraw()
    return false;
}


// -- counter --------------------------------------------------

function now() { // current time in ms
    return new Date().getTime();
}

var clockview = d3.select("#clock");

var clock = { start: now() };
function tick() {
    var ms = now();
    var seconds = Math.floor((ms-clock.start) / 1000);
    if (seconds >= 10) {
	clock.start = now();
	seconds = 0;
    }
    clockview.text((10-seconds).toString());
}
var clocktask = window.setInterval(tick, 100);
