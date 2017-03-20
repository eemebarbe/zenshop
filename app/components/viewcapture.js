'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  NativeModules
} from 'react-native';
import { StackNavigator } from 'react-navigation';


export class ViewCapture extends Component {

  goBack() {
    this.props.navigation.goBack(null);
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Image style={{width:200,height:200}} source={{uri: params.images}}/>
        <TouchableHighlight onPress={this.goBack.bind(this)}>
          <View style={styles.button}><Text>Try Again</Text></View>
        </TouchableHighlight>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    height:50,
    width:50,
    backgroundColor:"blue"
  }
});