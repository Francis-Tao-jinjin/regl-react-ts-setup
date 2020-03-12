import { REGLLoader, REGL, safeProp } from './regl';
import { DemoState } from '../state';

export = function(regl:REGL, loader:REGLLoader) {

  function init(state:DemoState) {
    state.axis = [{
      color: [0.96, 0.26, 0.21], alpha: 1, count: 8,
      position: [0, 0, 0, 16 + 16 / 32, 0, 0, 0, 0.005, 0, 16 + 16 / 32, 0.005, 0, 0, 0, 0.005, 16 + 16 / 32, 0, 0.005, 0, 0.005, 0.005, 16 + 16 / 32, 0.005, 0.005],
    },
    {
      color: [0.46, 0.87, 0], alpha: 1, count: 8,
      position: [0, 0, 0, 0, 16 + 16 / 32, 0, 0.005, 0, 0, 0.005, 16 + 16 / 32, 0, 0, 0, 0.005, 0, 16 + 16 / 32, 0.005, 0.005, 0, 0.005, 0.005, 16 + 16 / 32, 0.005],
    },
    {
      color: [0.13, 0.59, 0.95], alpha: 1, count: 8,
      position: [0, 0, 0, 0, 0, 16 + 16 / 32, 0.005, 0, 0, 0.005, 0, 16 + 16 / 32, 0, 0.005, 0, 0, 0.005, 16 + 16 / 32, 0.005, 0.005, 0, 0.005, 0.005, 16 + 16 / 32],
    }];
  }

  const axisProps = safeProp<{position:number[], color:number[], alpha:number, count:number}>(regl);
  const drawAxis = loader.cache(
    'axis',
    {
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
        color: [0, 0, 0, 0],
      },
      frag: `
        precision mediump float;
        uniform vec3 color;
        uniform float alpha;
        void main() {
          gl_FragColor = vec4(color, alpha);
        }
        `,
        vert: `
        precision mediump float;
        attribute vec3 position;
        uniform mat4 projection, view;
        void main() {
          gl_Position = projection * view * vec4(position, 1);
          gl_PointSize = 3.0;
        }
        `,
        attributes: {
          position: axisProps('position').prop,
        },
        uniforms: {
          alpha: axisProps('alpha').prop,
          color: axisProps('color').prop,
        },
        lineWidth: 1,
        count: axisProps('count').prop,
        primitive: 'lines',
    },
    true,
  );
  
  function draw(state:DemoState) {
    drawAxis(state.axis);
  }

  return {
    init,
    draw,
  };
}