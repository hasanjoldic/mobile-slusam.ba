import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";

const Button = (props) => {
  const { buttonContainerStyle, buttonTextStyle } = styles;

  return (
    <TouchableOpacity onPress={props.onPress} style={{...props.buttonContainerStyle, ...buttonContainerStyle}}>
      <Text style={{...props.buttonTextStyle, ...buttonTextStyle}}>{props.innerText}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonContainerStyle: {
    alignSelf: "center"
  },
  buttonTextStyle: {
    alignSelf: "center"
  }
};

export { Button };