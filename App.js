import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Button,
  LogBox
} from 'react-native';

import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['expo-permissions is now deprecated']);

export default class UploadImage extends Component {

  constructor() {
    super();
    this.state = {
      image: null,
      imageuri: "",
      predictedNum: ""
    };
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "") {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      if (status !== "granted") alert("Sorry, we need camera roll permissions to make this work");
    }
  }

  selectPicture = async () => {
    try {
      const { cancelled, uri, data } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!cancelled) {
        this.setState({ image: data })
        await this.uploadImage(uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1]
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type
    };
    data.append("image", fileToUpload);

    await axios.post("https://3e9d-103-160-194-10.ngrok.io/prdctAlphFrmImage", data, {
      headers: {
        "content-type": "multipart/form-data",
      }
    }).then((response) => {
      var data = response.data["predicted-alphabet"];
      console.log(data)
      this.setState({ predictedNum: data })
    })
      .catch((err) => {
        console.log("Error:", err)
      });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Button
          onPress={() => this.selectPicture()}
          title="Select Image"
        />
        <Text>{this.state.predictedNum}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: '40%',
    height: '20%',
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
