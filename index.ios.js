'use strict';
import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Camera from 'react-native-camera';
import { CameraView } from './app/components/camera.js';
import { ViewCapture } from './app/components/viewcapture.js';
import { Settings } from './app/components/settings.js'


const zenshop = StackNavigator({
  CameraView: { screen: CameraView },
  ViewCapture: { screen: ViewCapture },
  Settings: { screen: Settings }
}, {
  initialRouteName: 'Settings',
  headerMode: 'none',
  navigationOptions: {
  	cardStack : {
  		gesturesEnabled : false
  	}
  }
});


AppRegistry.registerComponent('zenshop', () => zenshop);
