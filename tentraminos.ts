var d3;
var cells = d3.select("svg").selectAll("rect").data(d3.range(81));
var cellsize = 32;

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

cells.enter().append("rect")
  .attr({ 
      x: function(i:number){ return cellsize * (i % 9); },
      y: function(i:number){ return cellsize * Math.floor(i/9); },
      fill: function(i:number){ return colors[i % colors.length] },
      width: cellsize,
      height: cellsize,
  });
