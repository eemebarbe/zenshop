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
          <View style={styles.button}><Text>Try Again</Text></View>
        </TouchableHighlight>
      </View>
    );
  }
}


class AngleVisual extends Component {
  gridGenerator(numberOfLines) {
    const captureRange = visualizerHeight / 2;
    const numberOfDivisions = (numberOfLines - 1)*2;
    const divisionSize = captureRange / numberOfDivisions;
    const middle = [];
        for(var i=0;i<(numberOfLines-2);i++){
            middle.push(<View style={[styles.gridLine, {height: divisionSize*2}]}>
              <View style={{height:1,width:'100%',top:'50%',backgroundColor:'pink'}}></View>
            </View>)
        }
    return(
      <View>
        <View style={[styles.gridLine, {height: divisionSize}]}>
          <View style={{height:1,width:'100%',top:0,backgroundColor:'yellow'}}></View>
        </View>
        {middle}
        <View style={[styles.gridLine, {height: divisionSize}]}>
          <View style={{height:1,width:'100%',top:'100%',backgroundColor:'yellow'}}></View>
        </View>
      </View>
    )
  }
  render() {
    const viewAngle = this.props.angleDegrees + 90;
    return(
      <View className='visualizerContainer' style={[ styles.visualizerContainer, {transform : [{translateX: -((this.props.zAnglePercentage -50)*10)}]} ]}>
        <View className='visualizer' style={[styles.visualizer, {transform : [{rotate : '-' + viewAngle + 'deg'}]} ]}>
          <View className='captureRange' style={styles.captureRange}>
          {this.gridGenerator(5)}
          </View>
        </View>
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
      const angle2 = (Math.atan2(data.gravity.x, data.gravity.z) + (Math.PI));
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
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        orientation={Camera.constants.Orientation.landscape}
        captureTarget={Camera.constants.CaptureTarget.disk}>
          <AngleVisual angleDegrees={this.state.angleDegrees} zAnglePercentage={zAnglePercentage} />
          <View>
            <Text style={{color:"white"}}>{zAnglePercentage}</Text>
          </View>
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <View style={styles.cameraShutter}></View>
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

const visualizerHeight = 1000;
const styles = StyleSheet.create({
  visualizerContainer : {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: '50%'
  },
  visualizer : {
    width: 1000,
    height: visualizerHeight,
    position: 'absolute',
    borderColor: 'purple',
    borderWidth: 1,
    right: -500
  },
  captureRange: {
    height: visualizerHeight / 2,
    marginBottom: visualizerHeight / 4,
    marginTop: visualizerHeight / 4,
    borderWidth: 1,
    borderColor: 'red'
  },
  gridLine: {
    width: '100%',
    height: 1
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
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  button: {
    height:50,
    width:50,
    backgroundColor:"blue"
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

AppRegistry.registerComponent('zenshop', () => zenshop);
