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


class CameraView extends Component {

  constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
        z: 0,
        angle: 0
      };
  }

  componentWillMount() {
    NativeModules.Accelerometer.setAccelerometerUpdateInterval(0.1);
    DeviceEventEmitter.addListener('AccelerationData', function (data) {
      this.setState({
        x: data.acceleration.x,
        y: data.acceleration.y,
        z: data.acceleration.z,
        angle: Math.atan2(data.gravity.x, data.gravity.y)
      });
    }.bind(this));
    NativeModules.Accelerometer.startAccelerometerUpdates();
  }


  outside(originalImage) {
    Image.getSize(originalImage, (w,h) =>{
      const cropData = {
        offset: {x:0,y:((h/2) - (w/2))},
        size: {width:w,height:w}
      }
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
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.disk}>
          <View style={{width:"100%",height:((Dimensions.get('window').height / 2) - (Dimensions.get('window').width / 2)),backgroundColor:"white",position:"absolute",opacity:.5,top:0}}></View>
          <View style={{width:"100%",height:(Dimensions.get('window').height / 2) - (Dimensions.get('window').width / 2),backgroundColor:"white",position:"absolute",opacity:.5}}><Text>{this.state.angle}</Text></View>
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
