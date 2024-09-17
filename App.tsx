import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StatusBar as StatusBarRN,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import useColors from "./Components/useColors";
import { useDebounce } from "./Components/useDebounce";
import React = require("react");

export default function App() {
  const ref = useRef(null);

  const [text, setText] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("text").then((r) => 
      {
        setText(r || "")
        setUndoState([r || ""])
  });

    if (ref.current) ref.current.focus();
  }, []);

  function changeText(e) {
    setText(e);
    AsyncStorage.setItem("text", e);
  }

  const {
    textColor,
    backgroundColor,
  } = useColors();


  const [undoState, setUndoState] = useState([text]);

  const handleUndo = () => {
    const undoState2 = JSON.parse(JSON.stringify(undoState));
    undoState2.pop();

    const newTextVal = undoState2[undoState2.length - 1]

    changeText(newTextVal);
    setUndoState(undoState2);
  };

  const addToUndo = React.useCallback((newText: string) => {
    if(undoState[undoState.length - 1] === newText) return;
    
      setUndoState(c=>[...c, newText]);
  },[
    undoState,
    setUndoState,
    text,
  ])

const deb = useDebounce(addToUndo, 500)

  const handleUpdateText = (newText) => {
    changeText(newText);
    deb(newText)
  }

  const isUndoDisabled = undoState.length <= 1;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar backgroundColor="rgba(0,0,0,0.1)" />

      <View
        style={{
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: 5,
          marginTop: StatusBarRN.currentHeight,
        }}
      >
        <TouchableOpacity
          style={{ padding: 5 }}
          onPress={handleUndo}
          disabled={isUndoDisabled}
        >
          <View style={{ flexDirection: 'row'}}>
          <Text style={{ color: isUndoDisabled ?  'grey': textColor  }}>
            ↩︎ Undo
          </Text>
          <Text style={{ color: isUndoDisabled ?  'grey': textColor, fontSize: 10 }}>
            {undoState.length > 1 ? ` [${undoState.length - 1}]` : "   "}
          </Text>
          </View>
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
        cursorColor={textColor}
        value={text}
        onChangeText={handleUpdateText}
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
