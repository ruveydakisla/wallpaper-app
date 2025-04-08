import { Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
const ImageScreen = () => {
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("loading");
  let uri = item?.webformatURL;
  const imageUrl = uri;
  const fileName = item?.previewURL?.split("/").pop();
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const onLoad = () => {
    setStatus("");
  };
  const getSize = () => {
    const aspectRadio = item.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);

    let calculatedHeight = maxWidth / aspectRadio;
    let calculatedWidth = maxWidth;
    if (aspectRadio < 1) {
      calculatedWidth = calculatedHeight * aspectRadio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };
  const handleDownloadImage = async () => {
    if (Platform.OS == "web") {
      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.target = "_blank";
      anchor.download = fileName || "download";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      const { status: mediaLibStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (mediaLibStatus !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Resmi kaydetmek için galeri erişim izni gerekiyor."
        );
        return;
      }

      setStatus("downloading");
      const uri = await downloadFile();

      if (uri) {
        try {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync("İndirilenler", asset, false);
          showToast("Image downloaded");
        } catch (error) {
          Alert.alert("Hata", "Galeriye kaydetme başarısız: " + error.message);
        }
        setStatus("");
      }
    }
  };

  const handleShareImage = async () => {
    if (Platform.OS == "web") {
      showToast("Link copied");
    } else {
      setStatus("sharing");
      let uri = await downloadFile();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    }
  };
  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      console.log("downloaded at:", uri);
      setStatus("");

      return uri;
    } catch (error) {
      console.log("an error occured:", error.message);
      Alert.alert("Image", error.message);
      setStatus("");

      return null;
    }
  };
  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "bottom",
    });
  };
  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };
  const webButtonsStyle = Platform.OS == "web" && {
    backgroundColor: "gray",
    padding: 8,
    borderRadius: theme.radius.xl,
  };
  return (
    <BlurView style={[styles.container]}>
      <View style={[getSize()]}>
        <View style={styles.loading}>
          {status == "loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          onLoad={onLoad}
          transition={100}
          style={[styles.image, getSize()]}
          source={uri}
        />
      </View>
      <View style={[styles.buttons, webButtonsStyle]}>
        <Animated.View entering={FadeIn.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeIn.springify().delay(100)}>
          {status == "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable onPress={handleDownloadImage} style={styles.button}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeIn.springify().delay(200)}>
          {status == "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable onPress={handleShareImage} style={styles.button}>
              <Octicons name="share" size={22} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: wp(4),
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
});

export default ImageScreen;
