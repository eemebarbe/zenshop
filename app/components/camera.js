'use strict';
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  NativeModules
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Camera from 'react-native-camera';
import { ViewOverlay, AngleVisual } from './cameraoverlays.js';


export class CameraView extends Component {

  constructor(props) {
      super(props);
      this.state = {
        angleDegrees: 0,
        angleDegrees2: 0,
        middleRange : 90,
        numberOfLines : 5,
        images : [],
        activeGridLine : 0,
        showVisualizer: true
      };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      numberOfLines: params.numberOfGridlines,
      middleRange: params.degrees
    });
  }

  componentDidMount() {
    this.startMotion();
  }

  startMotion() {
    const remainder = 180 - this.state.middleRange;
    //bottom point of middle range in degrees
    var bottom = remainder / 2;
    const top = 180 - bottom;
    const numberOfDivisionsVirtual = this.state.numberOfLines - 1;
    const divisionSizeVirtual = this.state.middleRange / numberOfDivisionsVirtual;

    NativeModules.DeviceMotion.setDeviceMotionUpdateInterval(0.085);
    DeviceEventEmitter.addListener('MotionData', function (data) {
      const angle = (Math.atan2(data.gravity.y, data.gravity.x) + (Math.PI));
      const angle2 = (Math.atan2(data.gravity.x, data.gravity.z) + (Math.PI));

      this.setState({
        angleDegrees: (angle * 180 / Math.PI),
        angleDegrees2: (angle2 * 180 / Math.PI)
      });
      //if there are still grid lines to be used
      if(this.state.activeGridLine < this.state.numberOfLines) {
        //if camera is pointed at the correct angle (within reason)
        if(this.state.angleDegrees2 > (bottom - .1) && this.state.angleDegrees2 < (bottom + .1)){
          this.takePicture();
          this.setState({
            activeGridLine : this.state.activeGridLine + 1
          });
          bottom = bottom + divisionSizeVirtual;
        }
      }
    }.bind(this));

    NativeModules.DeviceMotion.startDeviceMotionUpdates();
  }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        var array = this.state.images;
        array.push(data.path);
        this.setState({
          images: array
        });
        //if all images needed have been taken
        if (this.state.activeGridLine === this.state.numberOfLines) {
          NativeModules.DeviceMotion.stopDeviceMotionUpdates();
          this.setState({
            showVisualizer : false
          });
          this.props.navigation.navigate(
            'ViewCapture',  { images: this.state.images }
          )
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const zAnglePercentage = (this.state.angleDegrees2 / 180) * 100;

    return (
      <View style={styles.container}>
        <Camera
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        orientation={Camera.constants.Orientation.landscapeRight}
        captureTarget={Camera.constants.CaptureTarget.temp} />
        <View style={styles.preview2}>
          <ViewOverlay />
          { !this.state.showVisualizer ? null :
            <AngleVisual
             activeGridLine={this.state.activeGridLine} 
             angleDegrees={this.state.angleDegrees} 
             zAnglePercentage={zAnglePercentage} 
             middleRange={this.state.middleRange} 
             numberOfLines={this.state.numberOfLines} />
          }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  captureRange: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    transform : [{rotate : '90deg'}]
  },
    preview2: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  cameraShutter: {
    height:50,
    width:50,
    borderColor:"pink",
    borderWidth:5,
    borderRadius:5,
    marginBottom:10
  }
});



