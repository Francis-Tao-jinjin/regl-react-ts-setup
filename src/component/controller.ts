import { DemoState } from "../state";
import { raySphere } from "../utils/raycats";
import { vec3 } from "gl-matrix";
import { doesNotReject } from "assert";

export class Controller {

  private _canvas:HTMLCanvasElement;
  private _state:DemoState;

  constructor(canvas:HTMLCanvasElement, state:DemoState) {
    this._canvas = canvas;
    this._state = state;
    this.onmousemove = this.onmousemove.bind(this);
    this.onmousedown = this.onmousedown.bind(this);
    this.onmouseup = this.onmouseup.bind(this);

    document.body.addEventListener('mousemove', this.onmousemove);
    document.body.addEventListener('mousedown', this.onmousedown);
    document.body.addEventListener('mouseup', this.onmouseup);
  }

  public onmousemove(ev:MouseEvent) {
    if (!this._state.pickQuaternionVector && ev.which !== 1) {
      return;
    }
    const camera = this._state.camera;
    const ray = camera.screenToray(ev.clientX, ev.clientY);
    const eye = camera.eye;
    const isHit = raySphere(
      eye[0], eye[1], eye[2],
      ray[0], ray[1], ray[2],
      0, 0, 0,
      1
    );
    if (isHit <= 0 || isHit == Infinity) {
      return;
    }
    const p = vec3.scaleAndAdd(vec3.create(), eye, ray, isHit);
    vec3.normalize(p, p);
    this._state.quaternion.setFromAxisAngle(p, this._state.quaternion.halfAngle * 2);
  }

  public onmousedown(ev:MouseEvent) {
    if (!this._state.pickQuaternionVector && ev.which !== 1) {
      return;
    }
  }

  public onmouseup(ev:MouseEvent) {
  }
}