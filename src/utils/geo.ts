export function colorCube(box?:{positions:number[][], colors:number[][], count:number}) {
  if (box === undefined) {
    box = {positions:[], colors:[], count:0};
  }
  quad( 1, 0, 3, 2, 4, box.positions, box.colors);
  quad( 2, 3, 7, 6, 1, box.positions, box.colors);
  quad( 3, 0, 4, 7, 3, box.positions, box.colors);
  quad( 6, 5, 1, 2, 4, box.positions, box.colors);
  quad( 4, 5, 6, 7, 1, box.positions, box.colors);
  quad( 5, 4, 0, 1, 3, box.positions, box.colors);  
  box.count = box.positions.length;
  return box;
}

function quad(a, b, c, d, col, points, colors) {
  var vertices = [
    [ -0.5, -0.5,  0.5 ],
    [ -0.5,  0.5,  0.5 ],
    [  0.5,  0.5,  0.5 ],
    [  0.5, -0.5,  0.5 ],
    [ -0.5, -0.5, -0.5 ],
    [ -0.5,  0.5, -0.5 ],
    [  0.5,  0.5, -0.5 ],
    [  0.5, -0.5, -0.5 ]
  ];

  var vertexColors = [
    [ 0.0, 0.0, 0.0 ],  // black
    [ 1.0, 0.0, 0.0 ],  // red
    [ 1.0, 1.0, 0.0 ],  // yellow
    [ 0.0, 1.0, 0.0 ],  // green
    [ 0.0, 0.0, 1.0 ],  // blue
    [ 1.0, 0.0, 1.0 ],  // magenta
    [ 0.0, 1.0, 1.0 ],  // cyan
    [ 1.0, 1.0, 1.0 ]   // white
  ];

  var indices = [a,b,c,a,c,d];
  for (var i = 0; i< indices.length; ++i) {
    points.push(vertices[indices[i]]);
    colors.push(vertexColors[a]);
  }
}
