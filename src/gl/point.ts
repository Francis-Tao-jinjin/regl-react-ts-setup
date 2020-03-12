export = function(regl) {
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
    cull: {
      enable: true,
      face: 'back',
    },
    frag: `
      precision mediump float;
      varying vec3 vcolor;
      uniform float alpha;
      void main() {
        gl_FragColor = vec4(vcolor, 1);
      }
      `,
      vert: `
      precision mediump float;
      attribute vec3 position, color;
      uniform mat4 projection, view;
      uniform vec4 quaternion;
      varying vec3 vcolor;

      vec3 applyQuaternion(vec4 q, vec3 p) {
        float x = p.x;
        float y = p.y;
        float z = p.z;
        float qx = q.x;
        float qy = q.y;
        float qz = q.z;
        float qw = q.w;
        // calculate quat * vector
        float ix = qw * x + qy * z - qz * y;
        float iy = qw * y + qz * x - qx * z;
        float iz = qw * z + qx * y - qy * x;
        float iw = - qx * x - qy * y - qz * z;

        float x1 = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		    float y1 = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		    float z1 = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return vec3(x1, y1, z1);
        // return vec3(ix, iy, iz);
      }

      void main() {
        vcolor = color;

        gl_Position = projection * view * vec4(applyQuaternion(quaternion, position), 1);
        gl_PointSize = 20.0;
      }
      `,
      attributes: {
        position: [1,0,0, 0,1,0, 0,0,1],
        color: [1,0,0, 0,1,0, 0,0,1],
      },
      count: 3,
      primitive: 'points',
  })
}