import {
  mat4,
  vec3,
  vec4,
} from 'gl-matrix';

export class Quaternion { 
  public value:number[] = [];
  public axis:vec3 = vec3.clone([1,0,0]);
  public halfAngle:number = 0;

  constructor(x:number=0,y:number=0,z:number=0,w:number=1) {
    this.value = [x, y, z, w];
  }

  // axis is normalized vector
  public setFromAxisAngle(axis:number[]|vec3, angle:number) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    const halfAngle = angle / 2;
    const s = Math.sin( halfAngle );

		this.value[0] = axis[0] * s;
		this.value[1] = axis[1] * s;
		this.value[2] = axis[2] * s;
    this.value[3] = Math.cos( halfAngle );
    vec3.copy(this.axis, axis);
    this.halfAngle = halfAngle;
    return this;
  }

  public inverse() {
    this.value[0] *= - 1;
		this.value[1] *= - 1;
    this.value[2] *= - 1;
    return this;
  }
}