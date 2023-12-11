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
} from "react-native";
import Settings from "./Components/Settings";
import useColors from "./Components/useColors";

export default function App() {
  const ref = useRef(null);

  const [text, setText] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("text").then((r) => setText(r || ""));

    if (ref.current) ref.current.focus();
  }, []);

  function changeText(e) {
    setText(e);
    setConfirmClear(false);
    AsyncStorage.setItem("text", e);
  }

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

  const {
    textColor,
    backgroundColor,
    handleRandomBg,
    toggleShouldUseTheme,
    shouldUseTheme,
  } = useColors();

  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) return <Settings />;

  return (
    <View style={{ flex: 1, backgroundColor }}>
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
        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          style={touchableStyle}
        >
          <Text>⚙️</Text>
        </TouchableOpacity>
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
