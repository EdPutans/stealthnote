import React, { useState } from "react";
import { Button, StatusBar, Switch, Text, View } from "react-native";
import useColors from "./useColors";

const SettingsField = () => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{ flexDirection: "column", flex: 1, backgroundColor: "pink" }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>Header</Text>
        <Text style={{ fontSize: 12 }}></Text>
      </View>
      <View></View>
    </View>
  );
};

const Settings = (props) => {
  const [settingsState, setSettingsState] = useState({});
  const settings = [{ name: "Theme", type: "toggle" }];

  const { textColor, backgroundColor } = useColors();

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View style={{ maxWidth: 100, alignSelf: "flex-end" }}>
        <Button
          title="close"
          color={"transparent"}
          onPress={(e) => props.setShowSettings(!props.showSettings)}
        />
      </View>
      <StatusBar />
      <SettingsField />
      {settings.map((setting) => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Switch
            value={settingsState[setting.name]}
            onValueChange={(value) => {
              setSettingsState({ ...settingsState, [setting.name]: value });
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default Settings;
