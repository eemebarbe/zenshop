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


class Settings extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View></View>
      </View>
    );
  }
}



class ViewOverlay extends Component {

  render() {
    return (
      <View style={styles.visualizerContainer}>
        <View style={styles.fixedLine}></View>
      </View>
    );
  }
}



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

  gridGenerator() {
    const totalRange = 180;
    const middleRangeDecimal = this.props.middleRange / totalRange;
    const captureRange = visualizerHeight * middleRangeDecimal;
    const numberOfDivisions = (this.props.numberOfLines - 1) * 2;
    const divisionSize = captureRange / numberOfDivisions;
    const middle = [];
    for(var i=0;i<(this.props.numberOfLines-2);i++){
        middle.push(<View style={[styles.gridLine, {height: divisionSize*2}]}>
                      <View style={{height:1,width:'100%',top:'50%',backgroundColor:'pink'}}></View>
                    </View>)
    }
    return(
      <View>
        <View style={[styles.gridLine, {height: divisionSize}]}>
          <View style={{height:1,width:'100%',top:0,backgroundColor:'blue'}}></View>
        </View>
        {middle}
        <View style={[styles.gridLine, {height: divisionSize}]}>
          <View style={{height:1,width:'100%',top:'100%',backgroundColor:'yellow'}}></View>
        </View>
      </View>
    )
  }

  gridGenerator() {
    const totalRange = 180;
    const middleRangeDecimal = this.props.middleRange / totalRange;
    const captureRange = visualizerHeight * middleRangeDecimal;
    const numberOfDivisions = this.props.numberOfLines - 1;
    const divisionSize = captureRange / numberOfDivisions;
    const middle = [];
    for(var i=0;i<this.props.numberOfLines;i++){
        middle.push( <View style={{height:1,width:'100%',backgroundColor:'pink'}}></View> )
    }
    return(
      <View className='captureRange' style={styles.captureRange}>
        {middle}
      </View>
    )
  }

  render() {
    //orient the grid visualization to the correct side
    const viewAngle = this.props.angleDegrees + 270;
    return(
      <View className='visualizerContainer' style={[ styles.visualizerContainer, {transform : [{translateX: -((this.props.zAnglePercentage -50)*(visualizerHeight/100))}]} ]}>
        <View className='visualizer' style={[styles.visualizer, {transform : [{rotate : '-' + viewAngle + 'deg'}]} ]}>
          {this.gridGenerator()}
        </View>
      </View>
    );
  }
}



class CameraView extends Component {

  constructor(props) {
      super(props);
      this.state = {
        angleDegrees: 0,
        angleDegrees2: 0,
        middleRange : 45,
        numberOfLines : 7
      };
  }

  componentDidMount() {

    var i = 0;
    const totalRange = 180;
    const remainder = totalRange - this.state.middleRange;
    //bottom point of middle range in degrees
    var bottom = remainder / 2;
    const top = totalRange - bottom;
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
      if(i < this.state.numberOfLines) {
        if(this.state.angleDegrees2 > (bottom - .1) && this.state.angleDegrees2 < (bottom + .1)){
          i++;
          alert(bottom);//replace with picture capture
          bottom = bottom + divisionSizeVirtual;
        }
      }
    }.bind(this));
    NativeModules.DeviceMotion.startDeviceMotionUpdates();
  }


  takePicture() {
    this.camera.capture()
      .then((data) => {
        this.props.navigation.navigate(
          'ViewCapture', {
            imageData: data.path
        })
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
          <AngleVisual angleDegrees={this.state.angleDegrees} angleDegrees2={this.state.angleDegrees2} zAnglePercentage={zAnglePercentage} middleRange={this.state.middleRange} numberOfLines={this.state.numberOfLines} />
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




const visualizerHeight = 3000;
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
    right: -500
  },
  captureRange: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: visualizerHeight / 2,
    marginBottom: visualizerHeight / 4,
    marginTop: visualizerHeight / 4
  },
  gridLine: {
    width: '100%',
    height: 1
  },
  fixedLine: {
    width: '100%',
    height: 3,
    backgroundColor: 'white',
    transform : [{rotate : '90deg'}]
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
