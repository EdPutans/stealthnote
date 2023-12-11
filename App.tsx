import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StatusBar as StatusBarRN,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

// switch
/**
 * 
    <Switch
        trackColor={{ false: "gray", true: "pink" }}
        thumbColor={"white"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setIsEnabled(!isEnabled)}
        value={isEnabled}
      ></Switch>
 */

function getRandomHexColor() {
  // Generating a random number between 0 and 16777215 (0xffffff)
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  // Adding zeros to ensure the color has six digits
  return "#" + "0".repeat(6 - randomColor.length) + randomColor;
}

function getFontColrBasedOnBGLuma(background): "white" | "#222" {
  // let color = 'white'
  var c = background.substring(1); // strip #
  var rgb = parseInt(c, 16); // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff; // extract red
  var g = (rgb >> 8) & 0xff; // extract green
  var b = (rgb >> 0) & 0xff; // extract blue
  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 70) {
    return "white";
  }

  return "#222";
}

export default function App() {
  const [text, setText] = useState("");
  const ref = useRef(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [bg, setBg] = useState("");
  const [shouldUseTheme, setShouldUseTheme] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("text").then((r) => setText(r || ""));
    AsyncStorage.getItem("bg").then((r) => setBg(r || ""));
    AsyncStorage.getItem("shouldUseTheme").then((r) =>
      setShouldUseTheme(JSON.parse(r))
    );

    if (ref.current) ref.current.focus();
  }, []);

  function changeText(e) {
    setText(e);
    setConfirmClear(false);
    AsyncStorage.setItem("text", e);
  }

  const colorScheme = useColorScheme();
  const themeBackgroundColor = colorScheme === "light" ? bg : "#222";
  // const backgroundColor = colorScheme === "light" ? "white" : "#222";

  const bgToUse = shouldUseTheme ? themeBackgroundColor : bg;
  const textColor =
    getFontColrBasedOnBGLuma(bgToUse) === "#222" ? "#222" : "white";

  const toggleShouldUseTheme = () => {
    setShouldUseTheme(!shouldUseTheme);
    AsyncStorage.setItem("shouldUseTheme", JSON.stringify(!shouldUseTheme));
  };

  const handleRandomBg = () => {
    const color = getRandomHexColor();
    setBg(color);
    AsyncStorage.setItem("bg", color);
  };

  const handleClear = () => {
    if (confirmClear) {
      AsyncStorage.setItem("text", "", () => {
        setText("");
        setConfirmClear(false);
      });
      return;
    }
    setConfirmClear(true);
    setTimeout(() => {
      setConfirmClear(false);
    }, 4000);
  };

  const touchableStyle = {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
  };

  return (
    // <View style={{ flex: 1, backgroundColor }}>
    <View style={{ flex: 1, backgroundColor: bgToUse }}>
      <StatusBar backgroundColor="rgba(0,0,0,0.1)" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 5,
          marginTop: StatusBarRN.currentHeight,
        }}
      >
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={textColor}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleShouldUseTheme}
          value={shouldUseTheme}
        ></Switch>
        <TouchableOpacity onPress={handleRandomBg} disabled={shouldUseTheme}>
          <Text style={{ color: !shouldUseTheme ? textColor : "lightgrey" }}>
            Random color
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={touchableStyle} onPress={handleClear}>
          <Text style={{ color: textColor }}>
            {confirmClear ? "Are you sure?" : "Clear"}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        multiline
        verticalAlign="top"
        textAlignVertical="top"
        ref={ref}
        style={{ ...styles.input, color: textColor }}
        selectTextOnFocus={false}
        numberOfLines={20}
        cursorColor={"pink"}
        value={text}
        onChangeText={changeText}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    width: "100%",
    fontSize: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
