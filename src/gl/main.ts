import { REGL, REGLLoader, safeProp } from './regl';
import glAxis = require('./axis');
import glPlane = require('./grid');
import glBox = require('./box');
import { DemoState } from '../state';

export = function(regl:REGL, loader:REGLLoader) {

  const axis = loader.require(glAxis);
  const plane = loader.require(glPlane);
  const box = loader.require(glBox);
  const stateProp = safeProp<DemoState>(regl);
  const setup = regl({
    context: {
      quaternion: stateProp('quaternion')('value').prop,
      eye: stateProp('camera')('eye').prop,
      view: stateProp('camera')('view').prop,
      projection: stateProp('camera')('projection').prop,
      invView: stateProp('camera')('invView').prop,
      invProjection: stateProp('camera')('invProjection').prop,
      gamma: stateProp('camera')('gamma').prop,
      maxLightDistance: stateProp('light')('maxLightDistance').prop,
      lightPos1: stateProp('light')('pos1').prop,
      lightPos2: stateProp('light')('pos2').prop,
    },
    uniforms: {
      quaternion: stateProp('quaternion')('value').prop,
      eye: stateProp('camera')('eye').prop,
      view: stateProp('camera')('view').prop,
      projection: stateProp('camera')('projection').prop,
      invView: stateProp('camera')('invView').prop,
      invProjection: stateProp('camera')('invProjection').prop,
      gamma: stateProp('camera')('gamma').prop,
      maxLightDistance: stateProp('light')('maxLightDistance').prop,
      lightPos1: stateProp('light')('pos1').prop,
      lightPos2: stateProp('light')('pos2').prop,
    }
  });

  function draw(state:DemoState) {
    setup(state, ({tick}) => {
      regl.clear({
        color: [0.361, 0.392, 0.424, 1],
        depth: 1,
      });
      plane.draw(state);
      box.draw(state);
      axis.draw(state);

      // drawCube(state.box);
      // drawSphere();
      // drawLine({
      //   color:[0.8235294117647058, 0.8156862745098039, 0.8156862745098039],
      //   width: 0.0075,
      //   start:[0,0,0],
      //   end: state.quaternion.axis,
      // });
      // drawPoint();
    });
  }

  function init(state:DemoState) {
    plane.init(state);
    axis.init(state);
  }

  return {
    draw,
    init,
  };
}