import React, { Component } from 'react';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import { connect } from "react-redux";
import { login } from "../reducers/auth/actions";

import {
  Button,
  Card,
  CardSection,
  Input
} from "./common";

class LoginScreen extends Component {
  state = {
    email: "",
    password: "",
  }

  onButtonPress() {
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  render() {
    const { 
      containerStyle, 
      headerContainerStyle, 
      formStyle, 
      errorTextStyle, 
      buttonContainerStyle,
      buttonTextStyle
    } = styles;
    return (
      <View style={containerStyle}>
        <View style={headerContainerStyle}>
          <Image 
            source={require("../static/images/stethoscope.png")} 
            style={{width: 60, height: 60 }}
          />
          <Text style={{alignSelf: "flex-end", fontSize: 18}}>Willkommen bei MedFor</Text>
        </View>
        <View style={formStyle}>
          <Input 
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            placeholder="Email"
            keyboardType="email-address"
          />
          <Input
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            placeholder="Passwort"
            secureTextEntry={true}
          />
          <Button
            onPress={this.onButtonPress.bind(this)}
            innerText="Log in" 
            buttonContainerStyle={buttonContainerStyle}
            buttonTextStyle={buttonTextStyle}
          />
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window')

const styles = {
  headerContainerStyle: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: "10%"
  },
  containerStyle: {
    width: "90%",
    alignSelf: "center",
    paddingTop: "10%"
  },
  formStyle: {
    width: "90%",
    alignSelf: "center"
  },
  errorTextStyle: {
    fontSize: 25,
    color: "red",
    alignSelf: "center"
  },
  buttonContainerStyle: {
    marginTop: "10%",
    padding: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#4674c1",
  },
  buttonTextStyle: {
    color: "#FFF",
    fontSize: 20
  }
};

const mapStateToProps = (state) => {
  return {
    appState: state
  }
};

export default connect(mapStateToProps, {
  login
})(LoginScreen);