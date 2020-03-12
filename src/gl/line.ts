import { REGLLoader, REGL } from './regl';
import { DemoState } from '../state';

export = function(regl:REGL, loader:REGLLoader) {


  return regl({
    frag: `
    precision mediump float;
    uniform vec3 color;
    uniform float alpha;
    void main() {
      gl_FragColor = vec4(color, 1);
    }
    `,
    vert: `
    precision highp float;
    attribute vec2 weight;
    varying highp vec3 position;
    uniform mat4 projection, view;
    uniform vec3 start, end, eye;
    uniform float width;
    void main () {
      vec3 base = mix(start, end, weight.x);

      vec3 lineDir = end - start;
      vec3 eyeDir = eye - base;
      vec3 normalDir = normalize(cross(lineDir, eyeDir));

      vec3 point = width * weight.y * normalDir + base;
      position = point;
      gl_Position = projection * view * vec4(point, 1);
    }`,
    uniforms: {
      // start: regl.prop('start'),
      // end: regl.prop('end'),
      // color: regl.prop('color'),
      // width: regl.prop('width'),
    },
    attributes: {
      weight: [
          [0, 1],
          [0, -1],
          [1, -1],
          [1, 1],
          [1, -1],
          [0, 1],
      ],
    },
    count: 6,
    primitive: 'triangles',
    elements: null,
  });
}