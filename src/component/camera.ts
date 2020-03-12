import { mat4, mat3, vec4, vec3, vec2, quat } from 'gl-matrix';
import { unproject } from '../utils/raycats';
const mouseWheel = require('mouse-wheel');
const scratchMat3 = mat3.create();
const scratchMat4 = mat4.create();

const DEFAULT_FOV_Y = Math.PI / 4;
const DEFAULT_Z_NEAR = 1;
const DEFAULT_Z_FAR = 1024;
const DEFAULT_GAMMA = 2.2;
const right = new Float32Array([1, 0, 0]);
const front = new Float32Array([0, 0, 1]);

export class Camera {
  public viewportWidth:number = 1;
  public viewportHeight:number = 1;
  public view:mat4 = mat4.create();
  public projection:mat4 = mat4.create();
  public viewProjection:mat4 = mat4.create();

  public invView:mat4 = mat4.create();
  public invProjection:mat4 = mat4.create();
  public invViewProjection:mat4 = mat4.create();

  public eye:vec3 = vec3.create();
  public rotation:quat = quat.create();
  public target:vec3 = vec3.create();
  public up = new Float32Array([0, 1, 0]);

  public targetEye:vec3 = vec3.create();
  public targetRotation:quat = quat.create();

  public fovY:number = DEFAULT_FOV_Y;
  public zNear:number = DEFAULT_Z_NEAR;
  public zFar:number = DEFAULT_Z_FAR;
  public gamma:number = DEFAULT_GAMMA;

  public canvas:HTMLCanvasElement;

  private prevX = 0;
  private prevY = 0;

  private metaDown = false;
  private startRotate = false;

  public theta = 0;
  public phi = 0;
  public distance = 10;

  public dtheta = 0;
  public dphi = 0;
  public ddistance = 0;

  public minDistance = 0.002// Math.log(0.1);
  public maxDistance = 100; // Math.log(1000);
  
  constructor (canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.reset();

    mouseWheel(document.body, (dx, dy, dz, ev) => {
      let d = this.ddistance;
      d += dy / window.innerHeight/2;
      if ((this.distance < 0.003 && d<0) || (this.distance > 7 && d>0)) {
        return;
      }
      this.ddistance += dy / window.innerHeight/2
      // needCallHook = true;
    });

    this._onContextMenu = this._onContextMenu.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this.attachEventListener();
  }

  private calcProjection() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    mat4.perspective(
      this.projection,
      this.fovY,
      this.viewportWidth / this.viewportHeight,
      this.zNear,
      this.zFar);
    mat4.invert(
      this.invProjection,
      this.projection);
  }

  private calcView() {
    const {
      eye,
      view,
      target,
      up,
    } = this;
    mat4.lookAt(this.view, eye, target, <vec3>up);
    mat4.invert(this.invView, this.view);
  }

  private recalc() {
    const {
      viewProjection,
      invViewProjection,
      projection,
      view,
    } = this;

    this.calcView();
    this.calcProjection();

    mat4.mul(viewProjection, projection, view);
    mat4.invert(invViewProjection, viewProjection);
  }
  
  public reset() {
    vec3.set(this.eye, 0, 0, 0);
    quat.identity(this.rotation);
    this.fovY = DEFAULT_FOV_Y;
    this.zNear = DEFAULT_Z_NEAR;
    this.zFar = DEFAULT_Z_FAR;
    this.gamma = DEFAULT_GAMMA;
    this.recalc();
  }

  public lookAt(eye:vec3, target:vec3, up?:vec3) {
    vec3.copy(this.targetEye, eye);
    quat.fromMat3(
      this.targetRotation,
      mat3.fromMat4(
        scratchMat3,
        mat4.lookAt(
          scratchMat4,
          eye,
          target,
          up || vec3.fromValues(0, 1, 0))));
  }

  public updateCamera() {
    let target = this.target;
    let eye = this.eye;
    let up = this.up;

    this.theta += this.dtheta;
    this.phi = this.clamp(
      this.phi + this.dphi,
      -Math.PI / 2.001,
      Math.PI / 2.001
    );
    this.distance = this.clamp(
      this.distance + this.ddistance,
      this.minDistance,
      this.maxDistance);
    
    this.dtheta = 0;
    this.dphi = 0;
    this.distance = this.damp(this.ddistance);
    
    let theta = this.theta;
    let phi = this.phi;
    let r = Math.exp(this.distance);

    let vf = r * Math.sin(theta) * Math.cos(phi);
    let vr = r * Math.cos(theta) * Math.cos(phi);
    let vu = r * Math.sin(phi);

    for (let i = 0; i<3; i++) {
      eye[i] = target[i] + vf * front[i] + vr * right[i] + vu * up[i];
    }

    this.recalc();
  }

  private _onKeyDown(e:KeyboardEvent) {
    if (e.keyCode == 88) {
      this.metaDown = true;
    }
  }

  private _onKeyUp(e:KeyboardEvent) {
    if (e.keyCode == 88) {
      this.metaDown = false;
    }
  }

  private _onMouseDown(e:MouseEvent) {
    if (e.button == 2 || (e.button == 0 && this.metaDown == true)) {
      this.startRotate = true;
    }
  }

  private _onContextMenu(e:MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  private _onMouseMove(e:MouseEvent) {
    let x = e.clientX;
    let y = e.clientY;
    if (this.startRotate) {
      x = e.clientX;
      y = e.clientY;

      const dx = (x - this.prevX) / window.innerWidth / 2;
      const dy = (y - this.prevY) / window.innerHeight / 2;
      const w = Math.max(3 * this.distance, 0.5);
      this.dtheta += w * dx;
      this.dphi += w * dy;
    }
    this.prevX = x;
    this.prevY = y;
  }

  private _onMouseUp(e:MouseEvent) {
    // this.needCallHook = true;
    this.startRotate = false;
  }

  public damp (x) {
    var xd = x * 0.8;
    if (xd < 0.005 && xd > -0.005) {
      return 0;
    }
    return xd;
  }

  public clamp (x, lo, hi) {
    return Math.min(Math.max(x, lo), hi);
  }

  public screenToray(screenX:number, screenY:number) : vec3 {
    const ray = unproject(
      [screenX, screenY],
      [0, 0, innerWidth, innerHeight],
      this.invProjection,
      this.invView,
    );
    return ray;
  }

  attachEventListener () {
    document.body.addEventListener('keydown', this._onKeyDown);
    document.body.addEventListener('keyup', this._onKeyUp);
    document.body.addEventListener('mousedown', this._onMouseDown);
    document.body.addEventListener('contextmenu', this._onContextMenu);
    document.body.addEventListener('mousemove', this._onMouseMove);
    document.body.addEventListener('mouseup', this._onMouseUp);
  }

  releaseEventListener() {
    document.body.removeEventListener('keydown', this._onKeyDown);
    document.body.removeEventListener('keyup', this._onKeyUp);
    document.body.removeEventListener('mousedown', this._onMouseDown);
    document.body.removeEventListener('contextmenu', this._onContextMenu);
    document.body.removeEventListener('mousemove', this._onMouseMove);
    document.body.removeEventListener('mouseup', this._onMouseUp);
  }
}