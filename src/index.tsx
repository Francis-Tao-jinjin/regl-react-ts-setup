import * as React from 'react';
import * as ReactDOM from 'react-dom';

import createREGL = require('regl');
import { createREGLCache } from './gl/regl';
import glMain = require('./gl/main');
// import { DemoMain } from './reactComponent/main';
import { DemoState } from './state';

async function start() {
  const regl = createREGL({
    extensions: [
      'OES_element_index_uint',
      'OES_texture_float',
    ],
    attributes: {
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    }
  });

  const state = new DemoState(regl);

  const reglLoader = createREGLCache(regl, true);
  const gl = reglLoader.require(glMain);
  if (gl) {
    gl.init(state);
  }
  const reactContainer = document.createElement('div');
  reactContainer.id = 'react-container';
  const containerStyle = reactContainer.style;
  containerStyle.width = '100%';
  containerStyle.height = '100%';
  containerStyle.position = 'absolute';
  containerStyle.left = '0';
  containerStyle.top = '0';
  containerStyle.margin = '0';
  containerStyle.padding = '0';
  document.body.appendChild(reactContainer);

  regl.frame(() => {
    state.camera.updateCamera();
    gl.draw(state);
    // ReactDOM.render(
    //   <DemoMain state={state}/>,
    //   reactContainer);
  });
}

start().catch((err) => console.log(err));