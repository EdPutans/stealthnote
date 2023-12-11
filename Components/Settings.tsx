import { Icon, Image } from "native-base";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export const CustomDrawerNavigation = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 250, backgroundColor: "#d2d2d2", opacity: 0.9 }}>
        <View
          style={{
            height: 200,
            backgroundColor: "Green",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            // source={require("./assets/no-image.png")}
            style={{ height: 150, width: 150, borderRadius: 60 }}
          />
        </View>
        <View
          style={{
            height: 50,
            backgroundColor: "Green",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Test</Text>
        </View>
      </View>
      <ScrollView>
        <Text>BLA!!!</Text>
      </ScrollView>
      <View style={{ alignItems: "center", bottom: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "column", marginRight: 15 }}>
            <Icon
              name="flask"
              style={{ fontSize: 24 }}
              onPress={() => console.log("Tıkladın")}
            />
          </View>
          <View style={{ flexDirection: "column" }}>
            <Icon
              name="call"
              style={{ fontSize: 24 }}
              onPress={() => console.log("Tıkladın")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
