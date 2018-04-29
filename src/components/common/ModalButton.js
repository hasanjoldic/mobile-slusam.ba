import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";

const ModalButton = (props) => {
  const { buttonContainerStyle, buttonTextStyle } = styles;

  return (
    <TouchableOpacity 
      onPress={props.onPress} 
      style={{...props.buttonContainerStyle, ...buttonContainerStyle}}
    > 
      {props.children}
      <Text 
        style={{...props.buttonTextStyle, ...buttonTextStyle}}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonContainerStyle: {
    alignSelf: "center",
    padding:10,
    borderBottomWidth: 1,
    borderColor: "#FFF",
    borderRadius:10,
    width:"100%",
    alignItems: "center",
    flexDirection:"row",
    justifyContent: "flex-start",
    paddingLeft: "20%"
  },
  buttonTextStyle: {
    alignSelf: "center",
    fontSize: 18,
    marginLeft: "10%"
  }
};

export { ModalButton };