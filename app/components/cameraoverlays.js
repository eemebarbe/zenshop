'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';


export class ViewOverlay extends Component {

  render() {
    return (
      <View style={styles.visualizerContainer}>
        <View style={styles.fixedLine}></View>
      </View>
    );
  }
}


export class AngleVisual extends Component {

  gridGenerator() {
    const remainder = 180 - this.props.middleRange;
    const remainderDecimal = remainder / 180; 
    const margin = remainderDecimal / 2;
    //amount of total range that the middle range takes up in decimal
    const middleRangeDecimal = this.props.middleRange / 180;
    const middle = [];
    for(var i=0;i<this.props.numberOfLines;i++){
        middle.unshift( <View style={this.props.activeGridLine === i ? styles.gridLineActive : styles.gridLine}></View> )
    }
    return(
      <View className='captureRange' style={[styles.captureRange,{ height: visualizerHeight * middleRangeDecimal,
    marginBottom: visualizerHeight * margin,
    marginTop: visualizerHeight * margin}]}>
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
    justifyContent: 'space-between'
  },
  gridLine: {
    height:1,
    width:'100%',
    backgroundColor:'gray'
  },
  gridLineActive: {
    height:1,
    width:'100%',
    backgroundColor: 'yellow'
  },
  fixedLine: {
    width: '100%',
    height: 3,
    backgroundColor: 'white',
    transform : [{rotate : '90deg'}]
  }
});