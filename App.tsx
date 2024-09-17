import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import useColors from "./hooks/useColors";
import useDebounce from "./hooks/useDebounce";
import { styles } from "./styles";

export default function App() {
  const ref = useRef(null);

  const [text, setText] = useState("");
  const [undoState, setUndoState] = useState([text]);

  const { textColor, backgroundColor } = useColors();

  const isUndoDisabled = undoState.length <= 1;

  useEffect(() => {
    // on init, grab the text from storage and reset the undo state to nothing
    AsyncStorage.getItem("text").then((r) => {
      setText(r || "")
      setUndoState([r || ""])
    });

    if (ref.current) ref.current.focus();
  }, []);

  const handleChangeText = React.useCallback(e => {
    setText(e);
    AsyncStorage.setItem("text", e);
  }, [setText]);

  const handleUndo = React.useCallback(() => {
    // because structuredClone is too much to ask for
    const undoStateCopy = JSON.parse(JSON.stringify(undoState));
    undoStateCopy.pop();

    const newTextVal = undoStateCopy[undoStateCopy.length - 1]

    handleChangeText(newTextVal);
    setUndoState(undoStateCopy);
  }, [undoState, setUndoState, handleChangeText]);

  const addToUndo = React.useCallback((newText: string) => {
    if (undoState[undoState.length - 1] === newText) return;

    setUndoState(c => [...c, newText]);
  }, [undoState, setUndoState, text])

  const debouncedUndoStateUpdate = useDebounce(addToUndo, 500)

  const handleUpdateText = React.useCallback((newText) => {
    handleChangeText(newText);
    debouncedUndoStateUpdate(newText)
  }, [handleChangeText, debouncedUndoStateUpdate]);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar backgroundColor="rgba(0,0,0,0.1)" />
      <View
        style={styles.statusBar}
      >
        <TouchableOpacity
          style={styles.undoButtonWrapper}
          onPress={handleUndo}
          disabled={isUndoDisabled}
        >
          <View style={styles.topSection}>
            <Text style={{ color: isUndoDisabled ? 'grey' : textColor }}>
              ↩︎ Undo
            </Text>
            <Text style={{ color: isUndoDisabled ? 'grey' : textColor, fontSize: 10 }}>
              {undoState.length > 1 ? ` [${undoState.length - 1}]` : "  "}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TextInput
        multiline
        verticalAlign="top"
        textAlignVertical="top"
        ref={ref}
        style={{
          ...styles.content,
          color: textColor
        }}
        selectTextOnFocus={false}
        numberOfLines={20}
        cursorColor={textColor}
        value={text}
        onChangeText={handleUpdateText}
      />
    </View>
  );
}
