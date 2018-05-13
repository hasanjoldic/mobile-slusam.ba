import React, { Component } from "react";
import {
	Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from "react-native-image-picker";
import FitImage from "react-native-fit-image";

import { cmsColor } from "../../utils/utils";
import { setNav } from "../../reducers/nav/actions";
import { cmsSetSingleArtist } from "../../reducers/cms/actions";
import { loadStart, loadFinish, setErrorMessage } from "../../reducers/app/actions";
import StatusWrapper from "../hoc/StatusWrapper";

class _CmsNewArtist extends Component {

  state = {
    firstName: "",
    isGroup: false,
    lastName: "",
    imageUri: "",
    filePath: ""
  }

  componentDidMount() {
    this.props.setNav("CmsNewArtist");
  }

  handleUploadImageButtonPress() {
    ImagePicker.launchImageLibrary({mediaType: "image"}, (response)  => {
      if (response.uri) {
        this.setState({imageUri: response.uri, filePath: response.path});
      }
    });
  }

  handleSubmit() {
    const { firstName, isGroup, lastName, imageUri } = this.state;
    if (firstName && (!isGroup || lastName) && imageUri) {
      this.props.loadStart()
      const image = {
        uri: imageUri,
        type: "image/jpeg",
        name: "newImage"
      };
      const body = new FormData();
      body.append("image", image);
      body.append("artistName", firstName);
      body.append("artistLastName", lastName);
      body.append("isGroup", isGroup);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        },
        onUploadProgress: function( progressEvent ) {
          
        }
      }
      axios.post("http://46.101.191.69:3000/api/v1/add-artist", body, config)
      .then(res => {
        if (res.data.status === 200) {
          Alert.alert(
            "",
            "Uspješno ste dodali izvođača. Sada možete dodati pjesme.",
            [
              {text: 'OK', onPress: () => {
                  this.props.cmsSetSingleArtist(res.data.response);
                  this.props.navigation.navigate("cmsSingleArtist");
                }
              },
            ],
            { cancelable: false }
          );
        } else {
          this.props.setErrorMessage(res.data.response);
        }
      }).catch(err => {
        this.props.loadFinish();
      });
    }
  }

	render() {
    const { firstName, isGroup, lastName, filePath } = this.state;
		return (
      <StatusWrapper>
			<ScrollView keyboardShouldPersistTaps="handled" style={{flex:1,backgroundColor:"#FFF",paddingTop:20}}>
        <TextInput
          style={{
            padding:10,backgroundColor:"#FFF",margin:10,borderRadius:10,
            borderWidth:1,borderColor:cmsColor
          }}
          placeholder="Ime..."
          value={firstName}
          onChangeText={(text) => this.setState({firstName: text})}
        />
        <View style={{flexDirection:"row",margin:10}}>
          <TouchableOpacity style={{flexDirection:"row",marginRight:30,alignItems:"center"}}
            onPress={() => this.setState({isGroup: false})}>
            <Icon color={cmsColor} name={isGroup ? "radiobox-blank" : "radiobox-marked"} size={30} />
            <Text style={{color:cmsColor}}>Pjevač</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}}
            onPress={() => this.setState({isGroup: true})}>
            <Icon color={cmsColor} name={isGroup ? "radiobox-marked" : "radiobox-blank"} size={30} />
            <Text style={{color:cmsColor}}>Grupa</Text>
          </TouchableOpacity>
        </View>
        {!isGroup &&
        <TextInput
          style={{
            padding:10,backgroundColor:"#FFF",margin:10,borderRadius:10,
            borderWidth:1,borderColor:cmsColor
          }}
          placeholder="Prezime..."
          value={lastName}
          onChangeText={(text) => this.setState({lastName: text})}
        />} 
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
        {filePath ?
          <Image
            style={{margin:10,width:100,height:100,borderRadius:100,borderColor:cmsColor,borderWidth:1}}
            source={{uri: "file://"+filePath }} 
          /> : null}
        <TouchableOpacity
          style={{
            flexDirection:"row",justifyContent:"space-around",paddingRight:10,
            paddingLeft:10,backgroundColor:"#FFF",borderColor:cmsColor,borderWidth:1,
            width:"40%",borderRadius:10,margin:10,alignItems:"center"
          }}
          onPress={this.handleUploadImageButtonPress.bind(this)}
        >
          <Text style={{color:cmsColor,marginRight:10}}>Ubaci sliku</Text>
          <Icon color={cmsColor} name="file-image" size={40} />
        </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            padding:10,margin:10,backgroundColor:cmsColor,flexDirection:"row",justifyContent:"space-around",
            alignItems:"center",marginLeft:"50%",borderRadius:10,marginTop:30
          }}
          onPress={this.handleSubmit.bind(this)}
        >
          <Text style={{color:"#FFF",fontSize:22}}>Zapamti</Text>
          <Icon color="#FFF" name="content-save" size={40} />
        </TouchableOpacity>
      </ScrollView>
      </StatusWrapper>
		);
	}
}

const CmsNewArtist = connect(null, {setNav, loadStart, loadFinish, cmsSetSingleArtist})(_CmsNewArtist);

export { CmsNewArtist };