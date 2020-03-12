const icosphere = require('icosphere');

export = function(regl) {
  const sphere = icosphere(2);

  const positions:number[][] = [];
  for (let i = 0; i < sphere.cells.length; i++) {
    const [a, b, c] = sphere.cells[i];
    positions.push(sphere.positions[a]);
    positions.push(sphere.positions[b]);
    positions.push(sphere.positions[b]);
    positions.push(sphere.positions[c]);
    positions.push(sphere.positions[c]);
    positions.push(sphere.positions[a]);
  }

  return regl({
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1,
      },
      equation: {
        rgb: 'add',
        alpha: 'add',
      },
      color: [1, 1, 1, 1],
    },
    depth: {
      enable: true,
      mask: false,
      func: '<=',
    },
    frag: `
    precision mediump float;
    void main () {
      gl_FragColor = vec4(0.1, 0.1, 0.1, 0.1);
    }`,
    vert: `
    precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position;
    void main () {
      gl_Position = projection * view * vec4(position, 1);
    }`,
    attributes: {
      position: positions,
    },
    primitive: 'lines',
    count: positions.length,
  });
}