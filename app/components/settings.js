'use strict';
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfGridlines : 5,
      degrees : 90
    };
  }

  changeGrid(command) {
    if(command === "less" && this.state.numberOfGridlines > 3) {
      this.setState({
        numberOfGridlines : this.state.numberOfGridlines - 2
      });
    } else if (command === "more" && this.state.numberOfGridlines < 21) {
      this.setState({
        numberOfGridlines : this.state.numberOfGridlines + 2
      });
    }
  }

  changeDegrees(command) {
    if(command === "less" && this.state.degrees > 45) {
      this.setState({
        degrees : this.state.degrees - 5
      });
    } else if (command === "more" && this.state.degrees < 135) {
      this.setState({
        degrees : this.state.degrees + 5
      });
    }
  }

  toCamera() {
    this.props.navigation.navigate(
      'CameraView', { numberOfGridlines: this.state.numberOfGridlines,
                      degrees: this.state.degrees }
    )
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
          <Box title="Number of gridlines:">
            <Button title="Less" color={darkColor} onPress={() => this.changeGrid("less")} />
            <Text style={styles.selectedNumber}>{this.state.numberOfGridlines}</Text>
            <Button title="More" color={darkColor} onPress={() => this.changeGrid("more")} />
            </Box>
            <Box title={"Total range:"}>
              <Button title="Less" color={darkColor} onPress={() => this.changeDegrees("less")} />
              <Text style={styles.selectedNumber}>{this.state.degrees}</Text>
              <Button title="More" color={darkColor} onPress={() => this.changeDegrees("more")} />
            </Box>
            <View style={styles.getStarted}>
              <Button title="Let's get started!" color="white" onPress={() => this.toCamera()} />
            </View>
      </View>
    );
  }
}

export class Box extends Component {


  render() {
    return (
        <View style={styles.box}>
          <View style={styles.boxTitle}>
            <Text style={styles.boxTitleText}>{this.props.title}</Text>
          </View>
          <View style={styles.boxContent}>
            {this.props.children}
          </View>
        </View>
    );
  }
}

const darkColor = "#4E3A5E";
const marginSize = 20;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#DBD7DE'
  },
  boxContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    padding: marginSize,
    backgroundColor: "white"
  },
  boxTitle: {
    padding: marginSize,
    backgroundColor: darkColor,
    flexDirection: "row",
    justifyContent: "center"
  },
  boxTitleText: {
    color: "white"
  },
  box: {
    width: (Dimensions.get('window').width) * .9,
    height: 150,
    margin: marginSize,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: darkColor,
  },
  selectedNumber: {
    fontSize: 40
  },
  getStarted: {
    width: (Dimensions.get('window').width) * .9,
    backgroundColor: darkColor,
    borderWidth: 1,
    padding: marginSize,
    margin: marginSize,
    marginBottom: 0,
    borderColor: darkColor
  }
});
