import React, { useState } from "react";
import { StatusBar, Switch, Text, View } from "react-native";
import useColors from "./useColors";

const Settings = () => {
  const [settingsState, setSettingsState] = useState({});
  const settings = [{ name: "Theme", type: "toggle" }];

  const { textColor, backgroundColor } = useColors();

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar />

      {settings.map(
        (setting) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={{ color: textColor, fontWeight: "bold" }}>
              {setting.name}
            </Text>

            <Switch
              value={settingsState[setting.name]}
              onValueChange={(value) => {
                setSettingsState({ ...settingsState, [setting.name]: value });
              }}
            />
          </View>
        )
        // return <View style={{ flexDirection: "row", padding: 10 }}>
        //   <Text>{setting.name}</Text>
        //   {setting.type === "toggle" && <Switch value={true} />}
        // </View>;
      )}
    </View>
  );
};

export default Settings;
