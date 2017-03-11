'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  DeviceEventEmitter,
  NativeModules,
  ImageEditor
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Camera from 'react-native-camera';


class ViewCapture extends Component {

  goBack() {
    this.props.navigation.goBack(null);
  }

  render() {
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <Image style={{width:200,height:200}} source={{uri: params.imageData}}/>
        <TouchableHighlight onPress={this.goBack.bind(this)}>
          <View style={{height:50,width:50,backgroundColor:"blue"}}><Text>Try Again</Text></View>
        </TouchableHighlight>
      </View>
    );
  }
}


class AngleVisual extends Component {
  render() {
    const viewAngle = this.props.angleDegrees + 90;
    return(
      <View style={{flex:1,alignItems:'center',flexDirection:'row',position:'absolute',top:'50%',transform : [{translateX: this.props.zAnglePercentage*10}]}}>
        <View style={{width:1000,height:1000,borderWidth:1,borderColor:"white",transform : [{rotate : '-' + viewAngle + 'deg'}]}}></View>
      </View>
    );
  }
}


class CameraView extends Component {

  constructor(props) {
      super(props);
      this.state = {
        angleDegrees: 0
      };
  }

  componentDidMount() {
    NativeModules.DeviceMotion.setDeviceMotionUpdateInterval(0.05);
    DeviceEventEmitter.addListener('MotionData', function (data) {
      const angle = (Math.atan2(data.gravity.y, data.gravity.x) + (Math.PI));
      const angle2 = (Math.atan2(data.gravity.z, data.gravity.x) + (Math.PI));
      this.setState({
        angleDegrees: (angle * 180 / Math.PI),
        angleDegrees2: (angle2 * 180 / Math.PI)
      });
    }.bind(this));
    NativeModules.DeviceMotion.startDeviceMotionUpdates();
  }


  outside(originalImage) {
    Image.getSize(originalImage, (w,h) =>{
      ImageEditor.cropImage(originalImage, cropData,
      (successURI) => {
        this.props.navigation.navigate(
          'ViewCapture', {
            imageData: successURI
          })
      },
      (error) => {
        console.log(error);
      })
    })
  }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        this.outside(data.path);
      })
      .catch(err => console.error(err));
  }

  render() {
    const zAnglePercentage = (this.state.angleDegrees2 / 180) * 100;
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          orientation={Camera.constants.Orientation.landscape}
          captureTarget={Camera.constants.CaptureTarget.disk}>
          <AngleVisual angleDegrees={this.state.angleDegrees} zAnglePercentage={zAnglePercentage} />
          <View><Text style={{color:"white"}}>{zAnglePercentage}</Text></View>
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <View style={{height:50,width:50,borderColor:"pink",borderWidth:5,borderRadius:5,marginBottom:10}}></View>
          </TouchableHighlight>
        </Camera>
      </View>
    );
  }
}


const zenshop = StackNavigator({
  CameraView: { screen: CameraView },
  ViewCapture: { screen: ViewCapture },
}, {
  initialRouteName: 'CameraView',
  headerMode: 'none'
});

const styles = StyleSheet.create({
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
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('zenshop', () => zenshop);
