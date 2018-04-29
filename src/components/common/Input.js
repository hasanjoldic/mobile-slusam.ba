import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View
} from 'react-native';

const Input = (props) => {
	const { containerStyle, inputStyle, labelStyle } = styles;

	return (
		<View style={containerStyle}>
		<TextInput
			onChangeText={props.onChangeText}
			value={props.value}
			placeholder={props.placeholder}
			secureTextEntry={props.secureTextEntry}
			autoCorrect={false}
			style={inputStyle}
			keyboardType={props.keyboardType ? props.keyboardType : "default"}
			autoCapitalize="none"
		/>
		</View>
	);
};

const styles = {
	inputStyle: {
		color: "#000",
		fontSize: 16,
		lineHeight: 20,
		flex: 1,
		height: 40
	}, 
	containerStyle: {
		flexDirection: "row",
    	justifyContent: "flex-start",
	},
};

export { Input };