'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  Dimensions,
  CameraRoll,
  ScrollView
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import RNFS from 'react-native-fs';


export class ViewCapture extends Component {

  goBack() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
      NavigationActions.navigate({ routeName: 'Settings'})
      ]
    })
    this.props.navigation.dispatch(resetAction);
    this.deleteImages();
  }

  deleteImages() {
        // create a path you want to delete
    const { params } = this.props.navigation.state;
    params.images.map((thisImage) => {
      return RNFS.unlink(thisImage)
        .then(() => {
          console.log('FILE DELETED');
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
  }

  saveCameraRoll() {
    const { params } = this.props.navigation.state;
    params.images.map((thisImage) => {
      CameraRoll.saveToCameraRoll(thisImage, "photo");
    });
    this.deleteImages();
  }

  render() {
    const { params } = this.props.navigation.state;
    const renderImages = params.images.map((thisImage) => {
      return(
        <Image style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width/2,marginTop:20}} resizeMode={Image.resizeMode.contain} source={{uri: thisImage}}/>
      )
    });
    return (
      <ScrollView>
      <View style={styles.container}>
        {renderImages}
        <View style={[styles.UIGeneral, styles.getStarted]}>
          <Button title="Try Again" color="white" onPress={this.goBack.bind(this)} />
        </View>
        <View style={[styles.UIGeneral, styles.getStarted]}>
          <Button title="Send To Camera Roll" color="white" onPress={this.saveCameraRoll.bind(this)} />
        </View>
      </View>
      </ScrollView>
    );
  }
}

const darkColor = "#4E3A5E";
const marginSize = 20;
const borderRad = 5;
const borderWid = 1;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  UIGeneral: {
    flexDirection: "row",
    minHeight: 80,
    justifyContent: "center",
    alignItems: 'center',
    width: (Dimensions.get('window').width) * .9,
    backgroundColor: "white",
    borderWidth: borderWid,
    borderRadius: borderRad,
    padding: marginSize,
    margin: marginSize,
    marginBottom: 0,
    borderColor: darkColor
  },
  getStarted: {
    backgroundColor: darkColor,
    height: 80,
    marginBottom: 20
  }
});