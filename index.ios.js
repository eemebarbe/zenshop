'use strict';
import StackNavigator from 'react-navigation';
import { ViewOverlay, AngleVisual, CameraView } from 'components/camera.jsx';
import ViewCapture from 'components/viewcapture.jsx';

const zenshop = StackNavigator({
  CameraView: { screen: CameraView },
  ViewCapture: { screen: ViewCapture },
}, {
  initialRouteName: 'CameraView',
  headerMode: 'none'
});

AppRegistry.registerComponent('zenshop', () => zenshop);
