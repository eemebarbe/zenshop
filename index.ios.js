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
  View,
  ImageEditor
} from 'react-native';
import Camera from 'react-native-camera';


class Navigation extends Component {

  renderScene(route, navigator) {
     if(route.name == 'CameraView') {
       return <CameraView navigator={navigator} />
     }
     if(route.name == 'ViewCapture') {
       return <ViewCapture navigator={navigator} image={route.imageData}/>
     }
  }


  render() {
    return (
      <Navigator
      initialRoute={{ name: 'CameraView' }}
      renderScene={this.renderScene}
      configureScene={(route, routeStack) =>
      Navigator.SceneConfigs.FloatFromBottom} />
    );
  }
}


class ViewCapture extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image style={{width:200,height:200}} source={{uri: this.props.image}}/>
      </View>
    );
  }
}


class CameraView extends Component {

  outside(originalImage) {
    Image.getSize(originalImage, (w,h) =>{
      const cropData = {
        offset: {x:0,y:(h/4)},
        size: {width:w,height:(h/2)}
      }
      ImageEditor.cropImage(originalImage, cropData,
      (successURI) => {
        this.props.navigator.push({
          name: 'ViewCapture', // Matches route.name
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
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <View style={{height:50,width:50,borderColor:"pink",borderWidth:5,borderRadius:5}}></View>
          </TouchableHighlight>
        </Camera>
      </View>
    );
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
