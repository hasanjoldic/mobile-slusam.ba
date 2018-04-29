import React, { Component } from 'react';
import {
  Text,
  View,
  WebView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'react-native-fetch-blob'

const options = {
  fileCache: true,
  addAndroidDownloads : {
    useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
    notification : false,
    path:  RNFetchBlob.fs.dirs.DocumentDir + "/" + "test" + ".jpg", // this is the path where your downloaded file will live in
    description : 'Downloading image.'
  }
};

class ImageViewScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '',
    /*headerRight: 
      <TouchableOpacity
        style={{marginRight:10}}
        onPress={() => {
          console.log("NAV", navigation);
          RNFetchBlob.fetch('GET', navigation.state.params.imageUrl, {}).then(res => {
            RNFetchBlob.fs.writeFile(`${RNFetchBlob.fs.dirs.DocumentDir}/test.jpg`, res.data, "base64").then(() => {
              Alert.alert(
                "",
                "Das Foto ist herruntergeladen.",
                [
                  {text: "OK"}
                ],
                { cancelable: false }
              );
            });
          });
        }}
      >
        <Icon name="download" size={40} />
      </TouchableOpacity>
    */
  });

  componentDidMount() {
    this.props.navigation.setParams({
      imageUrl: this.props.imageUrl
    });
  }

  render() { 
    return (
      <View style={{flex: 1}}>
        <WebView
          source={{uri:this.props.imageUrl}}
        />
      </View>
    );
  }
}

const styles = {

};

const mapStateToProps = state => {
  return {
    imageUrl: state.app.imageUrl
  };
};

export default connect(mapStateToProps)(ImageViewScreen);






