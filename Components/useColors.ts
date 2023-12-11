import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

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

const useColors = () => {
  const [bg, setBg] = useState("");
  const [shouldUseTheme, setShouldUseTheme] = useState(true);

  const colorScheme = useColorScheme();
  const themeBackgroundColor = colorScheme === "light" ? bg : "#222";

  const bgToUse = shouldUseTheme ? themeBackgroundColor : bg;
  const textColor =
    getFontColrBasedOnBGLuma(bgToUse) === "#222" ? "#222" : "white";

  useEffect(() => {
    AsyncStorage.getItem("bg").then((r) => setBg(r || ""));
    AsyncStorage.getItem("shouldUseTheme").then((r) =>
      setShouldUseTheme(JSON.parse(r))
    );
  }, []);

  const handleRandomBg = () => {
    const color = getRandomHexColor();
    setBg(color);
    AsyncStorage.setItem("bg", color);
  };

  const toggleShouldUseTheme = () => {
    setShouldUseTheme(!shouldUseTheme);
    AsyncStorage.setItem("shouldUseTheme", JSON.stringify(!shouldUseTheme));
  };

  return {
    textColor,
    backgroundColor: bgToUse,
    shouldUseTheme,
    handleRandomBg,
    toggleShouldUseTheme,
  };
};

export default useColors;
