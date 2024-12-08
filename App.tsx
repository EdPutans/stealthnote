import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import useColors from "./hooks/useColors";
import useDebounce from "./hooks/useDebounce";
import useTapCheckbox from "./hooks/useTapCheckbox";
import { styles } from "./styles";

const tabNumbers = [1, 2, 3, 4] as const;
type Tab = (typeof tabNumbers)[number];

export default function App() {
  const ref = useRef(null);

  const [text, setText] = useState<{ [K in Tab]: string }>({
    "1": "",
    "2": "",
    "3": "",
    "4": "",
  });
  const [undoState, setUndoState] = useState<{ [K in Tab]: string[] }>({
    "1": [""],
    "2": [""],
    "3": [""],
    "4": [""],
  });

  const [displayTabs, setDisplayTabs] = useState<boolean>(false);
  const [tab, setTab] = useState<Tab>(1);

  const { textColor, backgroundColor } = useColors();

  const isUndoDisabled = undoState[tab].length <= 1;

  const storageKey = "text-" + tab;

  const implemetTabsPotentially = async () => {
    const legacyText = await AsyncStorage.getItem("text");

    if (legacyText && !AsyncStorage.getItem("text-1")) {
      await AsyncStorage.setItem("text-1", legacyText);
      await AsyncStorage.setItem("text-2", "");
      await AsyncStorage.setItem("text-3", "");
      await AsyncStorage.setItem("text-4", "");

      await AsyncStorage.removeItem("text");
    }
  };

  useEffect(() => {
    implemetTabsPotentially();
  }, []);

  useEffect(() => {
    // on init, grab the text from storage and reset the undo state to nothing
    Promise.all([
      AsyncStorage.getItem("text-1"),
      AsyncStorage.getItem("text-2"),
      AsyncStorage.getItem("text-3"),
      AsyncStorage.getItem("text-4"),
    ]).then((r) => {
      setText({
        "1": r[0],
        "2": r[1],
        "3": r[2],
        "4": r[3],
      });
      setUndoState({
        "1": [r[0]],
        "2": [r[1]],
        "3": [r[2]],
        "4": [r[3]],
      });
    });

    if (ref.current) ref.current.focus();
  }, []);

  useEffect(() => {
    // on init, grab the text from storage and reset the undo state to nothing
    AsyncStorage.getItem(storageKey).then((r) => {
      setText({ ...text, [tab]: r });
    });

    if (ref.current) ref.current.focus();
  }, [tab]);

  const handleChangeText = React.useCallback(
    (e) => {
      setText({ ...text, [tab]: e });
      AsyncStorage.setItem(storageKey, e);
    },
    [setText, storageKey, text]
  );

  const handleUndo = React.useCallback(() => {
    // because structuredClone is too much to ask for
    const undoStateCopy = JSON.parse(JSON.stringify(undoState));

    undoStateCopy[tab].pop();

    const lastItemIndex = undoStateCopy[tab].length - 1;
    const newTextVal = undoStateCopy[tab][lastItemIndex];

    handleChangeText(newTextVal);
    setUndoState(undoStateCopy);
  }, [undoState, setUndoState, handleChangeText, text, tab]);

  const addToUndo = React.useCallback(
    (newText: string) => {
      if (undoState[undoState[tab].length - 1] === newText) return;

      setUndoState((c) => ({
        ...c,
        [tab]: [...c[tab], newText],
      }));
    },
    [undoState, setUndoState, text]
  );

  const debouncedUndoStateUpdate = useDebounce(addToUndo, 500);

  const handleUpdateText = React.useCallback(
    (newText) => {
      handleChangeText(newText);
      debouncedUndoStateUpdate(newText);
    },
    [handleChangeText, debouncedUndoStateUpdate, addToUndo]
  );

  const { handleTap, handleSelectionChange } = useTapCheckbox({
    text: text[tab],
    handleUpdateText,
  });

  const getTabNameCondensed = async (tabNumber: number) => {
    const elipsedText = await AsyncStorage.getItem(`text-${tabNumber}`);

    return elipsedText ? elipsedText.slice(0, 10) + "..." : "";
  };

  return (
    <View style={{ ...styles.container, backgroundColor }}>
      <StatusBar backgroundColor="rgba(0,0,0,0.1)" />
      {/* <Text>{JSON.stringify(undoState)}</Text> */}
      {/* <Text>{JSON.stringify(text)}</Text> */}
      <View style={styles.statusBar}>
        <TouchableOpacity
          style={styles.undoButtonWrapper}
          onPress={() => setDisplayTabs((prev) => !prev)}
        >
          <Text style={{ color: isUndoDisabled ? "grey" : textColor }}>
            {displayTabs ? "Hide tabs" : "Show Tabs"} [#{tab}]
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.undoButtonWrapper}
          onPress={handleUndo}
          disabled={isUndoDisabled}
        >
          <View style={styles.topSection}>
            <Text style={{ color: isUndoDisabled ? "grey" : textColor }}>
              ↩︎ Undo
            </Text>
            <Text
              style={{
                color: isUndoDisabled ? "grey" : textColor,
                fontSize: 10,
              }}
            >
              {undoState[tab].length > 1
                ? ` [${undoState[tab].length - 1}]`
                : "  "}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        {displayTabs &&
          tabNumbers.map((tabNumber) => (
            <TouchableOpacity
              key={tabNumber}
              onPress={() => setTab(tabNumber)}
              style={{
                borderBottomWidth: 1,
                borderStyle: "solid",
                borderBottomColor: tabNumber === tab ? "pink" : "grey",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: 30,
              }}
            >
              <Text style={{ color: textColor }}>{tabNumber}</Text>
            </TouchableOpacity>
          ))}
      </View>
      <TextInput
        multiline
        onSelectionChange={handleSelectionChange}
        onPressIn={handleTap}
        verticalAlign="top"
        textAlignVertical="top"
        ref={ref}
        style={{
          ...styles.content,
          color: textColor,
        }}
        selectTextOnFocus={false}
        numberOfLines={20}
        cursorColor={textColor}
        value={text[tab]}
        onChangeText={handleUpdateText}
      />
    </View>
  );
}
