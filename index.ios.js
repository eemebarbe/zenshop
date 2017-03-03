'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';


class Navigation extends Component {

  renderScene(route, navigator) {
     if(route.name == 'CameraView') {
       return <CameraView navigator={navigator} />
     }
     if(route.name == 'ViewCapture') {
       return <ViewCapture navigator={navigator} />
     }
  }


  render() {
    return (
      <Navigator
      initialRoute={{ name: 'CameraView' }}
      renderScene={this.renderScene} />
    );
  }
}


class ViewCapture extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>YEY</Text>
        <Image style={{width:'100%',height:'100%'}} source={{uri: '/Users/jeremybarbe/Library/Developer/CoreSimulator/Devices/B7296C79-92B3-43E5-8853-59A2B610C4B4/data/Containers/Data/Application/A1D9D3EE-FC0B-48CC-9AD8-E89CBE5C2882/Documents/8204BB2C-F313-4603-9719-87A1669AEBA4.jpg'}}/>
      </View>
    );
  }
}


class CameraView extends Component {
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
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <View style={{height:50,width:50,borderColor:"pink",borderWidth:5,borderRadius:5}}></View>
          </TouchableHighlight>
        </Camera>
      </View>
    );
  }

  takePicture() {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
      this.props.navigator.push({
        name: 'ViewCapture', // Matches route.name
      })

    }
}

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

AppRegistry.registerComponent('zenshop', () => Navigation);
