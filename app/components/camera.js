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
        images : []
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
    var i = 0;
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
      if(i < this.state.numberOfLines) {
        //if camera is pointed at the correct angle (within reason)
        if(this.state.angleDegrees2 > (bottom - .1) && this.state.angleDegrees2 < (bottom + .1)){
          i++;
          this.takePicture();
          bottom = bottom + divisionSizeVirtual;
        }
      } else if (i === this.state.numberOfLines) {
        NativeModules.DeviceMotion.stopDeviceMotionUpdates();
        this.props.navigation.navigate(
          'ViewCapture',  { images: this.state.images }
        )
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
        orientation={Camera.constants.Orientation.landscape}
        captureTarget={Camera.constants.CaptureTarget.disk}>
          <ViewOverlay />
          <AngleVisual angleDegrees={this.state.angleDegrees} zAnglePercentage={zAnglePercentage} middleRange={this.state.middleRange} numberOfLines={this.state.numberOfLines} />
        </Camera>
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



