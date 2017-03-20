'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  Dimensions,
  ScrollView
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import RNFS from 'react-native-fs';

export class ViewCapture extends Component {

  goBack() {
    this.props.navigation.goBack(null);
    this.deleteImages();
  }

  deleteImages() {
        // create a path you want to delete
    const { params } = this.props.navigation.state;
    var path = RNFS.DocumentDirectoryPath + '/test.txt';
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

  render() {
    const { params } = this.props.navigation.state;
    const renderImages = params.images.map((thisImage) => {
      return(
        <Image style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width/2}} resizeMode={Image.resizeMode.contain} source={{uri: thisImage}}/>
      )
    });
    return (
      <ScrollView>
      <View style={styles.container}>
        {renderImages}
        <Button title="Try Again" onPress={this.goBack.bind(this)} />
      </View>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});