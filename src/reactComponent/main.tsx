import * as React from 'react';
import { DemoState } from '../state';

export interface DemoProps {
  state:DemoState;
}

export interface MainState {
  halfAngle:number;
  meshType:string;
}

export class DemoMain extends React.Component<DemoProps, MainState> {
  [x: string]: any;
  constructor(props) {
    super(props);
    this.state = {
      halfAngle: this.props.state.quaternion.halfAngle * 180 / Math.PI,
      meshType: 'cube',
    };
  }

  public render() {
    const quaternion = this.props.state.quaternion;
    return (
      <div style={{
        userSelect: 'none',
      }}>
        <div style={{
          marginLeft: '4px',
          color: 'white',
        }}>
          <div>quaternion: q = w + x<i>i</i> + y<i>j</i> + z<i>k</i> </div>
          <div>q and inverse q : q<sup>-1</sup>q = 1</div>
          <div>for unit quaternion, use Euler's form could help us understand quickly:</div>
          <div>e<sup>(ø/2)(x<i>i</i>+y<i>j</i>+z<i>k</i>)</sup> = cos(ø/2) + (x<i>i</i> + y<i>j</i> + z<i>k</i>)sin(ø/2), <br></br>which x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = 1</div>
          <div>apply quaternion to rotate</div>
          f(p) = q•p•q<sup>-1</sup>
          <div>
            q = cos({Number(this.state.halfAngle).toFixed(0)}) + sin({Number(this.state.halfAngle).toFixed(0)})({Number(quaternion.axis[0]).toFixed(2)}i+({Number(quaternion.axis[1]).toFixed(2)}j)+({Number(quaternion.axis[2]).toFixed(2)}k))
          </div>
          <div>
            ø/2:<input type='range' min='-180' max='180' step='2' value={this.halfAngle}
                  onChange={(ev) => {
                    this.props.state.quaternion.halfAngle = ev.target.value * Math.PI / 180;
                    this.props.state.quaternion.setFromAxisAngle(quaternion.axis, this.props.state.quaternion.halfAngle);
                    this.setState({
                      halfAngle: this.props.state.quaternion.halfAngle  * 180 / Math.PI,
                    });
                  }}>
            </input>
          </div>
          <div>
            q = {Number(quaternion.value[3]).toFixed(2)} + ({Number(quaternion.value[0]).toFixed(2)}i) + ({Number(quaternion.value[1]).toFixed(2)}j) + ({Number(quaternion.value[2]).toFixed(2)}k)
          </div>

          <select name='mesh' value={this.state.meshType} onChange={(ev) => {
            switch (ev.target.value) {
              case 'cube':
                this.setState({meshType: 'cube'});
                this.props.state.pickedMesh = this.props.state.box;
                break;
              case 'xz-plane': 
                this.setState({meshType: 'xz-plane'});
                this.props.state.pickedMesh = this.props.state.xzPlane;
                break;
            }
          }}>
            <option value='cube'>Cube</option>
            <option value='xz-plane'>XZ-plane</option>
          </select>
        </div>
      </div>
    )
  }
}