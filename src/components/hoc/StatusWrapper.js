import React, { Component } from "react";
import {
  View, Text, ActivityIndicator, Alert
} from "react-native";
import { connect } from "react-redux";
import ProgressBar from 'react-native-progress/Bar';

import { cmsColor } from "../../utils/utils";
import { setErrorMessage } from "../../reducers/app/actions";


class StatusWrapper extends Component {

  render() {
    if (this.props.errorMessage) {
      Alert.alert(
        "Greška",
        this.props.errorMessage,
        [
          {text: 'OK', onPress: () => this.props.setErrorMessage(null)}
        ],
        { cancelable: false }
      );
    }
    return (
      <View style={{flex:1}}>
        {this.props.children}
        {this.props.isLoading && !this.props.hideLoading && <View 
          style={{
            position:"absolute",top:0,left:0,backgroundColor:"#FFFFFFCC",flex:1,zIndex:2,
            width:"100%",height:"100%",justifyContent:"center"
          }}>
          {this.props.isTransmitting ?
            <ProgressBar style={{marginTop:20}} progress={this.props.transmitProgress} 
              width={200} color={cmsColor}/> :
            <ActivityIndicator size="large" color={cmsColor}/>
          }
        </View>}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { app } = state;
  return {
    isLoading: app.isLoading,
    isTransmitting: app.isTransmitting,
    transmitProgress: app.transmitProgress,
    errorMessage: app.errorMessage
  };
};

export default connect(mapStateToProps, {setErrorMessage})(StatusWrapper);