import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Keyboard,
  Alert,
  WebView
} from 'react-native';
import Modal from "react-native-modal";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import { StackNavigator } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob'
import VideoPlayer from 'react-native-video-player';


import { startConversation } from "../../reducers/chat/actions";

import {
  Button,
  Card,
  CardSection,
  Input
} from "../common";

const TEXT = "text";
const IMAGE = "image";
const VIDEO = "video";
let counter = 0;

var options = {
  mediaType: "video"
};


class StartConversationScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  state = {
    text: "",
    contentKeys: [],
    fileSourceUri: null,
    filePath: null,
    fileType: null
  }

  handlePressAdd() {
    if (this.state.mainInput) {
      this.setState({
        ["content_"+counter]: {type: TEXT, value: this.state.mainInput},
        contentKeys: [...this.state.contentKeys, "content_"+counter],
        mainInput: ""
      });
      counter++;
      this.refs.scrollView.scrollToEnd();
    }
    Keyboard.dismiss();
  }

  handleUploadImagePress() {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (resoponse.uri) {
        let source = { uri: response.uri };
        this.setState({
          fileSource: source,
          filePath: response.path
        });
      }
    });
  }

  handlePressUploadImage() {
    ImagePicker.launchImageLibrary({mediaType: "image"}, (response)  => {
      if (response.uri) {
        this.setState({
          fileSourceUri: response.uri,
          filePath: response.path,
          fileType: IMAGE
        });
      }
    });
  }

  handlePressUploadVideo() {
    ImagePicker.launchImageLibrary({mediaType: "video"}, (response)  => {
      if (response.uri) {
        this.setState({
          fileSourceUri: response.uri,
          filePath: response.path,
          fileType: VIDEO
        });
      }
    });
  }

  handlePressSubmit() {
    if (this.state.text) {
      Alert.alert(
        "",
        "Wollen Sie den Beitrag hochladen?",
        [
          {text: 'Nein', onPress: () => {}},
          {text: 'Ja', onPress: () => this.handleSubmit()},
        ],
        { cancelable: false }
      )
    }
  }

  handleSubmit() {
    //const content = this.state.contentKeys.map(contentKey => {
    //  return this.state[contentKey];
    //});
    //this.props.startConversation(data);
    const payload = {
      text: this.state.text,
      filePath: this.state.filePath,
      staticAssetType: this.state.fileType
    };
    this.props.startConversation(payload);
  }

  render() {
    const {
      inputContainerStyle,
      inputStyle,
      sendButtonContainerStyle
    } = styles;
    let allRows = [];
    const contentComponents = this.state.contentKeys.map((contentKey, index) => {
      if (this.state[contentKey].type === TEXT) {
        return (
          <TextInput
            key={contentKey}
            value={this.state[contentKey].value}
            onChangeText={(text) => {
              let contentKeys = this.state.contentKeys;
              if (!text) {
                this.setState({
                  contentKeys: [
                    ...contentKeys.slice(0, contentKeys.indexOf(contentKey)), 
                    ...contentKeys.slice(contentKeys.indexOf(contentKey)+1)
                  ]
                });
              } else {
                this.setState({[contentKey]: {type: TEXT, value: text}});
              }
            }}
            multiline={true}
            underlineColorAndroid="transparent"
            style={{backgroundColor: "#FFF", marginBottom: 10}}
          />
        );
      }
    });
    return (
      <View style={{flex: 1, marginTop: 10}}>
        <ScrollView style={{flex: 1}}>
          <TextInput
            onChangeText={(text) => this.setState({text: text})}
            value={this.state.text}
            multiline={true}
            style={{backgroundColor: "#FFF"}}
          />
          <View style={{marginTop: 10}}>
          {this.state.fileType === IMAGE && 
            <Image 
              source={{uri: this.state.fileSourceUri}} 
              style={{width: "100%", height: 400}} 
            />
          }
          {this.state.fileType === VIDEO &&
            <VideoPlayer
              video={{uri: this.state.fileSourceUri}}
            />
          }
          </View>
        </ScrollView>
        <View style={{flexDirection:"row", justifyContent:"space-around", backgroundColor: "#FFF"}}>
          <View style={{flex:1, flexDirection:"row"}}>
            <TouchableOpacity 
              style={{marginLeft:20}}
              onPress={this.handlePressUploadImage.bind(this)}
            >
              <Icon name="image" size={40} style={{flexDirection:"row", alignItems: "center"}}/> 
            </TouchableOpacity>
            <TouchableOpacity 
              style={{marginLeft:20}}
              onPress={this.handlePressUploadVideo.bind(this)}
            >
              <Icon name="video" size={40} style={{flexDirection:"row", alignItems: "center"}}/> 
            </TouchableOpacity>
          </View>
          <View style={{flex:1, flexDirection:"row", justifyContent:"flex-end"}}>
            <TouchableOpacity style={{marginRight:20}}
              onPress={this.handlePressSubmit.bind(this)}
            >
              <Icon name="send" size={40} />            
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  inputContainerStyle: {
    flexDirection: "row"
  },
  inputStyle: {
    backgroundColor: "#FFF",
    flex: 4
  },
  sendButtonContainerStyle: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center"
  }
};

export default StackNavigator({
  StartConversationScreen: {
    screen: connect(null, {startConversation})(StartConversationScreen)
  },
  //SingleConversation: {
  //  screen: SingleConversationScreen
  //},
  //PostReply: {
  // screen: PostReplyScreen
  //}
},
{
  /* The header config from HomeScreen is now here */
  navigationOptions: ({ navigation }) => ({
    headerTitle: JSON.stringify(this.props),
    headerLeft: (
      <TouchableOpacity
        onPress={() => { navigation.navigate('DrawerOpen') }}
      >
        <Image 
          source={require("../../static/images/more_vert_black.png")}
          style={{ width: 40, height: 40}}
        />
      </TouchableOpacity>
    ),
  })
});