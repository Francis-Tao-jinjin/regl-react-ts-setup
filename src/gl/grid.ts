import { REGLLoader, REGL, safeProp } from './regl';
import { DemoState } from '../state';

export = function(regl:REGL, loader:REGLLoader) {

  function init(state:DemoState) {
    state.gridPlane.position = [];
    const gridRadius = state.gridPlane.radius;
    for (let i = -gridRadius; i <= gridRadius; ++i) {
      state.gridPlane.position.push(
        i , -gridRadius,
        i, gridRadius,
        -gridRadius, i,
        gridRadius, i);
    }
    state.gridPlane.count = (gridRadius * 2 + 1) * 4;
  }

  const gridPlaneProps = safeProp<{radius:number, position:number[], count:number}>(regl);
  const drawPlane = loader.cache(
    'planeGrid',
    {
      frag: `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.25, 0.25, 0.25, 1);
      }`,
      vert: `
      precision mediump float;
      uniform mat4 projection, view;
      attribute vec2 position;
      void main () {
        gl_Position = projection * view * vec4(position.x, 0, position.y, 1);
      }`,
      attributes: {
        position: gridPlaneProps('position').prop,
      },
      count: gridPlaneProps('count').prop,
      primitive: 'lines',
    },
    true);
  
  function draw(state:DemoState) {
    drawPlane(state.gridPlane);
  }

  return {
    init,
    draw,
  };
}