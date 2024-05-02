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
  const colorScheme = useColorScheme();

  return {
    textColor:  colorScheme === "dark" ? "white" : "#222",
    backgroundColor: colorScheme === "light" ? "white" : "#222"
  };
};

export default useColors;
