import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  Alert,
  NativeModules,
  TouchableWithoutFeedback,
  NativeEventEmitter,
  Platform,
  BackHandler
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { StackNavigator } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob'
import VideoPlayer from 'react-native-video-player';
import FitImage from 'react-native-fit-image';
//import RNFS from "react-native-fs";
const PESDK = NativeModules.PESDK;
const PESDKEmitter = new NativeEventEmitter(PESDK);

import Conversation from "./Conversation";
import { startConversation, selectConversation, updateNewInput } from "../reducers/chat/actions";
import { loadStart, loadFinish } from "../reducers/app/actions";
import Modal from "react-native-modal";
import { isBase64Bigger } from "../utils/utils";

import {
  Button,
  Card,
  CardSection,
  Input,
  ModalButton
} from "./common";

const newInputFieldKeys = {
  TEXT: "text",
  FILE_TYPE: "fileType",
  FILE_PATH: "filePath",
  IS_ANON: "isAnon",
  SHOW_MODAL: "showModal"
};


class StartConversationScreen extends Component {
  static navigationOptions = {
    title: 'Neue Konversation',
  };

  constructor(props) {
    super(props);
    if (this.props.navigation.state.params && this.props.navigation.state.params.shouldResetFields) {
      this.props.selectConversation(null);
    }
    PESDKEmitter.addListener("PhotoEditorDidSave", file => {
      RNFetchBlob.fs.writeFile(`${RNFetchBlob.fs.dirs.DocumentDir}/img.jpg`, file.data, "base64").then(() => {
        props.updateNewInput({
          [newInputFieldKeys.FILE_TYPE]: "image",
          [newInputFieldKeys.FILE_PATH]: `${RNFetchBlob.fs.dirs.DocumentDir}/img.jpg`,
          [newInputFieldKeys.SHOW_MODAL]: false
        });
      });
    });
    PESDKEmitter.addListener("PhotoEditorDidCancel", file => {
      props.updateNewInput({[newInputFieldKeys.SHOW_MODAL]: false});
    });

    BackHandler.addEventListener('hardwareBackPress', () => {
      props.selectConversation(null);
    });
  }

  handlePressUploadImage() {
    ImagePicker.launchImageLibrary({mediaType: "image"}, (response)  => {
      if (response.uri) {
        if (isBase64Bigger(response.data, 50)) {
          Alert.alert(
            "Fehler",
            "Das Foto ist zu gross. Es muss kleiner als 50MB sein.",
            [
              {text: "OK"}
            ],
            { cancelable: false }
          );
        } else {
          if (Platform.OS === "ios") {
            PESDK.present(response.uri.substring(7));
          } else {
            this.props.updateNewInput({
              [newInputFieldKeys.FILE_TYPE]: "image",
              [newInputFieldKeys.FILE_PATH]: response.path,
              [newInputFieldKeys.SHOW_MODAL]: false
            });
            PESDK.present(response.path, (resultPath) => this.props.updateNewInput({[newInputFieldKeys.FILE_PATH]: resultPath}));
          }
        }
      }
    });
  }

  handlePressOpenCamera() {
    ImagePicker.launchCamera({mediaType: "image"}, (response)  => {
      if (response.uri) {
        if (isBase64Bigger(response.data, 50)) {
          Alert.alert(
            "Fehler",
            "Das Foto ist zu gross. Es muss kleiner als 50MB sein.",
            [
              {text: "OK"}
            ],
            { cancelable: false }
          );
        } else {
          if (Platform.OS === "ios") {
            PESDK.present(response.uri.substring(7));
          } else {
            this.props.updateNewInput({
              [newInputFieldKeys.FILE_TYPE]: "image",
              [newInputFieldKeys.FILE_PATH]: response.path,
              [newInputFieldKeys.SHOW_MODAL]: false
            });
            PESDK.present(response.path, (resultPath) => this.props.updateNewInput({[newInputFieldKeys.FILE_PATH]: resultPath}));
          }
        }
      }
    });
  }

  handlePressUploadVideo() {
    this.props.loadStart();
    ImagePicker.launchImageLibrary({mediaType: "video"}, (response)  => {
      if (response.uri) {
        let path;
        if (Platform.OS === "ios") {
          path = response.uri.substring(7);
        } else {
          path = response.path;
        }
        RNFetchBlob.fs.readFile(path, "base64").then(res => {
          this.props.loadFinish();
          if (isBase64Bigger(res, 50)) {
            Alert.alert(
              "Fehler",
              "Das Video ist zu gross. Es muss kleiner als 50MB sein.",
              [
                {text: "OK"}
              ],
              { cancelable: false }
            );
            return;
          } else {
            this.props.updateNewInput({
              [newInputFieldKeys.FILE_TYPE]: "video",
              [newInputFieldKeys.FILE_PATH]: path,
              [newInputFieldKeys.SHOW_MODAL]: false
            });
          }
        });
      } else {
        this.props.loadFinish();
      }
    });
  }

  handlePressOpenCamcorder() {
    this.props.loadStart();
    ImagePicker.launchCamera({mediaType: "video"}, (response)  => {
      if (response.uri) {
        let path;
        if (Platform.OS === "ios") {
          path = response.uri.substring(7);
        } else {
          path = response.path;
        }
        RNFetchBlob.fs.readFile(path, "base64").then(res => {
          this.props.loadFinish();
          if (isBase64Bigger(res, 50)) {
            Alert.alert(
              "Fehler",
              "Das Video ist zu gross. Es muss kleiner als 50MB sein.",
              [
                {text: "OK"}
              ],
              { cancelable: false }
            );
            return;
          } else {
            this.props.updateNewInput({
              [newInputFieldKeys.FILE_TYPE]: "video",
              [newInputFieldKeys.FILE_PATH]: path,
              [newInputFieldKeys.SHOW_MODAL]: false
            });
          }
        });
      } else {
        this.props.loadFinish();
      }
    });
  }

  handlePressSubmit() {
    if (this.props.text) {
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
    const payload = {
      text: this.props.text,
      filePath: this.props.filePath,
      staticAssetType: this.props.fileType,
      isAnon: this.props.isAnon
    };
    this.props.startConversation(payload);
  }

  renderConversation() {
    if (this.props.selectedConversation) {
      const { text, staticAssetUid, staticAssetType, Replies } = this.props.selectedConversation;
      return (
        <Conversation 
          conversation={this.props.selectedConversation}
          navigation={this.props.navigation}
          isNewInput={true}
        />
      );
    }
  }

  render() {
    const {
      inputContainerStyle,
      inputStyle,
      sendButtonContainerStyle
    } = styles;
    const { text, fileType, filePath, isAnon, showModal } = this.props;
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={showModal}
        >
        <TouchableHighlight 
          underlayColor="#FFFFFF00"
          style={{ flex:1, justifyContent:"center"}} 
          onPress={() => this.props.updateNewInput({[newInputFieldKeys.SHOW_MODAL]: false})}>
          <View style={{backgroundColor:"#eaeaea", paddingTop: "5%", paddingBottom:"5%"}}>
            <View>
              <ModalButton 
                text="Foto hochladen" 
                buttonContainerStyle={{borderTopWidth: 1}}
                onPress={this.handlePressUploadImage.bind(this)}
              >
                <Icon name="file-image" size={40} style={{flexDirection:"row", alignItems: "center"}}/>
              </ModalButton>
              <ModalButton text="Video hochladen" onPress={this.handlePressUploadVideo.bind(this)}>
                <Icon name="file-video" size={40} style={{flexDirection:"row", alignItems: "center"}}/>
              </ModalButton>
              <ModalButton text="Foto aufnehmen" onPress={this.handlePressOpenCamera.bind(this)}>
                <Icon name="camera" size={40} style={{flexDirection:"row", alignItems: "center"}}/>
              </ModalButton>
              {/*<ModalButton text="Video aufnehmen" onPress={this.handlePressOpenCamcorder.bind(this)}>
                <Icon name="video" size={40} style={{flexDirection:"row", alignItems: "center"}}/>
              </ModalButton>*/}
            </View>
          </View>
          </TouchableHighlight>
        </Modal>
        
        <ScrollView 
          style={{flex: 1}}
          onPress={() => this.props.updateNewInput({[newInputFieldKeys.SHOW_MODAL]: false})}
        >  
          {this.renderConversation()}
          <View style={{marginLeft:this.props.selectedConversation ? "20%" : 0}}>
            {fileType === "image" &&
              <FitImage 
                source={{uri: "file://"+filePath }} 
              />
            }
            {fileType === "video" &&
              <VideoPlayer
                video={{uri: "file://"+filePath }}
              />
            }
            <TextInput
              onChangeText={(text) => this.props.updateNewInput({[newInputFieldKeys.TEXT]: text})}
              value={text}
              multiline={true}
              style={{backgroundColor: "#FFF"}}
              placeholder="Text schreiben"
              underlineColorAndroid="#FFF"
              style={{backgroundColor:"#FFF", marginTop:"5%", padding:10}}
            />
          </View>
        </ScrollView>
        <View 
          style={{
            flexDirection:"row", 
            justifyContent:"space-between", 
            backgroundColor: "#F8F8F8", 
            padding:5,
            borderTopWidth:1,
            borderColor: "grey"
          }}
        >
          <View style={{flexDirection:"row", marginRight:"10%"}}>
            {!this.props.selectedConversation &&
              <TouchableOpacity 
                style={{marginLeft:20,paddingTop:3}}
                onPress={() => this.props.updateNewInput({[newInputFieldKeys.IS_ANON]: !isAnon})}
              >
                <IconFontAwesome
                  color={isAnon ? "#000" : "grey"}
                  name="user-secret" size={40} 
                  style={{flexDirection:"row", alignItems: "center"}}
                /> 
              </TouchableOpacity>
            }
            <TouchableOpacity 
              style={{marginLeft:20,paddingTop:1}}
              onPress={() => this.props.updateNewInput({[newInputFieldKeys.SHOW_MODAL]: true})}
            >
              <Icon color="grey" name="paperclip" size={40} style={{flexDirection:"row", alignItems: "center"}}/> 
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
            <TouchableOpacity style={{marginRight:20}}
              onPress={this.handlePressSubmit.bind(this)}
            >
              <Icon color="grey" name="send" size={40} />            
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

const mapStateToProps = state => {
  return {
    selectedConversation: state.chat.selectedConversation,
    text: state.chat.newInput.text,
    fileType: state.chat.newInput.fileType,
    filePath: state.chat.newInput.filePath,
    isAnon: state.chat.newInput.isAnon,
    showModal: state.chat.newInput.showModal
  };
};

export default connect(mapStateToProps, {
  startConversation,
  selectConversation,
  loadStart, 
  loadFinish,
  updateNewInput
})(StartConversationScreen);






